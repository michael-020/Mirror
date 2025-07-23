"use client"

import { useEffect, useRef, useState } from "react"
import { StatusPanel } from "@/components/status-panel"
import { FileExplorer } from "@/components/file-explorer"
import { CodeEditor } from "@/components/code-editor"
import { CreateFileModal } from "@/components/create-file-modal"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { Plus, Play, Square, ArrowLeft } from "lucide-react"
import { ProjectInitializer } from "@/components/project-initializer"

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMainInterface, setShowMainInterface] = useState(false)
  const [projectDescription, setProjectDescription] = useState("")
  const { isBuilding, startBuild, stopBuild, setSelectedFile, fileItems, clearBuildSteps, setFileItems, setFiles } = useStore()

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

  const handleStartBuild = () => {
    if (isBuilding) {
      stopBuild()
    } else {
      startBuild()
    }
  }

  const handleProjectSubmit = (description: string) => {
    setProjectDescription(description)
    setShowMainInterface(true)
  }

  const handleBackToInitializer = () => {
    setShowMainInterface(false)
    setProjectDescription("")
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
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToInitializer}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            title="Back to project setup"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Website Builder</h1>
            {projectDescription && <p className="text-xs text-gray-400 truncate max-w-md">{projectDescription}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            New File
          </button>
          <button
            onClick={handleStartBuild}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
              isBuilding ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isBuilding ? (
              <>
                <Square className="w-4 h-4" />
                Stop Build
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Build
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content - 3 Column Grid */}
      <div className="flex-1 grid grid-cols-12 gap-0">
        {/* Left Column - Status Panel */}
        <div className="col-span-3 bg-gray-800 border-r border-gray-700">
          <StatusPanel />
        </div>

        {/* Middle Column - File Explorer */}
        <div className="col-span-3 bg-gray-850 border-r border-gray-700">
          <FileExplorer />
        </div>

        {/* Right Column - Code Editor & Preview */}
        <div className="col-span-6 bg-gray-900">
          <CodeEditor />
        </div>
      </div>

      {/* Create File Modal */}
      <CreateFileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}