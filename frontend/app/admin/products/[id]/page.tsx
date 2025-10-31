'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { productAPI } from '@/lib/api'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'Elektronik',
    stock: 0,
    boxQuantity: 1,
    pricing: {
      retail: 0,
      dealer: 0,
    },
    isActive: true,
  })

  useEffect(() => {
    if (!isNew) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(productId)
      // Backend returns { success: true, data: { ...product } }
      const product = response.data.data || response.data
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        category: product.category || 'Elektronik',
        stock: product.stock || 0,
        boxQuantity: product.boxQuantity || 1,
        pricing: {
          retail: product.pricing?.retail || 0,
          dealer: product.pricing?.dealer || 0,
        },
        isActive: product.isActive ?? true,
      })
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ürün yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        await productAPI.create(formData)
        alert('Ürün başarıyla oluşturuldu')
      } else {
        await productAPI.update(productId, formData)
        alert('Ürün başarıyla güncellendi')
      }
      router.push('/admin/products')
    } catch (error: any) {
      alert(error.response?.data?.message || 'İşlem sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return
    }

    setDeleting(true)

    try {
      await productAPI.delete(productId)
      alert('Ürün başarıyla silindi')
      router.push('/admin/products')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ürün silinirken hata oluştu')
    } finally {
      setDeleting(false)
    }
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
            <Link
              href="/admin/products"
              className="inline-flex items-center text-white hover:text-white-light mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Link>
            <h1 className="text-3xl font-serif font-bold">
              <span className="text-white">
                {isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
              </span>
            </h1>
          </div>
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-ottoman-secondary bg-red-500/20 border-red-500/30 hover:border-red-500 text-red-500 flex items-center space-x-2"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Siliniyor...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  <span>Ürünü Sil</span>
                </>
              )}
            </button>
          )}
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
                Fiyatlandırma (₺)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Perakende Fiyat *
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.pricing.retail}
                    onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, retail: parseFloat(e.target.value) } })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Bayi Fiyatı *
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.pricing.dealer}
                    onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, dealer: parseFloat(e.target.value) } })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Durum
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-white/30 bg-ottoman-black-lighter"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="text-ottoman-cream">Aktif</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-ottoman flex items-center space-x-2"
            >
              {saving ? (
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
                  <span>{isNew ? 'Oluştur' : 'Değişiklikleri Kaydet'}</span>
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
