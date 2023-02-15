import type { NextApiRequest, NextApiResponse } from "next";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  const session = await getServerSession(req, res, authOptions);
  // Edit message using the message ID and channel ID
  // provided in the request body.
  try {
    if (session) {
      // Send message to the channel ID provided in the request body.
      const sendRequest = await rest.post(
        Routes.channelMessages(req.body.channelId),
        {
          body: {
            content: req.body.content,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      res.status(200).json(sendRequest);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
