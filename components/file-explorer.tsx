/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { ChevronRight, ChevronDown, FileIcon, Folder, FolderOpen, Search } from "lucide-react"
import type { FileItemFlat } from "@/stores/editorStore/types"

export function FileExplorer() {
  const { fileItems, selectedFile, setSelectedFile } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"files" | "search">("files")

  const handleFileSelect = (file: any) => {
    setSelectedFile(file.path)
  }

  const filteredAndSortedItems = useMemo(() => {
    let filtered = fileItems

    if (searchTerm) {
      filtered = fileItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1
      if (a.type === "file" && b.type === "folder") return 1
      return a.name.localeCompare(b.name)
    })
  }, [fileItems, searchTerm])

  const filteredTree = useMemo(() => {
    const buildNestedTree = (items: FileItemFlat[]): any[] => {
      const root: Record<string, any> = {}

      for (const item of items) {
        const parts = item.path.split("/")
        let current = root

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i]
          const currentPath = parts.slice(0, i + 1).join("/")
          const isFile = i === parts.length - 1 && item.type === "file"

          if (!current[part]) {
            current[part] = {
              name: part,
              path: currentPath,
              type: isFile ? "file" : "folder",
              children: isFile ? undefined : {},
            }
          }

          if (!isFile) {
            current = current[part].children
          }
        }
      }

      const convert = (node: any): any => {
        return Object.values(node).map((item: any) => ({
          ...item,
          children: item.children ? convert(item.children) : undefined,
        }))
      }

      return convert(root)
    }

    return buildNestedTree(filteredAndSortedItems)
  }, [filteredAndSortedItems])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col custom-scrollbar">
      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        <button
          onClick={() => setActiveTab("files")}
          className={`px-4 py-2 text-sm ${
            activeTab === "files"
              ? "text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={` px-4 py-2 text-sm ${
            activeTab === "search"
              ? "text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Search
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "files" ? (
        <div className="flex-1 overflow-y-auto">
          {filteredTree.map((item) => (
            <FileTreeItem
              key={item.path}
              item={item}
              level={0}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          ))}

          {filteredTree.length === 0 && fileItems.length > 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No files match your search
            </div>
          )}

          {fileItems.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No files yet. Start building to see your project structure.
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-200" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {searchTerm.trim() ? (
              filteredAndSortedItems.map((item) => (
                <div
                  key={item.path}
                  className="py-1.5 px-2 cursor-pointer hover:bg-neutral-800 text-sm text-gray-300 rounded-md"
                  onClick={() => handleFileSelect(item)}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Looking for a file? 
                <br/>
                Start typing...
              </div>
            )}

            {searchTerm.trim() && filteredAndSortedItems.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No files match your search
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FileTreeItem({ item, level, onFileSelect, selectedFile }: any) {
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
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-neutral-800 text-sm transition-colors group ${
          isSelected ? "bg-neutral-700 hover:bg-neutral-600" : ""
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
          className={`text-gray-300 group-hover:text-white transition-colors ${
            isSelected ? "text-white font-medium" : ""
          }`}
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