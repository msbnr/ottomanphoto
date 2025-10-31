'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogIn, LogOut, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const cartItems = useCartStore((state) => state.items)

  // Prevent hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update cart count when cart changes
  useEffect(() => {
    if (isMounted) {
      const count = cartItems.reduce((total, item) => total + item.quantity, 0)
      setCartItemCount(count)
    }
  }, [cartItems, isMounted])

  const handleLogout = () => {
    logout()
    // Force page reload to clear all state
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-16 w-auto group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Ottoman Platform"
                width={240}
                height={64}
                className="h-16 w-auto object-contain"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              Ana Sayfa
            </Link>
            <Link href="/products" className="nav-link">
              Ürünler
            </Link>
            <Link href="/franchise" className="nav-link">
              Franchise
            </Link>
            <Link href="/business-model" className="nav-link">
              İş Modeli
            </Link>
            <Link href="/gallery" className="nav-link">
              Galeri
            </Link>
            <Link href="/about" className="nav-link">
              Hakkımızda
            </Link>
            <Link href="/contact" className="nav-link">
              İletişim
            </Link>
            <Link href="/faq" className="nav-link">
              SSS
            </Link>
            {user?.userType === 'admin' && (
              <Link href="/admin" className="nav-link text-white">
                Admin
              </Link>
            )}
            {user?.userType === 'dealer' && (
              <Link href="/dealer" className="nav-link text-ottoman-gold">
                Bayi Paneli
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ottoman-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="p-2 hover:text-white transition-colors" title="Siparişlerim">
                  <Package className="w-6 h-6" />
                </Link>
                <Link href="/profile" className="p-2 hover:text-white transition-colors" title={user?.email}>
                  <User className="w-6 h-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-ottoman-secondary py-2 px-6 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-ottoman-outline py-2 px-6">
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="nav-link py-2">
                Ana Sayfa
              </Link>
              <Link href="/products" className="nav-link py-2">
                Ürünler
              </Link>
              <Link href="/franchise" className="nav-link py-2">
                Franchise
              </Link>
              <Link href="/business-model" className="nav-link py-2">
                İş Modeli
              </Link>
              <Link href="/gallery" className="nav-link py-2">
                Galeri
              </Link>
              <Link href="/about" className="nav-link py-2">
                Hakkımızda
              </Link>
              <Link href="/contact" className="nav-link py-2">
                İletişim
              </Link>
              <Link href="/faq" className="nav-link py-2">
                SSS
              </Link>
              {user?.userType === 'admin' && (
                <Link href="/admin" className="nav-link py-2 text-white">
                  Admin
                </Link>
              )}
              {user?.userType === 'dealer' && (
                <Link href="/dealer" className="nav-link py-2 text-ottoman-gold">
                  Bayi Paneli
                </Link>
              )}
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                <Link href="/cart" className="flex items-center space-x-2 nav-link">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Sepetim {isMounted && cartItemCount > 0 && `(${cartItemCount})`}</span>
                </Link>
                {isAuthenticated && (
                  <>
                    <Link href="/orders" className="flex items-center space-x-2 nav-link">
                      <Package className="w-5 h-5" />
                      <span>Siparişlerim</span>
                    </Link>
                    <Link href="/profile" className="flex items-center space-x-2 nav-link">
                      <User className="w-5 h-5" />
                      <span>Profil</span>
                    </Link>
                  </>
                )}
              </div>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="btn-ottoman-secondary py-2 text-center"
                >
                  <LogOut className="w-5 h-5 inline mr-2" />
                  Çıkış Yap
                </button>
              ) : (
                <Link href="/login" className="btn-ottoman py-2 text-center">
                  <LogIn className="w-5 h-5 inline mr-2" />
                  Giriş Yap
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
