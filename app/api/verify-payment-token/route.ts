import jwt from "jsonwebtoken"
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

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: cors(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.PAYMENT_JWT_SECRET!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any

    if (payload.purpose !== "payment") {
      return NextResponse.json({ valid: false }, { status: 403 })
    }

    return NextResponse.json({
      valid: true,
      userId: payload.userId,
    }, { headers: cors(origin) })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}
