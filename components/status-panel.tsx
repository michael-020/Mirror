"use client"

import { useState } from "react"
import { useEditorStore } from "@/stores/editorStore/useEditorStore"
import { CheckCircle, Clock, AlertCircle, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { BuildStepType, statusType } from "@/stores/editorStore/types"

export function StatusPanel() {
  const { buildSteps, isBuilding, processFollowupPrompts, messages } = useEditorStore()
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    
    try {
      const messageHistory = messages.filter(msg => msg !== null);
      
      processFollowupPrompts(
        prompt, 
        messageHistory
      );
      
      setPrompt("") 
    } catch (error) {
      console.error("Error generating steps:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: statusType) => {
    switch (status) {
      case statusType.Completed:
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case statusType.InProgress:
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case statusType.Error:
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const completedSteps = buildSteps.filter(step => step.status === statusType.Completed).length
  const totalSteps = buildSteps.length
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  // useEffect(() => {
  //   useMountFilesToWebContainer()
  // }, [files])

  return (
    <div className="h-[94vh] flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-gray-300">Build Status</h2>
        </div>
        
        {isBuilding && totalSteps > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {buildSteps.length === 0 && !isBuilding && (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm mb-2">Ready to build</div>
            <div className="text-xs text-gray-600">Click &quot;Start Build&quot; to begin creating your website</div>
          </div>
        )}

        {buildSteps
          .filter(step => step.shouldExecute !== false)
          .map((step) => (
            <div key={step.id} className="flex items-start gap-3 py-0.5 group">
              {getStatusIcon(step.status)}
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {step.type === BuildStepType.RunScript ? step.description :  step.title}
                </p>
              </div>
            </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-blue-400 mt-4 p-2 bg-blue-900/20 rounded-md">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Processing your request...
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your next instruction..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              prompt.trim() && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
             <Loader2 className="animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}