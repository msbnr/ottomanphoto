'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Eye, Star, Check } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

const products = [
  {
    id: '1',
    name: 'Premium Lazer Yazıcı',
    sku: 'YAZICI-001',
    category: 'Elektronik',
    price: 5000,
    image: '/products/printer.jpg',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Dell Latitude 5420 Laptop',
    sku: 'LAPTOP-001',
    category: 'Elektronik',
    price: 25000,
    image: '/products/laptop.jpg',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Ergonomik Ofis Koltuğu',
    sku: 'KOLTUK-001',
    category: 'Mobilya',
    price: 3500,
    image: '/products/chair.jpg',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'A4 Fotokopi Kağıdı',
    sku: 'KAGIT-001',
    category: 'Ofis Malzemeleri',
    price: 450,
    image: '/products/paper.jpg',
    rating: 4.6,
  },
]

export default function FeaturedProducts() {
  const addToCart = useCartStore((state) => state.addItem)
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set())

  const handleAddToCart = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
    }, 1)

    // Başarı animasyonunu göster
    setAddedProducts(prev => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }
  return (
    <section className="py-20 bg-ottoman-black-light">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="header-ottoman mb-4">Öne Çıkan Ürünler</h2>
          <p className="text-ottoman-cream/70 text-lg max-w-2xl mx-auto">
            En çok tercih edilen, kaliteli ve uygun fiyatlı ofis ürünlerimiz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="card-ottoman group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Product Image */}
              <div className="relative h-48 bg-ottoman-black rounded-lg mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-ottoman-red/20 flex items-center justify-center">
                  <div className="text-6xl">📦</div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="badge-premium">Premium</span>
                </div>
                <div className="absolute inset-0 bg-ottoman-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <Link href={`/products/${product.id}`} className="p-3 bg-white rounded-full hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5 text-ottoman-black" />
                  </Link>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                  >
                    {addedProducts.has(product.id) ? (
                      <Check className="w-5 h-5 text-ottoman-black" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-ottoman-black" />
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="text-xs text-white/70 mb-1">{product.category}</div>
                <h3 className="text-lg font-semibold text-ottoman-cream mb-2 group-hover:text-white transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-sm text-ottoman-cream/70 ml-1">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="price-ottoman">{product.price.toLocaleString('tr-TR')} ₺</span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addedProducts.has(product.id)}
                    className="btn-ottoman-outline py-2 px-4 text-sm"
                  >
                    {addedProducts.has(product.id) ? 'Eklendi!' : 'Sepete Ekle'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/products" className="btn-ottoman">
            Tüm Ürünleri Gör
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
