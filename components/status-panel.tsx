/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect } from "react"
import { useEditorStore as useStore } from "@/stores/editorStore/useEditorStore"
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react'

export function StatusPanel() {
  const { buildSteps, isBuilding, addBuildStep } = useStore()

  useEffect(() => {
    if (!isBuilding) return

    const steps = [
      "Initializing project workspace...",
      "Analyzing project requirements...",
      "Installing dependencies...",
      "Setting up TypeScript configuration...",
      "Configuring Tailwind CSS...",
      "Creating project structure...",
      "Generating React components...",
      "Setting up routing system...",
      "Optimizing build configuration...",
      "Build completed successfully!",
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        addBuildStep({
          id: Date.now() + currentStep,
          message: steps[currentStep],
          status: currentStep === steps.length - 1 ? "completed" : "in-progress",
          timestamp: new Date(),
        })
        currentStep++
      } else {
        clearInterval(interval)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isBuilding, addBuildStep])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const completedSteps = buildSteps.filter(step => step.status === "completed").length
  const totalSteps = buildSteps.length
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <div className="h-full flex flex-col">
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

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {buildSteps.length === 0 && !isBuilding && (
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm mb-2">Ready to build</div>
            <div className="text-xs text-gray-600">Click &quot;Start Build&quot; to begin creating your website</div>
          </div>
        )}

        {buildSteps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3 group">
            {getStatusIcon(step.status)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {step.message}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">{step.timestamp.toLocaleTimeString()}</p>
                {step.status === "completed" && (
                  <span className="text-xs text-green-400">✓ Done</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isBuilding && (
          <div className="flex items-center gap-2 text-xs text-blue-400 mt-4 p-2 bg-blue-900/20 rounded-md">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Building your website...
          </div>
        )}
      </div>
    </div>
  )
}
