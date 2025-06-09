import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import z from "zod"

const registrationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    username: z.string()
})

export async function POST(req: NextRequest){
    try {
        const body = await req.json()
        const checkBody = registrationSchema.safeParse(body)
        if(checkBody.error){
            return NextResponse.json(
                { msg: "Invalid credentials"},
                { status: 400 }
            )
        }
        const { name, email, username } = checkBody.data

        const existingUsername = await prisma.user.findUnique({
            where: {username} 
        })

        if(existingUsername){
            return NextResponse.json(
                { msg: "Username already exists" },
                { status: 409 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if(existingUser){
            return NextResponse.json(
                { msg: "User with this"},
                { status: 409 }
            )
        }

        await prisma.user.create({
            data: {
                email, 
                username,
                name,
                password: null
            }
        })

        return NextResponse.json(
            { msg: "Sign up Successfull" },
            { status: 200 }
        )
    
    } catch (error) {
        console.error("Error while completing registration", error)
        return NextResponse.json(
            { msg: "Internal server error"},
            { status: 500}
        )
    }
}