"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { useAuthStore } from "@/stores/authStore/useAuthStore"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import RightSidebar from "./sidebar"
import Navbar from "./navbar"
import { axiosInstance } from "@/lib/axios"
import { PromptInputPanel } from "./prompt-input-panel"
import { showErrorToast } from "@/lib/toast"
import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const, delay },
  }),
}

export function ProjectInitializer() {
  const {
    savedPrompt,
    savedImages,
    clearSavedData,
    currentUsage,
    isPremium,
    setUsage,
  } = useAuthStore()

  const [description, setDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { createProject, processPrompt, isInitialising, isCreatingProject } =
    useEditorStore()

  const { data: session, status } = useSession()

  const maxUsage = isPremium ? Infinity : 5
  const usageRemaining = maxUsage - currentUsage

  useEffect(() => {
    if (session && !isPremium) {
      const fetchUsage = async () => {
        try {
          const res = await axiosInstance.get("/api/usage")
          setUsage(res.data.currentUsage)
        } catch (err) {
          console.error("Failed to fetch usage", err)
        }
      }
      fetchUsage()
    }
  }, [session, isPremium, setUsage])

  useEffect(() => {
    if (!session || hasInitialized) return

    if (savedPrompt) {
      setDescription(savedPrompt)
    }

    setHasInitialized(true)

    if (savedPrompt && savedImages?.length) {
      handleSubmit(savedPrompt, savedImages)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, hasInitialized, savedPrompt, savedImages])

  useEffect(() => {
    if (status === "loading") return
    if (!session) redirect("/")
  }, [session, status])

  useEffect(() => {
    const threshold = 25
    const sidebarWidth = 256

    const onMouseMove = (e: MouseEvent) => {
      const nearEdge = window.innerWidth - e.clientX <= threshold
      const insideSidebar = e.clientX >= window.innerWidth - sidebarWidth

      if (nearEdge) setIsHovered(true)
      else if (!insideSidebar) setIsHovered(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    return () => document.removeEventListener("mousemove", onMouseMove)
  }, [])

  const sidebarVisible = isOpen || isHovered

  const handleSubmit = async (promptText: string, files: File[]) => {
    if (!promptText.trim()) return

    if (currentUsage >= maxUsage) {
      showErrorToast("You have reached your daily chat limit.")
      return
    }

    const projectId = await createProject(promptText)
    if (!projectId) return

    clearSavedData()
    processPrompt(promptText, files)
    redirect(`/chat/${projectId}`)
  }

  if (!session) {
    return (
      <div className="h-screen bg-[#080810] flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#080810] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-purple-600/20 via-purple-800/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-purple-700/8 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] bg-purple-500/8 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,#080810_100%)]" />
      </div>

      <Navbar
        onPanelToggle={() => setIsOpen(!isOpen)}
        showPanelToggle
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 pt-24 sm:pt-32 pb-20 relative z-10">
        <div className="w-full max-w-3xl mx-auto">
          <div className="space-y-10 sm:space-y-12">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center space-y-3 sm:space-y-4"
            >

              <motion.h1
                variants={fadeUp}
                custom={0.1}
                className="text-3xl sm:text-3xl md:text-4xl font-black text-white leading-snug sm:leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Start with a sentence.
              </motion.h1>

              <motion.h2
                variants={fadeUp}
                custom={0.2}
                className="text-3xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent leading-snug sm:leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                End with a website.
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={0.3}
                className="text-[1rem] sm:text-base md:text-lg text-neutral-400 max-w-md sm:max-w-xl mx-auto pt-3"
              >
                Create stunning websites by chatting with Zap.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-50 px-4 md:static md:px-0 md:py-0 md:mt-6"
            >
              {/* Mobile bg fade */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080810] to-transparent md:hidden pointer-events-none" />

              <div className="relative md:block">

                  <PromptInputPanel
                    isPremium={session.user.isPremium}
                    description={description}
                    setDescription={setDescription}
                    onSubmit={handleSubmit}
                    isSubmitting={isInitialising || isCreatingProject}
                    disabled={false}
                    placeholder="Describe the website you want to build..."
                    usageInfo={{
                      remaining: usageRemaining,
                      limitReached: usageRemaining <= 0,
                    }}
                    textareaHeight="5rem"
                    textareaMaxHeight="14rem"
                    maxImages={10}
                    showBanner
                    showLimit
                  />

              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={sidebarVisible}
        setIsOpenAction={() => setIsOpen(false)}
        onMouseLeaveAction={() => setIsHovered(false)}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
      `}</style>
    </div>
  )
}