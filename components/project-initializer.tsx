"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEditorStore } from "@/stores/editorStore/useEditorStore"

interface ProjectInitializerProps {
  onSubmit: (description: string) => void
}

export function ProjectInitializer({ onSubmit }: ProjectInitializerProps) {
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { processPrompt } = useEditorStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsLoading(true)
    
    try {
      processPrompt(description)
      
      onSubmit(description.trim())

    } catch (error) {
      console.error("Error generating steps:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Form */}
        <div className="bg-neutral-900/80 backdrop-blur-sm border shadow-lg shadow-neutral-700 border-neutral-700 rounded-xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                What kind of website do you want to build?
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your website idea in detail... For example: 'Create a modern portfolio website for a web developer with a hero section, about me, projects showcase, and contact form'"
                className="w-full h-32 px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!description.trim() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                description.trim() && !isLoading
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Initializing Project...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}