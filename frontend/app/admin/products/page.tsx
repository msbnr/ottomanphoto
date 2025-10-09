'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

// Mock data
const products = [
  {
    id: '1',
    name: 'Premium Lazer Yazıcı',
    sku: 'YAZICI-001',
    category: 'Elektronik',
    stock: 50,
    retailPrice: 5000,
    dealerPrice: 4200,
    status: 'active'
  },
  {
    id: '2',
    name: 'Dell Latitude 5420 Laptop',
    sku: 'LAPTOP-001',
    category: 'Elektronik',
    stock: 15,
    retailPrice: 25000,
    dealerPrice: 22000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Ergonomik Ofis Koltuğu',
    sku: 'KOLTUK-001',
    category: 'Mobilya',
    stock: 30,
    retailPrice: 3500,
    dealerPrice: 3000,
    status: 'active'
  },
  {
    id: '4',
    name: 'A4 Fotokopi Kağıdı',
    sku: 'KAGIT-001',
    category: 'Ofis Malzemeleri',
    stock: 200,
    retailPrice: 450,
    dealerPrice: 380,
    status: 'active'
  },
  {
    id: '5',
    name: 'HP Toner Kartuş 85A',
    sku: 'TONER-001',
    category: 'Ofis Malzemeleri',
    stock: 100,
    retailPrice: 750,
    dealerPrice: 650,
    status: 'active'
  },
]

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return
    }
    // TODO: API call to delete product
    alert(`Ürün ${productId} silindi`)
  }

  const handlePreview = (productId: string) => {
    // Open product detail page in new window
    window.open(`/products/${productId}`, '_blank')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              <span className="bg-gradient-to-r from-ottoman-gold to-ottoman-gold-light bg-clip-text text-transparent">
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ottoman-gold w-5 h-5" />
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
                <tr className="border-b border-ottoman-gold/20">
                  <th className="text-left p-4 text-ottoman-gold font-semibold">SKU</th>
                  <th className="text-left p-4 text-ottoman-gold font-semibold">Ürün Adı</th>
                  <th className="text-left p-4 text-ottoman-gold font-semibold">Kategori</th>
                  <th className="text-left p-4 text-ottoman-gold font-semibold">Stok</th>
                  <th className="text-left p-4 text-ottoman-gold font-semibold">Perakende</th>
                  <th className="text-left p-4 text-ottoman-gold font-semibold">Bayi</th>
                  <th className="text-left p-4 text-ottoman-gold font-semibold">Durum</th>
                  <th className="text-right p-4 text-ottoman-gold font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    className="border-b border-ottoman-gold/10 hover:bg-ottoman-gold/5 transition-colors"
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
                        {product.retailPrice.toLocaleString('tr-TR')} ₺
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-ottoman-gold">
                        {product.dealerPrice.toLocaleString('tr-TR')} ₺
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-semibold">
                        Aktif
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePreview(product.id)}
                          className="p-2 hover:bg-ottoman-gold/10 rounded-lg transition-colors"
                          title="Ürünü Önizle"
                        >
                          <Eye className="w-4 h-4 text-ottoman-cream/70" />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Ürünü Düzenle"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
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
            <button className="px-4 py-2 border border-ottoman-gold/20 rounded-lg text-ottoman-cream/70 hover:bg-ottoman-gold/10 transition-colors">
              Önceki
            </button>
            <button className="px-4 py-2 bg-ottoman-gold text-ottoman-black rounded-lg font-semibold">
              1
            </button>
            <button className="px-4 py-2 border border-ottoman-gold/20 rounded-lg text-ottoman-cream/70 hover:bg-ottoman-gold/10 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-ottoman-gold/20 rounded-lg text-ottoman-cream/70 hover:bg-ottoman-gold/10 transition-colors">
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
