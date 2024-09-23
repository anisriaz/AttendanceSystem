import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/Credentials";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";


export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github ({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentionals){
       const valdatedFields = LoginSchema.safeParse(credentionals);

       if (valdatedFields.success){
        const { email, password} = valdatedFields.data

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;
       const passwordMatch = await bcrypt.compare(
        password,
        user.password,
       )
        if (passwordMatch) return user
       }
       return null;
      }
    })
  ],
} satisfies NextAuthConfig


