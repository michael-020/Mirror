import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const otpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6, { message: "OTP must be exactly 6 characters" })
});

export async function POST(req: NextRequest){
    try {
        const validatedSchema = otpSchema.safeParse(await req.json())

        if(!validatedSchema.success){
            return NextResponse.json(
                { msg: "Invalid OTP" },
                { status: 403 }
            )
        }

        const { email, otp } = validatedSchema.data

        const otpRecord = await prisma.oTP.findUnique({
            where: {
                email
            }
        })

        if(!otpRecord){
            return NextResponse.json(
                { msg: "Invlid email" },
                { status: 403 }
            )
        }

        if(otpRecord.otp !== otp){
            return NextResponse.json(
                { msg: "Incorrect OTP" },
                { status: 403 }
            )
        }

        return NextResponse.json({ 
            msg: "Email verified successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error while verifying email: ", error)
        NextResponse.json(
            { msg: "Internal server error"},
            { status: 500 } 
        )
    }
}