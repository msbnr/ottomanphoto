'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ShoppingCart, User, LogIn, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // TODO: Get from auth context
  const cartItemCount = useCartStore((state) => state.getTotalItems())

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    setIsLoggedIn(false)
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-ottoman-gold/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-12 w-auto group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Ottoman Platform"
                width={180}
                height={48}
                className="h-12 w-auto object-contain"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ottoman-gold/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
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
            <Link href="/about" className="nav-link">
              Hakkımızda
            </Link>
            <Link href="/contact" className="nav-link">
              İletişim
            </Link>
            <Link href="/admin" className="nav-link text-ottoman-gold">
              Admin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 hover:text-ottoman-gold transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ottoman-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link href="/profile" className="p-2 hover:text-ottoman-gold transition-colors">
              <User className="w-6 h-6" />
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="btn-ottoman-secondary py-2 px-6 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            ) : (
              <Link href="/login" className="btn-ottoman-outline py-2 px-6">
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:text-ottoman-gold transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-ottoman-gold/20 animate-slide-up">
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
              <Link href="/about" className="nav-link py-2">
                Hakkımızda
              </Link>
              <Link href="/contact" className="nav-link py-2">
                İletişim
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-ottoman-gold/20">
                <Link href="/cart" className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Sepetim ({cartItemCount})</span>
                </Link>
                <Link href="/profile" className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profil</span>
                </Link>
              </div>
              <Link href="/login" className="btn-ottoman py-2 text-center">
                <LogIn className="w-5 h-5 inline mr-2" />
                Giriş Yap
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
