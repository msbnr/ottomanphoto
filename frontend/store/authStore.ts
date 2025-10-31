import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  userType: 'customer' | 'dealer' | 'admin' | 'supplier'
  dealerTier?: 'small' | 'medium' | 'large' | 'main_dealer'
  profile?: {
    firstName?: string
    lastName?: string
    companyName?: string
    phone?: string
    address?: any
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User | null) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Save to localStorage for API interceptor
        localStorage.setItem('ottoman_token', token)
        localStorage.setItem('ottoman_user', JSON.stringify(user))

        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      setUser: (user) => {
        if (user) {
          localStorage.setItem('ottoman_user', JSON.stringify(user))
        }
        set({ user })
      },

      logout: () => {
        // Clear all auth-related localStorage items
        localStorage.removeItem('ottoman_token')
        localStorage.removeItem('ottoman_user')
        localStorage.removeItem('ottoman-auth-storage') // Zustand persist storage
        localStorage.removeItem('ottoman-cart-storage') // Cart storage

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'ottoman-auth-storage',
    }
  )
)
