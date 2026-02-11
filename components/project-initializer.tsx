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
      <div className="h-screen bg-neutral-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="size-14 animate-spin text-neutral-900 dark:text-neutral-200" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-black overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-3xl rounded-full mt-[-200px]" />
      </div>
      <Navbar
        onPanelToggle={() => setIsOpen(!isOpen)}
        showPanelToggle
      />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
        <div className="w-full max-w-3xl mx-auto">
          <div className="space-y-10 sm:space-y-12">
            <div className="text-center space-y-3 sm:space-y-4 sticky">
              <h1 className="text-3xl sm:text-3xl md:text-5xl font-black text-neutral-950 dark:text-white leading-snug sm:leading-tight">
                Start with a sentence.
              </h1>

              <h2 className="text-3xl sm:text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-snug sm:leading-tight">
                End with a website.
              </h2>

              <p className="text-[1rem] sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-md sm:max-w-xl mx-auto pt-3">
                Create stunning websites by chatting with Zap.
              </p>
            </div>

            <div 
              className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-50 dark:bg-black px-4 md:static md:border-none md:px-0 md:py-0 md:mt-6"
            >
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
          </div>
        </div>
      </div>

      <RightSidebar
        isOpen={sidebarVisible}
        setIsOpenAction={() => setIsOpen(false)}
        onMouseLeaveAction={() => setIsHovered(false)}
      />
    </div>
  )
}