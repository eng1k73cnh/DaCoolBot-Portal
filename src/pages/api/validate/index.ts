import type { NextApiRequest, NextApiResponse } from "next";
import { REST } from "@discordjs/rest";
import { Routes, APIGuildMember } from "discord-api-types/v10";
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
  const roleID = "785845106707136522";

  try {
    if (session) {
      // Get info of the user in a guild and return false if the user is not in the guild.
      const userInGuild = (await rest.get(
        Routes.guildMember(process.env.GUILD_ID!, session.user.id)
      )) as APIGuildMember;

      if (!userInGuild.roles) {
        res.status(200).json(false);
        return;
      }
      // Check if the user has the role.
      const hasRole = userInGuild.roles.includes(roleID);
      res.status(200).json(hasRole);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
