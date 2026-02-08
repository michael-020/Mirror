import { authOptions } from "@/lib/server/authOptions";
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_PAYMENT_API_URL!;

function cors(origin: string | null): Record<string, string> {
  if (origin === ALLOWED_ORIGIN) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
  }

  return {};
}

export async function GET(req: NextRequest){
    const origin = req.headers.get("origin");
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { email: session.user.email },
            { headers: cors(origin) }
        )
    } catch (error) {
        console.error("Error while getting user email: ", error)
        return NextResponse.json(
            { msg: "Internal server error" },
            { status: 500 }
        )
    }
}