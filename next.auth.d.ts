import NextAuth, {type DefaultSession} from "next-auth"
import { UserRole } from "@prisma/client"


export type ExtenderUser  = DefaultSession ["user"] & {
    role: UserRole
    // isTwoFactorEnabled: boolean;
    isOAuth: boolean;
}

declare module "next-auth"{
interface Session {
  user: ExtenderUser;
}
}