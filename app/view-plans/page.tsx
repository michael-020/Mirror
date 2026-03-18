"use client"

import Navbar from "@/components/navbar"
import RightSidebar from "@/components/sidebar"
import { useAuthStore } from "@/stores/authStore/useAuthStore"
import { UserTier } from "@prisma/client"
import { Check, X, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const ViewPlansPage = () => {
  const router = useRouter()
  const { plan, setPlan } = useAuthStore()
  const { data: session, status } = useSession()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isPro = plan === UserTier.PRO

  useEffect(() => {
    if (status === "authenticated") {
      setPlan(session.user.plan)
    }
  }, [status, session, setPlan])

  useEffect(() => {
    const threshold = 25
    const sidebarWidth = 256

    const onMouseMove = (e: MouseEvent) => {
      const isNearRightEdge = window.innerWidth - e.clientX <= threshold
      const isInsideSidebar = e.clientX >= window.innerWidth - sidebarWidth

      if (isNearRightEdge) setIsHovered(true)
      else if (!isInsideSidebar && isHovered) setIsHovered(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    return () => document.removeEventListener("mousemove", onMouseMove)
  }, [isHovered])

  const handleSubscribe = async () => {
    const res = await fetch("/api/payment-token")
    const { token } = await res.json()
    window.location.href = `${process.env.NEXT_PUBLIC_PAYMENT_API_URL}/?token=${token}`
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="size-10 sm:size-14 md:size-16 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto md:overflow-y-hidden custom-scrollbar pt-7 sm:pt-0 md:pt-0">
      <Navbar
        onBack={() => router.push("/chat")}
        showBackButton
        showPanelToggle
        onPanelToggle={() => setIsOpen(!isOpen)}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-black translate-y-8 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-5 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white md-2 sm:mb-4">
              {isPro ? "You're on the Pro plan" : "Choose Your Plan"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-[0.88rem] sm:text-lg">
              Design, generate, and ship websites faster with Zap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div
              className={`p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800/50 bg-white dark:bg-neutral-900/60 transition-all duration-300`}
            >
              <div className="flex flex-col h-full">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Free</h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">Perfect for trying out</p>

                <div className="mt-6 text-6xl font-extrabold">₹0</div>

                <div className="mt-10 space-y-4 flex-grow">
                  <Feature text="5 iterations per day" />
                  <Feature text="Basic AI model" />
                  <Feature text="5 projects" />
                  <Feature text="Advanced AI model" disabled />
                  <Feature text="5 downloads only" disabled />
                </div>

                {!isPro && <button
                  disabled={!isPro}
                  onClick={() => router.push("/chat")}
                  className={`mt-10 w-full py-3.5 rounded-lg font-semibold transition ${
                    !isPro
                      ? "bg-neutral-900 text-white hover:bg-neutral-700"
                      : "bg-neutral-300/50 text-neutral-100 cursor-not-allowed"
                  }`}
                >
                  Current Plan
                </button>}
              </div>
            </div>

            <div
              className={`p-8 rounded-2xl border-2 relative ${
                isPro
                  ? "border-purple-500/60 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-900/20 dark:to-neutral-900/90 shadow-xl shadow-purple-500/20"
                  : "border-purple-500/50 bg-gradient-to-br from-purple-50/30 to-white dark:from-purple-950/20 dark:to-neutral-900/60"
              } transition-all duration-300`}
            >
              
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  {isPro ? "CURRENT PLAN" : "RECOMMENDED"}
                </span>
              </div>

              <div className="flex flex-col h-full">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Pro</h2>
                <p className="mt-2 text-purple-600 dark:text-purple-300">For professional builders</p>

                <div className="mt-6 text-6xl font-extrabold text-purple-500">₹99</div>

                <div className="mt-10 space-y-4 flex-grow">
                  <Feature text="Unlimited iterations" />
                  <Feature text="Advanced AI model" />
                  <Feature text="Unlimited projects & downloads" />
                </div>

                {!isPro && (
                  <>
                    <label className="mt-8 mb-4 flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 accent-purple-500"
                      />
                      <span>
                        I accept the{" "}
                        <a
                          href="/policies"
                          className="text-purple-500 hover:text-purple-600 underline"
                        >
                          Terms and Conditions
                        </a>
                      </span>
                    </label>

                    <button
                      disabled={!acceptedTerms}
                      onClick={() => acceptedTerms && handleSubscribe()}
                      className={`w-full py-3.5 rounded-lg font-semibold transition-all ${
                        acceptedTerms
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/30"
                          : "bg-purple-500/20 text-purple-400 cursor-not-allowed"
                      }`}
                    >
                      Upgrade to Pro
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={isOpen || isHovered}
        setIsOpenAction={() => {
          setIsOpen(false)
          setIsHovered(false)
        }}
        onMouseLeaveAction={() => setIsHovered(false)}
      />
    </div>
  )
}

const Feature = ({ text, disabled }: { text: string; disabled?: boolean }) => (
  <div className="flex items-start">
    {disabled ? (
      <X className="h-5 w-5 text-neutral-400 mt-0.5" />
    ) : (
      <Check className="h-5 w-5 text-purple-500 mt-0.5" />
    )}
    <span
      className={`ml-3 ${
        disabled ? "text-neutral-500" : "text-neutral-700 dark:text-neutral-200"
      }`}
    >
      {text}
    </span>
  </div>
)

export default ViewPlansPage
