import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  activeRequests: number
  startLoading: () => void
  stopLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  activeRequests: 0,

  startLoading: () =>
    set((state) => ({
      activeRequests: state.activeRequests + 1,
      isLoading: true,
    })),

  stopLoading: () =>
    set((state) => {
      const newActiveRequests = Math.max(0, state.activeRequests - 1)
      return {
        activeRequests: newActiveRequests,
        isLoading: newActiveRequests > 0,
      }
    }),
}))
