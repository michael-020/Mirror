"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from 'lucide-react'
import { axiosInstance } from "@/lib/axios"

interface ProjectInitializerProps {
  onSubmit: (description: string) => void
}

export function ProjectInitializer({ onSubmit }: ProjectInitializerProps) {
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsLoading(true)
    
    await axiosInstance.post("/api/template", {
        prompt: description
    })
    
    onSubmit(description.trim())
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">

        {/* Main Form */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
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
                className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!description.trim() || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                description.trim() && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
