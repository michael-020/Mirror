"use client"

import { create } from "zustand"
import { BuildStep, StoreState } from "./types"

export const useEditorStore = create<StoreState>((set, get) => ({
  // Initial state
  buildSteps: [],
  isBuilding: false,
  fileTree: [],
  files: {},
  selectedFile: null,

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

  addFile: (name, content) => {
    const path = `src/${name}`
    set((state) => ({
      files: {
        ...state.files,
        [path]: { name, content, path },
      },
      fileTree: [...state.fileTree, { name, path, type: "file" }],
    }))
  },

  addFolder: (name) => {
    const path = `src/${name}`
    set((state) => ({
      fileTree: [...state.fileTree, { name, path, type: "folder", children: [] }],
    }))
  },
}))
