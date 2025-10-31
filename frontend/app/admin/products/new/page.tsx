'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'Elektronik',
    stock: 0,
    boxQuantity: 1,
    retailPrice: 0,
    dealerSmall: 0,
    dealerMedium: 0,
    dealerLarge: 0,
    dealerMain: 0,
    visibleToCustomers: true,
    visibleToDealers: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: API call to create product
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/products')
    }, 1500)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center text-white hover:text-white-light mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Link>
            <h1 className="text-3xl font-serif font-bold">
              <span className="text-white">
                Yeni Ürün Ekle
              </span>
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="card-ottoman space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Temel Bilgiler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    placeholder="URUN-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-ottoman-cream mb-2">
                Açıklama
              </label>
              <textarea
                className="input-ottoman min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Kategori *
                </label>
                <select
                  className="input-ottoman"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Elektronik">Elektronik</option>
                  <option value="Mobilya">Mobilya</option>
                  <option value="Ofis Malzemeleri">Ofis Malzemeleri</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Stok Miktarı *
                </label>
                <input
                  type="number"
                  className="input-ottoman"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Koli İçi Adet *
                </label>
                <input
                  type="number"
                  className="input-ottoman"
                  value={formData.boxQuantity}
                  onChange={(e) => setFormData({ ...formData, boxQuantity: parseInt(e.target.value) })}
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Fiyatlandırma (TL)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Perakende Fiyat *
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Küçük Bayi
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.dealerSmall}
                    onChange={(e) => setFormData({ ...formData, dealerSmall: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Orta Bayi
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.dealerMedium}
                    onChange={(e) => setFormData({ ...formData, dealerMedium: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Büyük Bayi
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.dealerLarge}
                    onChange={(e) => setFormData({ ...formData, dealerLarge: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Ana Bayi
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.dealerMain}
                    onChange={(e) => setFormData({ ...formData, dealerMain: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Görünürlük
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-white/30 bg-ottoman-black-lighter"
                    checked={formData.visibleToCustomers}
                    onChange={(e) => setFormData({ ...formData, visibleToCustomers: e.target.checked })}
                  />
                  <span className="text-ottoman-cream">Müşterilere Göster</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-white/30 bg-ottoman-black-lighter"
                    checked={formData.visibleToDealers}
                    onChange={(e) => setFormData({ ...formData, visibleToDealers: e.target.checked })}
                  />
                  <span className="text-ottoman-cream">Bayilere Göster</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-ottoman flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Kaydet</span>
                </>
              )}
            </button>
            <Link href="/admin/products" className="btn-ottoman-outline">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
