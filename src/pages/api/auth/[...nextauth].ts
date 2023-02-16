import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { REST } from "@discordjs/rest";
import { Routes, APIGuildMember } from "discord-api-types/v10";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub;
      session.user.discriminator = token.discriminator;
      return Promise.resolve(session);
    },
    async signIn({ user }: any) {
      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
      console.log(user);

      try {
        const userInGuild = (await rest.get(
          Routes.guildMember(process.env.GUILD_ID!, user.id)
        )) as APIGuildMember;

        console.log(userInGuild);

        if (!userInGuild.roles) {
          return false;
        }

        const hasRole = userInGuild.roles.includes(process.env.ROLE_ID!);
        return hasRole;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token, profile }: any) {
      if (profile) {
        token.discriminator = profile.discriminator;
      }
      return Promise.resolve(token);
    },
  },
};

export default NextAuth(authOptions);
