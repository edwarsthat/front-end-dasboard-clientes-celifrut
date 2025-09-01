import { create } from "zustand";

interface useAppType {
    isLoading: boolean
    setLoading: (loading: boolean) => void
}

export const useAppStore = create<useAppType>((set) => ({
    isLoading: false,
    setLoading: (loading: boolean) => set({ isLoading: loading }),

}))