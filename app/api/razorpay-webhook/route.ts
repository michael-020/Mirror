import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

  const body = await req.text()
  const signature = req.headers.get("x-razorpay-signature")

  if (!signature) {
    return NextResponse.json({ msg: "Missing signature" }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex")

  if (expectedSignature !== signature) {
    return NextResponse.json({ msg: "Invalid webhook signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true })
  }

  const paymentEntity = event.payload.payment.entity
  const razorpayOrderId = paymentEntity.order_id
  const razorpayPaymentId = paymentEntity.id

  const payment = await prisma.payment.findUnique({
    where: { orderId: razorpayOrderId },
  })

  if (!payment) {
    return NextResponse.json({ msg: "Payment record not found" }, { status: 404 })
  }

  if (payment.status === "SUCCESS") {
    return NextResponse.json({ received: true })
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { orderId: razorpayOrderId },
      data: {
        status: "SUCCESS",
        paymentId: razorpayPaymentId,
      },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: { isPremium: true },
    }),
  ])


  return NextResponse.json({ received: true })
}
