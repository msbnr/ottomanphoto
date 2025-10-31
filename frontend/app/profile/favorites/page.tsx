'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface FavoriteProduct {
  _id: string
  name: string
  sku: string
  price: number
  images?: string[]
  stock: number
  category?: string
  boxQuantity?: number
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  // Şu an için favori sistemi localStorage'da tutulacak
  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('ottoman-favorites')
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites)
        setFavorites(Array.isArray(parsed) ? parsed : [])
      } else {
        setFavorites([])
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error)
      setFavorites([])
    }
  }

  const removeFavorite = (productId: string) => {
    const updatedFavorites = favorites.filter((item) => item._id !== productId)
    setFavorites(updatedFavorites)
    localStorage.setItem('ottoman-favorites', JSON.stringify(updatedFavorites))
  }

  const addToCart = (product: FavoriteProduct) => {
    addItem({
      id: product._id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.images?.[0],
      boxQuantity: product.boxQuantity,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="card-ottoman">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Başlık */}
      <div className="card-ottoman">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">
          Favorilerim
        </h1>
        <p className="text-ottoman-cream/70">
          Beğendiğiniz ürünleri görüntüleyin ve sepete ekleyin
        </p>
      </div>

      {/* Favoriler veya Boş Durum */}
      {favorites.length === 0 ? (
        <div className="card-ottoman">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ottoman-cream mb-2">
              Favori ürününüz yok
            </h3>
            <p className="text-ottoman-cream/60 mb-6">
              Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.
            </p>
            <Link href="/products" className="btn-ottoman inline-flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((product) => (
            <div key={product._id} className="card-ottoman group">
              <div className="relative">
                {/* Ürün Görseli */}
                <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-4 relative">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-16 h-16 text-white/30" />
                    </div>
                  )}

                  {/* Kaldır Butonu */}
                  <button
                    onClick={() => removeFavorite(product._id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Ürün Bilgileri */}
                <div className="space-y-2">
                  {product.category && (
                    <span className="text-xs text-white/70 uppercase tracking-wider">
                      {product.category}
                    </span>
                  )}
                  <h3 className="font-semibold text-lg text-ottoman-cream line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-ottoman-cream/60">SKU: {product.sku}</p>

                  {/* Fiyat */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-2xl font-bold text-white">
                      {formatPrice(product.price)}
                    </p>
                    {product.stock > 0 ? (
                      <span className="text-xs text-green-500">Stokta</span>
                    ) : (
                      <span className="text-xs text-red-500">Stok Yok</span>
                    )}
                  </div>

                  {/* Butonlar */}
                  <div className="flex items-center space-x-2 pt-4">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 btn-ottoman py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2 inline" />
                      Sepete Ekle
                    </button>
                    <Link
                      href={`/products/${product._id}`}
                      className="btn-ottoman-outline py-2 px-4"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
