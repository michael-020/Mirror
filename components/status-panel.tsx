"use client"

import { useEffect, useRef, useState } from "react"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { Clock, AlertCircle, ArrowRight, Loader2, Check } from 'lucide-react'
import { BuildStepType, statusType } from "@/stores/editorStore/types"

export function StatusPanel() {
  const { processFollowupPrompts, isProcessing, isProcessingFollowups, promptStepsMap } = useEditorStore()
  const [prompt, setPrompt] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    
    processFollowupPrompts(
      prompt
    );
    
    setPrompt("") 
  }

  const getStatusIcon = (status: statusType) => {
    switch (status) {
      case statusType.Completed:
        return <Check className="w-4 h-4 text-green-500" />
      case statusType.InProgress:
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case statusType.Error:
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [promptStepsMap])


  return (
    <div className="h-[94vh] flex flex-col overflow-x-hidden">

      <div className="flex-1 overflow-x-hidden flex-wrap p-4 space-y-4 custom-scrollbar">
        {Array.from(promptStepsMap.entries()).map(([promptIndex, { prompt, steps }]) => (
          <div key={promptIndex} className="space-y-3">
            {/* Render Input Prompt (aligned to the right) */}
            <div className="flex items-start gap-3 justify-end mb-3">
              <div className="flex-1 bg-neutral-700 rounded-lg rounded-tr-none p-3 max-w-[80%] ml-auto">
                <p className="text-sm text-white break-words">
                  {prompt}
                </p>
              </div>
            </div>
            
            {/* Render Build Steps for this prompt */}
            {steps.length > 0 && (
              <div className="space-y-2 ml-2 ">
                {steps.filter(step => step.shouldExecute !== false).map((step) => (
                  <div key={step.id} className="flex items-start gap-3 py-0.5 group">
                    {getStatusIcon(step.status)}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-[0.8rem] text-gray-300 text-wrap group-hover:text-white transition-colors">
                        {step.type === BuildStepType.RunScript ? step.description : step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-blue-400 mt-4 p-3 bg-blue-900/20 rounded-lg">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing changes...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-neutral-800 p-2 bg-neutral-950">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            readOnly={isProcessing || isProcessingFollowups}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a follow up..."
            className="flex-1 px-2 py-2  w-8 placeholder:text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-0.5 focus:ring-neutral-500 focus:border-neutral-500"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isProcessingFollowups}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              prompt.trim() && !isProcessing
                ? "bg-neutral-300 hover:bg-neutral-400 text-black"
                : "bg-neutral-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isProcessingFollowups ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}