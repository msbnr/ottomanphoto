'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, ShoppingCart, Eye, Check, X, SlidersHorizontal,
  ChevronDown, TrendingUp, TrendingDown, Clock, Star
} from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { productAPI } from '@/lib/api'
import Loading from '@/components/Loading'

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  price: number
  dealerPrice?: number
  stock: number
  boxQuantity?: number
  rating?: number
  images?: string[]
  createdAt: string
}

const categories = ['Elektronik', 'Mobilya', 'Ofis Malzemeleri']

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'rating'

export default function ProductsPage() {
  const addToCart = useCartStore((state) => state.addItem)
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000])
  const [maxPrice] = useState(30000)
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll()
      setProducts(response.data.data.products || [])
    } catch (error: any) {
      console.error('Error fetching products:', error)
      setError('Ürünler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock === 0) return

    addToCart({
      id: product._id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      boxQuantity: product.boxQuantity,
      image: product.images?.[0],
    }, 1)

    setAddedProducts(prev => new Set(prev).add(product._id))
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(product._id)
        return newSet
      })
    }, 2000)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setPriceRange([0, maxPrice])
    setStockFilter('all')
    setSortBy('default')
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      let matchesStock = true
      if (stockFilter === 'in-stock') matchesStock = product.stock > 0
      if (stockFilter === 'out-of-stock') matchesStock = product.stock === 0

      return matchesSearch && matchesCategory && matchesPrice && matchesStock
    })

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'tr'))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return filtered
  }, [products, searchTerm, selectedCategories, priceRange, stockFilter, sortBy])

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (stockFilter !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0)

  if (loading) {
    return <Loading />
  }

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

        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full btn-ottoman mb-4 flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtreler {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
              {/* Search */}
              <div className="card-ottoman">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Arama
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ürün adı veya SKU..."
                    className="input-ottoman pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ottoman-cream/50 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="card-ottoman">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Kategoriler
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label
                      key={category}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-ottoman-gold focus:ring-ottoman-gold"
                      />
                      <span className="text-ottoman-cream group-hover:text-white transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="card-ottoman">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Fiyat Aralığı
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ottoman-cream/70">
                      {priceRange[0].toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="text-ottoman-cream/70">
                      {priceRange[1].toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-ottoman-gold"
                    />
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-ottoman-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="card-ottoman">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Stok Durumu
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === 'all'}
                      onChange={() => setStockFilter('all')}
                      className="w-4 h-4 border-white/20 bg-white/10 text-ottoman-gold focus:ring-ottoman-gold"
                    />
                    <span className="text-ottoman-cream group-hover:text-white transition-colors">
                      Tümü
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === 'in-stock'}
                      onChange={() => setStockFilter('in-stock')}
                      className="w-4 h-4 border-white/20 bg-white/10 text-ottoman-gold focus:ring-ottoman-gold"
                    />
                    <span className="text-ottoman-cream group-hover:text-white transition-colors">
                      Stokta Var
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === 'out-of-stock'}
                      onChange={() => setStockFilter('out-of-stock')}
                      className="w-4 h-4 border-white/20 bg-white/10 text-ottoman-gold focus:ring-ottoman-gold"
                    />
                    <span className="text-ottoman-cream group-hover:text-white transition-colors">
                      Tükendi
                    </span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full btn-ottoman-outline flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </motion.div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Results Bar */}
            <motion.div
              className="card-ottoman mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-ottoman-cream">
                <span className="text-white font-semibold">{filteredAndSortedProducts.length}</span> ürün bulundu
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-ottoman-cream/70">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="input-ottoman py-2 pr-8"
                >
                  <option value="default">Varsayılan</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="name-asc">İsim: A-Z</option>
                  <option value="name-desc">İsim: Z-A</option>
                  <option value="newest">En Yeni</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>
              </div>
            </motion.div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <motion.div
                className="mb-6 flex flex-wrap gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {searchTerm && (
                  <span className="px-3 py-1 bg-ottoman-gold/20 text-ottoman-gold rounded-full text-sm flex items-center gap-2">
                    Arama: &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-ottoman-gold/20 text-ottoman-gold rounded-full text-sm flex items-center gap-2">
                    {cat}
                    <button onClick={() => toggleCategory(cat)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <span className="px-3 py-1 bg-ottoman-gold/20 text-ottoman-gold rounded-full text-sm flex items-center gap-2">
                    {priceRange[0].toLocaleString('tr-TR')} - {priceRange[1].toLocaleString('tr-TR')} ₺
                    <button onClick={() => setPriceRange([0, maxPrice])} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {stockFilter !== 'all' && (
                  <span className="px-3 py-1 bg-ottoman-gold/20 text-ottoman-gold rounded-full text-sm flex items-center gap-2">
                    {stockFilter === 'in-stock' ? 'Stokta Var' : 'Tükendi'}
                    <button onClick={() => setStockFilter('all')} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </motion.div>
            )}

            {/* Products Grid */}
            {filteredAndSortedProducts.length === 0 ? (
              <motion.div
                className="card-ottoman text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-ottoman-cream mb-2">Ürün bulunamadı</h3>
                <p className="text-ottoman-cream/70 mb-6">
                  Arama kriterlerinizi değiştirerek tekrar deneyin
                </p>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="btn-ottoman">
                    Filtreleri Temizle
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      className="card-ottoman group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10 }}
                      layout
                    >
                      {/* Product Image */}
                      <div className="relative h-48 bg-ottoman-black rounded-lg mb-4 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-ottoman-red/20 flex items-center justify-center">
                          <div className="text-6xl">📦</div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                          {product.stock === 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                              Tükendi
                            </span>
                          )}
                          {product.stock > 0 && product.stock < 20 && (
                            <span className="bg-ottoman-red text-white text-xs px-2 py-1 rounded">
                              Son {product.stock} adet!
                            </span>
                          )}
                          {product.rating && (
                            <span className="ml-auto bg-white/90 text-black text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Star className="w-3 h-3 fill-ottoman-gold text-ottoman-gold" />
                              {product.rating}
                            </span>
                          )}
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-ottoman-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                          <Link
                            href={`/products/${product._id}`}
                            className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                          >
                            <Eye className="w-5 h-5 text-ottoman-black" />
                          </Link>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock === 0}
                            className={`p-3 rounded-full hover:scale-110 transition-transform ${
                              product.stock === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-white'
                            }`}
                          >
                            {addedProducts.has(product._id) ? (
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
                        <h3 className="text-lg font-semibold text-ottoman-cream mb-1 group-hover:text-white transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="text-xs text-ottoman-cream/50 mb-2">SKU: {product.sku}</div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-white">
                            {product.price.toLocaleString('tr-TR')} ₺
                          </span>
                          <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {product.stock > 0 ? `Stok: ${product.stock}` : 'Tükendi'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0 || addedProducts.has(product._id)}
                          className={`w-full py-2 text-sm rounded-lg transition-all ${
                            product.stock === 0
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : addedProducts.has(product._id)
                              ? 'bg-green-500 text-white'
                              : 'btn-ottoman'
                          }`}
                        >
                          {product.stock === 0
                            ? 'Stokta Yok'
                            : addedProducts.has(product._id)
                            ? 'Eklendi!'
                            : 'Sepete Ekle'
                          }
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
