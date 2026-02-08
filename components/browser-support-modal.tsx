"use client"

import { createPortal } from "react-dom"
import { useEffect, useMemo } from "react"

export function getUnsupportedReason() {
  if (typeof window === "undefined") return null;

  const ua = navigator.userAgent.toLowerCase();

  const isMobile =
    /android|iphone|ipad|ipod|mobile/i.test(ua) ||
    window.matchMedia("(pointer: coarse)").matches;

  if (isMobile) return "mobile";

  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  if (isSafari) return "safari";

  const isFirefox = /firefox/i.test(ua);
  if (isFirefox) return "firefox";

  return null; // supported
}

export function isSupportedEnvironment(): boolean {
  return getUnsupportedReason() === null;
}


interface BrowserSupportModalProps {
  isOpen: boolean
}

interface BrowserSupportModalProps {
  isOpen: boolean
}

export function BrowserSupportModal({ isOpen }: BrowserSupportModalProps) {
  const reason = useMemo(getUnsupportedReason, [])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const copyProjectLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  if (!isOpen || !reason) return null

  const isMobile = reason === "mobile"

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-md rounded-lg sm:rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-3 sm:mb-4 text-center text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-200">
          {isMobile
            ? "Desktop required"
            : "Unsupported browser"}
        </h3>

        <p className="mb-5 sm:mb-6 text-center text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          {isMobile ? (
            <>
              This feature is currently available only on
              <strong> desktop or laptop devices</strong>.
              Please open this link on a computer using Chrome or Edge.
            </>
          ) : (
            <>
              Zap depends on some key browser features that aren&apos;t supported here. For the best experience, please use{" "}
              <a
                href="https://www.google.com/chrome/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Chrome
              </a>{" "}
              or{" "}
              <a
                href="https://www.microsoft.com/edge"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Edge
              </a>
              .
            </>
          )}
        </p>

        <button
          onClick={copyProjectLink}
          className="w-full rounded-lg bg-neutral-900 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white hover:bg-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          Copy project link
        </button>
      </div>
    </div>,
    document.body
  )
}