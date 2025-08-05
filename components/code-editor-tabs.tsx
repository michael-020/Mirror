"use client"
import { Code, Eye } from "lucide-react"

interface CodeEditorTabsProps {
  activeTab: "code" | "preview"
  onTabChange: (tab: "code" | "preview") => void
}

export function CodeEditorTabs({ activeTab, onTabChange }: CodeEditorTabsProps) {
  return (
    <div className="bg-neutral-800 border-b border-neutral-700 flex p-2">
      <button
        onClick={() => onTabChange("code")}
        className={`px-4 py-2 text-sm border-r rounded-l-lg border-neutral-700 transition-colors flex items-center gap-1 ${
          activeTab === "code"
            ? "bg-neutral-950 text-neutral-200"
            : "bg-neutral-900 text-neutral-300 hover:text-white"
        }`}
      >
        <Code className="size-3" />
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={`px-4 py-2 text-sm transition-colors rounded-r-lg flex items-center gap-1 ${
          activeTab === "preview"
            ? "bg-neutral-950 text-neutral-200"
            : "bg-neutral-900 text-neutral-400 hover:text-white"
        }`}
      >
        <Eye className="size-3" />
      </button>
    </div>
  )
}
