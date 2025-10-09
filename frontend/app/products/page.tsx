'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with API call
const products = [
  {
    id: '1',
    name: 'Premium Lazer Yazıcı',
    sku: 'YAZICI-001',
    category: 'Elektronik',
    price: 5000,
    stock: 50,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Dell Latitude 5420 Laptop',
    sku: 'LAPTOP-001',
    category: 'Elektronik',
    price: 25000,
    stock: 15,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Ergonomik Ofis Koltuğu',
    sku: 'KOLTUK-001',
    category: 'Mobilya',
    price: 3500,
    stock: 30,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'A4 Fotokopi Kağıdı (5000 Yaprak)',
    sku: 'KAGIT-001',
    category: 'Ofis Malzemeleri',
    price: 450,
    stock: 200,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'HP Toner Kartuş 85A',
    sku: 'TONER-001',
    category: 'Ofis Malzemeleri',
    price: 750,
    stock: 100,
    rating: 4.8,
  },
]

const categories = ['Tümü', 'Elektronik', 'Mobilya', 'Ofis Malzemeleri']

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory

    let matchesPrice = true
    if (priceRange === 'low') matchesPrice = product.price < 1000
    if (priceRange === 'medium') matchesPrice = product.price >= 1000 && product.price < 10000
    if (priceRange === 'high') matchesPrice = product.price >= 10000

    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">Ürünlerimiz</h1>
          <p className="text-ottoman-cream/70 text-lg max-w-2xl mx-auto">
            Kaliteli ofis ürünleri ve elektronik cihazlar uygun fiyatlarla
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
            <input
              type="text"
              placeholder="Ürün adı veya SKU ile ara..."
              className="input-ottoman pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-ottoman-gold text-ottoman-black'
                    : 'bg-ottoman-black-lighter text-ottoman-cream hover:bg-ottoman-gold/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-ottoman-gold" />
            <select
              className="input-ottoman"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
            >
              <option value="all">Tüm Fiyatlar</option>
              <option value="low">0 - 1.000 ₺</option>
              <option value="medium">1.000 - 10.000 ₺</option>
              <option value="high">10.000 ₺ ve üzeri</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="card-ottoman group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
            >
              {/* Product Image */}
              <div className="relative h-48 bg-ottoman-black rounded-lg mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ottoman-gold/20 to-ottoman-red/20 flex items-center justify-center">
                  <div className="text-6xl">📦</div>
                </div>
                {product.stock < 20 && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-ottoman-red text-white text-xs px-2 py-1 rounded">
                      Son {product.stock} adet!
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-ottoman-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="p-3 bg-ottoman-gold rounded-full hover:scale-110 transition-transform"
                  >
                    <Eye className="w-5 h-5 text-ottoman-black" />
                  </Link>
                  <button className="p-3 bg-ottoman-gold rounded-full hover:scale-110 transition-transform">
                    <ShoppingCart className="w-5 h-5 text-ottoman-black" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="text-xs text-ottoman-gold/70 mb-1">{product.category}</div>
                <h3 className="text-lg font-semibold text-ottoman-cream mb-1 group-hover:text-ottoman-gold transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="text-xs text-ottoman-cream/50 mb-2">SKU: {product.sku}</div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-ottoman-gold">
                    {product.price.toLocaleString('tr-TR')} ₺
                  </span>
                  <span className="text-sm text-ottoman-cream/60">
                    Stok: {product.stock}
                  </span>
                </div>
                <button className="w-full btn-ottoman py-2 text-sm">
                  Sepete Ekle
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-ottoman-cream mb-2">Ürün bulunamadı</h3>
            <p className="text-ottoman-cream/70">
              Arama kriterlerinizi değiştirerek tekrar deneyin
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
