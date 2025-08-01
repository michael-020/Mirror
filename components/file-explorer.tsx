/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo, useEffect } from "react"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { ChevronRight, ChevronDown, FileIcon, Folder, FolderOpen, Search } from "lucide-react"
import type { FileItemFlat } from "@/stores/editorStore/types"

interface FileTreeItemProps {
  item: any
  level: number
  onFileSelect: (file: any) => void
  selectedFile: string | null
}

interface FileNode {
  file: {
    contents: string
  }
}

interface DirectoryNode {
  directory: Record<string, FileNode | DirectoryNode>
}

type MountStructure = Record<string, FileNode | DirectoryNode>

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

function buildNestedTree(items: FileItemFlat[]): any[] {
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
    return Object.values(node)
      .map((item: any) => ({
        ...item,
        children: item.children ? convert(item.children) : undefined,
      }))
      .sort((a: any, b: any) => {
        // Sort folders first, then files
        if (a.type === "folder" && b.type === "file") return -1
        if (a.type === "file" && b.type === "folder") return 1
        
        // Within same type, sort alphabetically
        return a.name.localeCompare(b.name)
      })
  }

  return convert(root)
}

function sortFileItems(items: FileItemFlat[]): FileItemFlat[] {
  return items.slice().sort((a, b) => {
    
    // Prioritize by specific folder names (src first)
    const aSrc = a.path.startsWith("src/") || a.path === "src"
    const bSrc = b.path.startsWith("src/") || b.path === "src"
    
    if (aSrc && !bSrc) return -1
    if (!aSrc && bSrc) return 1
    
    // Then sort by type (folders first)
    if (a.type === "folder" && b.type === "file") return -1
    if (a.type === "file" && b.type === "folder") return 1
    
    // Finally sort alphabetically
    return a.name.localeCompare(b.name)
  })
}

export function FileExplorer() {
  const { fileItems, selectedFile, setSelectedFile, files, webcontainer } = useStore()
  const [searchTerm, setSearchTerm] = useState("")

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
    
    return sortFileItems(filtered)
  }, [fileItems, searchTerm])

  const filteredTree = useMemo(() => {
    return buildNestedTree(filteredAndSortedItems)
  }, [filteredAndSortedItems])

  useEffect(() => {
    const mountStructure: MountStructure = {}

    fileItems.forEach(item => {
      const pathParts = item.path.split('/')
      let currentLevel: Record<string, FileNode | DirectoryNode> = mountStructure

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        if (!currentLevel[part]) {
          currentLevel[part] = {
            directory: {}
          }
        }
        currentLevel = (currentLevel[part] as DirectoryNode).directory
      }

      const finalName = pathParts[pathParts.length - 1]
      
      if (item.type === 'file') {
        const fileContent = files[item.path]?.content ?? item.content
        
        currentLevel[finalName] = {
          file: {
            contents: fileContent!
          }
        }
      } else if (item.type === 'folder') {
        currentLevel[finalName] = {
          directory: {}
        }
      }
    })

    // console.log('Mount structure:', mountStructure)
    webcontainer?.mount(mountStructure)
  }, [fileItems, files, webcontainer]) 
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col custom-scrollbar">
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

      
    </div>
  )
}