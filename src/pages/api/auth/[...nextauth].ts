import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      console.log(token);
      session.user.id = token.sub;
      return Promise.resolve(session);
    },
  },
};

export default NextAuth(authOptions);
