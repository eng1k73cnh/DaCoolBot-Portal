import type { NextApiRequest, NextApiResponse } from "next";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!req.query.channelId || typeof req.query.channelId !== "string") {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  if (!req.query.messageId || typeof req.query.messageId !== "string") {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  const session = await getServerSession(req, res, authOptions);
  // Edit message using the message ID and channel ID
  // provided in the request body.
  try {
    if (session) {
      const messageContent = await rest.get(
        Routes.channelMessage(req.query.channelId, req.query.messageId)
      );
      res.status(200).json(messageContent);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
