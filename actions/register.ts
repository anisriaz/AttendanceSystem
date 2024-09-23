"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db"
import { RegisterSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "invalid fields" }
    };

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already exist!"};
    }

    await db.user.create({
        data: {
           name,
           email,
           password: hashedPassword,
        }
    });
    
    return { success: "User Created!" }
};
