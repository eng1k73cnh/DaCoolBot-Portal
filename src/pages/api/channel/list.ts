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
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  const session = await getServerSession(req, res, authOptions);

  try {
    if (session) {
      const fetchChannels = await rest.get(
        Routes.guildChannels(process.env.GUILD_ID!)
      );
      res.status(200).json(fetchChannels);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
