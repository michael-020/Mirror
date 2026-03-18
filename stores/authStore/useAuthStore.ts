import { create } from "zustand"
import { authAction, authState } from "./types"
import { axiosInstance } from "@/lib/axios"
import { UserTier } from "@prisma/client"

export const useAuthStore = create<authState & authAction>((set, get) => ({
    inputEmail: "",
    savedPrompt: "",
    savedImages: [],
    currentUsage: 0,   
    plan: UserTier.FREE,
    isFetchingUsage: false,

    setInputEmail: (email: string) => {
        set({ inputEmail: email })
    },

    setSavedPrompt: (prompt: string) => {
        set({ savedPrompt: prompt })
    },

    setSavedImages: (images: File[]) => {
        set({ savedImages: images })
    },

    clearSavedData: () => {
        set({ savedPrompt: "", savedImages: [] })
    },

    setUsage: (usage: number) => {
        set({ currentUsage: usage })
    },

    incrementUsage: async () => {
        await axiosInstance.put("/api/usage")
        set((state) => ({ currentUsage: state.currentUsage + 1 }))
    },

    resetUsage: () => {
        set({ currentUsage: 0 })
    },

    setPlan: (plan: UserTier) => {
        set({ plan })
    },

    fetchUsage: async () => {
        set({ isFetchingUsage: true })
        try {
            const response = await axiosInstance.get('/api/usage')
            const data = response.data
            get().setUsage(data.currentUsage) 
        } catch (error) {
            console.error('Failed to fetch usage:', error)
        } finally {
            set({ isFetchingUsage: false })
        }
    }
}))
