"use client"

import { create } from "zustand"
import { BuildStep, BuildStepType, FileItemFlat, statusType, StoreState } from "./types"
import { axiosInstance } from "@/lib/axios"
import { parseXml } from "@/lib/steps"

export const useEditorStore = create<StoreState>((set, get) => ({
  // Initial state
  buildSteps: [],
  isBuilding: false,
  fileItems: [],
  files: {},
  selectedFile: null,
  shellCommands: [],

  // Build actions
  setBuildSteps: (steps: BuildStep[]) =>
    set((state) => ({
      buildSteps: [...state.buildSteps, ...steps],
    })),

  clearBuildSteps: () => set({ buildSteps: [] }),

  startBuild: () => {
    set({ isBuilding: true })
    get().clearBuildSteps()
  },

  stopBuild: () => set({ isBuilding: false }),

  setStepStatus: (id: string, status: statusType) =>
    set((state) => ({
      buildSteps: state.buildSteps.map((step) =>
        step.id === id ? { ...step, status } : step
      ),
    })),

  // File actions
  setSelectedFile: (path) => set({ selectedFile: path }),

  updateFileContent: (path, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: {
          ...state.files[path],
          content,
        },
      },
    })),

    setFileItems: (items: FileItemFlat[]) => set({ fileItems: items }),
    
    setFiles: (files) => set({ files }),

    // Add file to existing files (accumulative)
    addFile: (path: string, content: string) =>
      set((state) => ({
        files: {
          ...state.files,
          [path]: {
            name: path.split("/").pop() || path,
            content,
            path,
          },
        },
    })),

    addFileItem: (item: FileItemFlat) =>
      set((state) => {
        const exists = state.fileItems.some(existing => existing.path === item.path)
        if (exists) return state
        
        return {
          fileItems: [...state.fileItems, item],
        }
      }),

    setShellCommand: (command: string) =>
      set((state) => ({
        shellCommands: [...state.shellCommands, command],
      })),
    
    executeSteps: async (steps: BuildStep[]) => {
      const { setStepStatus, addFile, addFileItem } = get()
      
      for (const step of steps) {
        try {
          if (step.title === "Project Files") {
            console.log("Skipping Project Files step:", step)
            continue
          }

          setStepStatus(step.id, statusType.InProgress)
          
          switch (step.type) {
            case BuildStepType.CreateFile: {
              if (!step.path || !step.code) {
                console.error("CreateFile step missing path or code:", step)
                throw new Error("Missing path or code")
              }

              addFile(step.path, step.code)

              addFileItem({
                name: step.path.split("/").pop() || step.path,
                path: step.path,
                type: "file"
              })
              break
            }

            case BuildStepType.CreateFolder: {
              if (!step.path) {
                console.error("CreateFolder step missing path:", step)
                throw new Error(`Missing path for folder creation. Step: ${JSON.stringify(step)}`)
              }

              addFileItem({
                name: step.path.split("/").pop() || step.path,
                path: step.path,
                type: "folder"
              })
              break

            }

            case BuildStepType.RunScript: {
              if (step.description) {
                console.log("Shell command to execute:", step.description)
                get().setShellCommand(step.description)
              }
              break
            }

            case BuildStepType.NonExecutuable: {
              break;
            }

            default:
              console.warn("Unhandled step type:", step.type, step)
          }

          setStepStatus(step.id, statusType.Completed)

          await new Promise((res) => setTimeout(res, 200))
        } catch (err) {
          console.error("Error executing step:", err)
          setStepStatus(step.id, statusType.Error)
        }
      }
    },

    processPrompt: async (prompt) => {
      try {
        const res = await axiosInstance.post("/api/template", {
          prompt
        })
        
        const parsedSteps: BuildStep[] = parseXml(res.data.uiPrompts[0]).map((x: BuildStep) => ({
          ...x,
          status: statusType.InProgress
        }))
  
        get().setBuildSteps(parsedSteps)
        await get().executeSteps(parsedSteps.filter(step => step.shouldExecute !== false))
  
        const response = await axiosInstance.post("/api/chat", {
          prompt,
          messages: res.data.prompts
        })

        const parsedResponse: BuildStep[] = parseXml(response.data.response.join('')).map((x: BuildStep) => ({
          ...x,
          status: statusType.InProgress
        }))
        get().setBuildSteps(parsedResponse)
        await get().executeSteps(parsedResponse.filter(step => step.shouldExecute !== false))
      } catch (error) {
        console.error("Error while creating a project", error)
      }
    }
}))
