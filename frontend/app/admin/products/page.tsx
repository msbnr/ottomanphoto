'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { productAPI } from '@/lib/api'

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  stock: number
  pricing: {
    retail: number
    dealer: number
  }
  isActive: boolean
}

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      const data = response.data
      // Backend returns { success: true, data: { products: [...] } }
      if (data.data && Array.isArray(data.data.products)) {
        setProducts(data.data.products)
      } else if (Array.isArray(data.products)) {
        setProducts(data.products)
      } else if (Array.isArray(data)) {
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return
    }
    try {
      await productAPI.delete(productId)
      fetchProducts()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ürün silinirken hata oluştu')
    }
  }

  const handlePreview = (productId: string) => {
    window.open(`/products/${productId}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ottoman-cream/60">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              <span className="text-white">
                Ürün Yönetimi
              </span>
            </h1>
            <p className="text-ottoman-cream/70">
              Tüm ürünleri görüntüle, düzenle ve yönet
            </p>
          </div>
          <Link href="/admin/products/new" className="btn-ottoman flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Yeni Ürün</span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="text"
              placeholder="Ürün adı veya SKU ile ara..."
              className="input-ottoman pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="card-ottoman overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-white font-semibold">SKU</th>
                  <th className="text-left p-4 text-white font-semibold">Ürün Adı</th>
                  <th className="text-left p-4 text-white font-semibold">Kategori</th>
                  <th className="text-left p-4 text-white font-semibold">Stok</th>
                  <th className="text-left p-4 text-white font-semibold">Perakende</th>
                  <th className="text-left p-4 text-white font-semibold">Bayi</th>
                  <th className="text-left p-4 text-white font-semibold">Durum</th>
                  <th className="text-right p-4 text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="p-4">
                      <span className="text-ottoman-cream/80 font-mono text-sm">
                        {product.sku}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream font-medium">
                        {product.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream/70">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        product.stock < 20 ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-cream">
                        {product.pricing?.retail ? product.pricing.retail.toLocaleString('tr-TR') : '-'} ₺
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white">
                        {product.pricing?.dealer ? product.pricing.dealer.toLocaleString('tr-TR') : '-'} ₺
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isActive
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {product.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePreview(product._id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Ürünü Önizle"
                        >
                          <Eye className="w-4 h-4 text-ottoman-cream/70" />
                        </button>
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Ürünü Düzenle"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Ürünü Sil"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-ottoman-cream/70 text-sm">
            Toplam {filteredProducts.length} ürün gösteriliyor
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-white/20 rounded-lg text-ottoman-cream/70 hover:bg-white/10 transition-colors">
              Önceki
            </button>
            <button className="px-4 py-2 bg-white text-ottoman-black rounded-lg font-semibold">
              1
            </button>
            <button className="px-4 py-2 border border-white/20 rounded-lg text-ottoman-cream/70 hover:bg-white/10 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-white/20 rounded-lg text-ottoman-cream/70 hover:bg-white/10 transition-colors">
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
