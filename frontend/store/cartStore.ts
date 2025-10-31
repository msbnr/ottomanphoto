import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  image?: string
  boxQuantity?: number
}

interface CartState {
  items: CartItem[]
  userId: string | null
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setUserId: (userId: string | null) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const authData = localStorage.getItem('ottoman-auth-storage')
    if (authData) {
      const parsed = JSON.parse(authData)
      return parsed?.state?.user?.id || null
    }
  } catch (e) {
    return null
  }
  return null
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,

      setUserId: (userId) => {
        set((state) => {
          // Eğer kullanıcı değiştiyse sepeti temizle
          if (state.userId && state.userId !== userId) {
            return {
              userId,
              items: [],
            }
          }
          return { userId }
        })
      },

      addItem: (item, quantity = 1) => {
        const currentUserId = getCurrentUserId()

        set((state) => {
          // Eğer kullanıcı değiştiyse önce sepeti temizle
          if (state.userId && state.userId !== currentUserId) {
            return {
              userId: currentUserId,
              items: [{ ...item, quantity }],
            }
          }

          const existingItem = state.items.find((i) => i.id === item.id)

          if (existingItem) {
            // Ürün zaten sepette varsa, miktarını artır
            return {
              userId: currentUserId,
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          } else {
            // Yeni ürün ekle
            return {
              userId: currentUserId,
              items: [...state.items, { ...item, quantity }],
            }
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'ottoman-cart-storage', // LocalStorage'da saklanacak isim
    }
  )
)
