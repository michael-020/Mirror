"use client"

import { Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'

interface LoadingModalProps {
  message?: string
}

export function LoadingModal({ message = "Initialising project..." }: LoadingModalProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex flex-col gap-4 items-center justify-center z-50">

        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-300">{message}</p>

    </div>,
    document.body
  )
}