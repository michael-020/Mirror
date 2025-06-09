import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest){
    try {
        const { name, username, email, password } = await req.json()
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
        console.error("Error while signing in/signing up: ", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}