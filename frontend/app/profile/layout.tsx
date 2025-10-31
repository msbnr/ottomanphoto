'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingBag, MessageSquare, Heart, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const menuItems = [
    {
      href: '/profile',
      icon: User,
      label: 'Profil Bilgilerim',
      active: pathname === '/profile',
    },
    {
      href: '/profile/orders',
      icon: ShoppingBag,
      label: 'Siparişlerim',
      active: pathname === '/profile/orders',
    },
    {
      href: '/profile/messages',
      icon: MessageSquare,
      label: 'Mesajlarım',
      active: pathname === '/profile/messages',
    },
    {
      href: '/profile/favorites',
      icon: Heart,
      label: 'Favorilerim',
      active: pathname === '/profile/favorites',
    },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sol Sidebar Menü */}
          <div className="lg:col-span-1">
            <div className="card-ottoman sticky top-24">
              {/* Kullanıcı Bilgisi */}
              <div className="mb-6 pb-6 border-b border-white/20">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-ottoman-cream text-center mb-1">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </h3>
                <p className="text-sm text-ottoman-cream/60 text-center">{user?.email}</p>
                {user?.userType === 'dealer' && (
                  <div className="mt-2 text-center">
                    <span className="badge-premium text-xs">
                      {user?.dealerTier === 'small' && 'Küçük Bayi'}
                      {user?.dealerTier === 'medium' && 'Orta Bayi'}
                      {user?.dealerTier === 'large' && 'Büyük Bayi'}
                      {user?.dealerTier === 'main_dealer' && 'Ana Bayi'}
                      {!user?.dealerTier && 'Bayi'}
                    </span>
                  </div>
                )}
              </div>

              {/* Menü İtemleri */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        item.active
                          ? 'bg-white text-ottoman-black'
                          : 'text-ottoman-cream/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}

                {/* Çıkış Yap */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
