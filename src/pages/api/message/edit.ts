import type { NextApiRequest, NextApiResponse } from "next";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!req.query.channelId || !req.query.messageId) {
    res.status(400).json({ error: "Missing channel ID" });
    return;
  }

  if (
    typeof req.query.channelId !== "string" ||
    typeof req.query.messageId !== "string"
  ) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  const session = await getServerSession(req, res, authOptions);

  const form = new IncomingForm();

  const data: { fields: formidable.Fields; files: formidable.Files } =
    await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

  const body = JSON.parse(data.fields.payload_json as string);
  const files = Object.values(data.files).map((file) => {
    if (Array.isArray(file)) file = file[0];
    return {
      name: file.originalFilename || file.newFilename,
      contentType: file.mimetype || undefined,
      data: fs.readFileSync(file.filepath),
    };
  });

  try {
    if (session) {
      const editRequest = await rest.patch(
        Routes.channelMessage(req.query.channelId, req.query.messageId),
        {
          body,
          files,
        }
      );
      res.status(200).json(editRequest);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}
