/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { ChevronRight, ChevronDown, FileIcon, Folder, FolderOpen, Search } from "lucide-react"

interface FileTreeItemProps {
  item: any
  level: number
  onFileSelect: (file: any) => void
  selectedFile: string | null
}

function FileTreeItem({ item, level, onFileSelect, selectedFile }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded)
    } else {
      onFileSelect(item)
    }
  }

  const isSelected = selectedFile === item.path

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-gray-700 text-sm transition-colors group ${
          isSelected ? "bg-blue-600 hover:bg-blue-600" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <div className="w-4" />
            <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
          </>
        )}
        <span
          className={`text-gray-300 group-hover:text-white transition-colors ${isSelected ? "text-white font-medium" : ""}`}
        >
          {item.name}
        </span>
      </div>

      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child: any) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer() {
  const { fileTree, selectedFile, setSelectedFile } = useStore()
  const [searchTerm, setSearchTerm] = useState("")

  const handleFileSelect = (file: any) => {
    setSelectedFile(file.path)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 space-y-3">
        <h2 className="text-sm font-semibold text-gray-300">Explorer</h2>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {fileTree.map((item) => (
          <FileTreeItem
            key={item.path}
            item={item}
            level={0}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>

      {/* File Count */}
      <div className="p-3 border-t border-gray-700 text-xs text-gray-500">{fileTree.length} items</div>
    </div>
  )
}