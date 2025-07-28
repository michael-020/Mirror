"use client"

import { useEffect, useState } from "react"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import Editor from '@monaco-editor/react';

interface EditorPanelProps {
  filePath: string
}

export function EditorPanel({ filePath }: EditorPanelProps) {
  const { files, updateFileContent } = useEditorStore()
  const [editorValue, setEditorValue] = useState("")

  const file = files[filePath]

  useEffect(() => {
    if (file?.content !== undefined) {
      setEditorValue(file.content)
    }
  }, [file?.content])

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || ""
    setEditorValue(newValue)
    updateFileContent(filePath, newValue)
  }

  
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>File not found: {filePath}</p>
      </div>
    )
  }

  return (
    <div className="h-full">
        <div className="h-full">
          <Editor
            height="100%"
            value={editorValue}
            defaultLanguage="typescript"
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              readOnly: false,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
            beforeMount={(monaco) => {
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true,
              });

              monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true,
              });

              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                jsx: monaco.languages.typescript.JsxEmit.React,
                allowJs: true,
                esModuleInterop: true,
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                module: monaco.languages.typescript.ModuleKind.ESNext,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                skipLibCheck: true,
                isolatedModules: true,
                allowSyntheticDefaultImports: true,
                noEmit: true,
                typeRoots: [], 
              });
            }}
          />
        </div>
    </div>
  )
}