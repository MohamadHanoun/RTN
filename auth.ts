import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const adminDiscordIds = (process.env.ADMIN_DISCORD_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Discord],

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "discord") {
        token.discordId = account.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      const discordId = token.discordId as string | undefined;

      if (session.user) {
        session.user.id = discordId || "";
        session.user.isAdmin = discordId
          ? adminDiscordIds.includes(discordId)
          : false;
      }

      return session;
    },
  },
});