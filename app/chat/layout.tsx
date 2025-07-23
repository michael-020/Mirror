import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website Builder - Chat",
  description: "Build websites with AI assistance",
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
