"use client"

import { useState, useEffect } from "react"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { Save, Eye, Code, FileIcon, Settings } from "lucide-react"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-gray-400">Loading editor...</div>
      </div>
    </div>
  ),
})

export function CodeEditor() {
  const { selectedFile, files, updateFileContent } = useStore()
  const [activeTab, setActiveTab] = useState("code")
  const [editorContent, setEditorContent] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const currentFile = selectedFile ? files[selectedFile] : null

  useEffect(() => {
    if (currentFile) {
      setEditorContent(currentFile.content)
      setHasUnsavedChanges(false)
    }
  }, [currentFile])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value)
      setHasUnsavedChanges(value !== currentFile?.content)
    }
  }

  const handleSave = () => {
    if (selectedFile && hasUnsavedChanges) {
      updateFileContent(selectedFile, editorContent)
      setHasUnsavedChanges(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedFile, hasUnsavedChanges, editorContent])

  const getLanguage = (filename: string) => {
    const ext = filename.split(".").pop()
    switch (ext) {
      case "tsx":
      case "jsx":
        return "typescript"
      case "ts":
        return "typescript"
      case "js":
        return "javascript"
      case "css":
        return "css"
      case "html":
        return "html"
      case "json":
        return "json"
      default:
        return "typescript"
    }
  }

  const generatePreviewContent = () => {
    if (!currentFile) return "<div>No file selected</div>"

    if (currentFile.name.endsWith(".tsx") || currentFile.name.endsWith(".jsx")) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview</title>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: system-ui, sans-serif; margin: 0; }
              .preview-container { padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${editorContent}
              
              // Try to render if there's a default export
              try {
                const Component = window.default || window.App;
                if (Component) {
                  ReactDOM.render(React.createElement(Component), document.getElementById('root'));
                } else {
                  document.getElementById('root').innerHTML = '<div class="preview-container">Component preview not available. Make sure to export a default component.</div>';
                }
              } catch (error) {
                document.getElementById('root').innerHTML = '<div class="preview-container"><h3>Error:</h3><pre style="color: red; white-space: pre-wrap;">' + error.message + '</pre></div>';
              }
            </script>
          </body>
        </html>
      `
    }

    if (currentFile.name.endsWith(".html")) {
      return editorContent
    }

    return `
      <div style="padding: 20px; font-family: system-ui, sans-serif;">
        <h3>File: ${currentFile.name}</h3>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; white-space: pre-wrap;">
          <code>${editorContent.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
        </pre>
      </div>
    `
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-300">{currentFile ? currentFile.name : "No file selected"}</h2>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
              <span className="text-xs text-orange-400">Unsaved</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentFile && (
            <>
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors flex items-center gap-1 ${
                  hasUnsavedChanges
                    ? "bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Save {hasUnsavedChanges && <span className="text-xs">(Ctrl+S)</span>}
              </button>
              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {currentFile ? (
        <div className="flex-1 flex flex-col">
          {/* Custom Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex">
            <button
              onClick={() => setActiveTab("code")}
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
              onClick={() => setActiveTab("preview")}
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

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "code" && (
              <MonacoEditor
                height="100%"
                language={getLanguage(currentFile.name)}
                theme="vs-dark"
                value={editorContent}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: "on",
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            )}

            {activeTab === "preview" && (
              <iframe
                srcDoc={generatePreviewContent()}
                className="w-full h-full border-0 bg-white"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FileIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">No file selected</h3>
            <p className="text-sm text-gray-600">Select a file from the explorer to start editing</p>
          </div>
        </div>
      )}
    </div>
  )
}