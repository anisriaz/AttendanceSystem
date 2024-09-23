import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";

export const { handlers: { GET, POST }, signIn, signOut, auth, handlers } = NextAuth({
  callbacks: {
    // async signIn({ user, account }) {
    //   // Allow OAuth without email verification
    //   if (account?.provider !== "credentials") return true;

    //   const existingUser = await getUserById(user.id);

    //   // Prevent sign in without email verification
    //   if (!existingUser || !existingUser.emailVerified) return false;

    //   return true; // Explicitly return true if sign-in is allowed
    // },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },

    async jwt({ token }) {
      // Allow OAuth without email verification
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
