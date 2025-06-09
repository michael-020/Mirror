import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import z from "zod"

const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string()
        .min(8, "Password should be at least 8 characters")
        .max(100, "Password should not exceed 100 characters")
        .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
        .regex(/[0-9]/, "Password must contain at least 1 number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
})

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const checkBody = await signUpSchema.safeParse(body)
        if(checkBody.error){
            return NextResponse.json(
                { msg: "Invalid credentials" },
                { status: 400 }
            )
        }
        const { name, username, email, password } = checkBody.data
        // signup
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(existingUser){
            return NextResponse.json(
                { error: "An Account with this email already exists"},
                { status: 401}
            )
        }

        const existingUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(existingUsername){
            return NextResponse.json(
                { error: "Username already exists"},
                { status: 401}
            ) 
        }
        const hashedPassword = await bcrypt.hash(password, 6);
        await prisma.user.create({
            data: {
                name: name,
                username: username,
                email: email,
                password: hashedPassword
            }
        })

        return NextResponse.json(
            { msg: "Signed Up Successfully" },
            { status: 200}
        )
    } catch (error) {
        console.error("Error while signing up: ", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}