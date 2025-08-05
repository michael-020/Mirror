"use client"

import { useEffect, useRef, useState } from "react"
import { StatusPanel } from "@/components/status-panel"
import { FileExplorer } from "@/components/file-explorer"
import { CreateFileModal } from "@/components/create-file-modal"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { Plus, ArrowLeft } from "lucide-react"
import { ProjectInitializer } from "@/components/project-initializer"
import { EditorWorkspace } from "@/components/editor-workspace"
import { LoadingModal } from "@/components/init-loading-modal"

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMainInterface, setShowMainInterface] = useState(false)
  const { setSelectedFile, fileItems, clearBuildSteps, setFileItems, setFiles, isInitialising } = useStore()
  const hasSelectedInitialFile = useRef(false)

  // Auto-select first file when files are created
  useEffect(() => {
    if (!hasSelectedInitialFile.current && fileItems.length > 0) {
      const firstFile = fileItems.find(f => f.type === "file")
      if (firstFile) {
        setSelectedFile(firstFile.path)
        hasSelectedInitialFile.current = true
      }
    }
  }, [fileItems, setSelectedFile])

  const handleProjectSubmit = () => {
    setShowMainInterface(true)
  }

  const handleBackToInitializer = () => {
    setShowMainInterface(false)
    // Clear all build state
    clearBuildSteps()
    setFileItems([])
    setFiles({})
    setSelectedFile(null)
    hasSelectedInitialFile.current = false
  }

  // Show project initializer if main interface is not active
  if (!showMainInterface) {
    return <ProjectInitializer onSubmit={handleProjectSubmit} />
  }

  return (
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        {/* Header */}
        <div className=" bg-neutral-950 border-b border-neutral-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToInitializer}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors"
              title="Back to project setup"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold font-stretch-ultra-expanded">Mirror</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-sm bg-neutral-800 border border-neutral-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New File
            </button>
          </div>
        </div>

        {/* Main Content - 3 Column Grid */}
        <div className="flex-1 grid grid-cols-12 gap-0">
          {/* Left Column - Status Panel */}
          <div className="col-span-3 bg-neutral-950 border-r border-neutral-700">
            <StatusPanel />
          </div>

          {/* Right Column - Code Editor & Preview */}
          <div className="col-span-9 bg-neutral-900">
            <EditorWorkspace/>
          </div>
        </div>

        {/* Create File Modal */}
        <CreateFileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        
        {isInitialising && <LoadingModal />}
      </div>

  )
}