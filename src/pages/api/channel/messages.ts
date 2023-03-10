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

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  const session = await getServerSession(req, res, authOptions);

  try {
    if (session) {
      const fetchMessages = await rest.get(
        Routes.channelMessages(req.query.channelId)
      );
      res.status(200).json(fetchMessages);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}
