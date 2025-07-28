"use client"
import { Code, Eye } from "lucide-react"

interface CodeEditorTabsProps {
  activeTab: "code" | "preview"
  onTabChange: (tab: "code" | "preview") => void
}

export function CodeEditorTabs({ activeTab, onTabChange }: CodeEditorTabsProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 flex">
      <button
        onClick={() => onTabChange("code")}
        className={`px-4 py-2 text-sm border-r border-gray-600 transition-colors flex items-center gap-1 ${
          activeTab === "code"
            ? "bg-gray-700 text-white border-b-2 border-blue-500"
            : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-750"
        }`}
      >
        <Code className="w-4 h-4" />
        Code
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={`px-4 py-2 text-sm transition-colors flex items-center gap-1 ${
          activeTab === "preview"
            ? "bg-gray-700 text-white border-b-2 border-blue-500"
            : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-750"
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  )
}
