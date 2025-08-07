"use client"

import { Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'

interface LoadingModalProps {
  message?: string
}

export function InitLoadingModal({ message = "Initialising project..." }: LoadingModalProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex flex-col gap-4 items-center justify-center z-50">
        <Loader2 className="size-10 text-blue-500 animate-spin" />
        <p className="text-gray-300 text-lg">{message}</p>
    </div>,
    document.body
  )
}