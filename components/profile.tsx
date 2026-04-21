"use client"

import { useEffect, useState } from "react"
import RightSidebar from "./sidebar"
import { axiosInstance } from "@/lib/axios"
import Navbar from "./navbar"
import ProjectsList from "./projects-list"
import ProjectCardSkeleton from "./project-card-skeleton"
import { useRouter } from "next/navigation"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { Project } from "./project-card"
import { useSession } from "next-auth/react"
import { DownloadIcon } from "lucide-react"
import { UserTier } from "@prisma/client"

export function Profile() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const router = useRouter()
  const { clearBuildSteps, setFileItems, setSelectedFile, clearPromptStepsMap, setMessages } = useEditorStore()
  const session = useSession()

  const handleBackToInitializer = () => {
    clearBuildSteps()
    setFileItems([])
    setSelectedFile(null)
    clearPromptStepsMap()
    setMessages([])
    router.push("/chat")
  }

  const handleSidebarMouseLeave = () => setIsHovered(false)
  const handleSidebarClose = () => { setIsOpen(false); setIsHovered(false) }
  const sidebarVisible = isOpen || isHovered

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.get("/api/previous-projects")
      setProjects(res.data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const user = session?.data?.user
  const downloadCount = user?.downloadCount ?? 0
  const isPro = user?.plan === UserTier.PRO
  const downloadLimit = 5
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? "?"

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-auto custom-scrollbar">

      <Navbar
        onBack={handleBackToInitializer}
        onPanelToggle={() => setIsOpen(!isOpen)}
        showPanelToggle={true}
        showBackButton={true}
      />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {session.status === "loading" ? (
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800 animate-pulse">

                <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 shrink-0" />

                <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="size-3.5 rounded bg-neutral-300 dark:bg-neutral-700" />
                <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>

            </div>
            ) : user && (
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800">

                <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                    {initials}
                </span>
                </div>

                <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-neutral-900 dark:text-white">
                    {user.email}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isPro ? "Pro plan" : "Free plan"}
                </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <DownloadIcon className="size-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isPro
                    ? `${downloadCount} downloads`
                    : `${downloadCount}/${downloadLimit} downloads`}
                </span>

                {!isPro && downloadCount >= downloadLimit && (
                    <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                    Limit reached
                    </span>
                )}
                </div>
            </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              My Chats
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-0.5">
              Manage and explore your previous chats
            </p>
          </div>

          {!isLoading && projects && projects.length > 0 && (
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 transition-colors"
            >
              {isSelectionMode ? "Cancel" : "Select"}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <ProjectsList
            projects={projects}
            isSelectionMode={isSelectionMode}
            onProjectsUpdate={fetchProjects}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">

            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-neutral-500 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
              No chats yet
            </h3>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-xs mb-6">
              Start a new conversation to create your first project
            </p>

            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 transition-colors"
            >
              New Chat
            </button>
          </div>
        )}
      </div>

      <RightSidebar
        isOpen={sidebarVisible}
        setIsOpenAction={handleSidebarClose}
        onMouseLeaveAction={handleSidebarMouseLeave}
      />
    </div>
  )
}