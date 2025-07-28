"use client"

import { useState } from "react"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { CodeEditorTabs } from "./code-editor-tabs"
import { EditorPanel } from "./editor-pannel"
import { PreviewPanel } from "./preview-pannel"
import { EditorErrorBoundary } from "./editor-error-boundary"

export function EditorWorkspace() {
  const { selectedFile } = useEditorStore()
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code")

  if (!selectedFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm text-gray-600">Please select a file to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <CodeEditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        {activeTab === "code" ? (
          <EditorErrorBoundary>
            <EditorPanel filePath={selectedFile} />
          </EditorErrorBoundary>
        ) : (
          <div className="h-full">
              <PreviewPanel />
          </div>
        )}
      </div>
    </div>
  )
}