'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type CampaignType = 'buy_one_get_one' | 'cart_discount' | 'free_shipping' | 'category_discount'

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [campaignType, setCampaignType] = useState<CampaignType>('cart_discount')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    targetUserTypes: ['all'] as string[],

    // Cart discount
    cartMinAmount: 2500,
    cartDiscountType: 'percentage' as 'percentage' | 'fixed',
    cartDiscountValue: 5,
    cartMaxDiscount: 500,

    // Free shipping
    freeShippingMinAmount: 2500,

    // Category discount
    categoryDiscountType: 'percentage' as 'percentage' | 'fixed',
    categoryDiscountValue: 16,
    selectedCategories: [] as string[],

    // Buy one get one
    freeQuantity: 1,
    selectedProducts: [] as string[],

    // Usage limits
    useTotalLimit: false,
    totalUsageLimit: 100,
    usePerUserLimit: false,
    perUserLimit: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: API call to create campaign
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/campaigns')
    }, 1500)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/campaigns"
              className="inline-flex items-center text-ottoman-gold hover:text-ottoman-gold-light mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Link>
            <h1 className="text-3xl font-serif font-bold">
              <span className="bg-gradient-to-r from-ottoman-gold to-ottoman-gold-light bg-clip-text text-transparent">
                Yeni Kampanya Oluştur
              </span>
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="card-ottoman space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Temel Bilgiler
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Kampanya Adı *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Örn: 2500₺ Üzeri Ücretsiz Kargo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Açıklama
                  </label>
                  <textarea
                    className="input-ottoman min-h-[80px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kampanya detayları..."
                  />
                </div>
              </div>
            </div>

            {/* Campaign Type */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Kampanya Tipi *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCampaignType('cart_discount')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    campaignType === 'cart_discount'
                      ? 'border-ottoman-gold bg-ottoman-gold/10'
                      : 'border-ottoman-gold/20 hover:border-ottoman-gold/40'
                  }`}
                >
                  <div className="text-lg font-semibold text-ottoman-cream mb-1">
                    Sepet İndirimi
                  </div>
                  <div className="text-sm text-ottoman-cream/60">
                    Belirli tutarın üzerinde sepet indirimi
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCampaignType('free_shipping')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    campaignType === 'free_shipping'
                      ? 'border-ottoman-gold bg-ottoman-gold/10'
                      : 'border-ottoman-gold/20 hover:border-ottoman-gold/40'
                  }`}
                >
                  <div className="text-lg font-semibold text-ottoman-cream mb-1">
                    Ücretsiz Kargo
                  </div>
                  <div className="text-sm text-ottoman-cream/60">
                    Belirli tutarın üzerinde ücretsiz kargo
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCampaignType('category_discount')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    campaignType === 'category_discount'
                      ? 'border-ottoman-gold bg-ottoman-gold/10'
                      : 'border-ottoman-gold/20 hover:border-ottoman-gold/40'
                  }`}
                >
                  <div className="text-lg font-semibold text-ottoman-cream mb-1">
                    Kategori İndirimi
                  </div>
                  <div className="text-sm text-ottoman-cream/60">
                    Belirli kategorilerde indirim
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCampaignType('buy_one_get_one')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    campaignType === 'buy_one_get_one'
                      ? 'border-ottoman-gold bg-ottoman-gold/10'
                      : 'border-ottoman-gold/20 hover:border-ottoman-gold/40'
                  }`}
                >
                  <div className="text-lg font-semibold text-ottoman-cream mb-1">
                    1+1 Kampanya
                  </div>
                  <div className="text-sm text-ottoman-cream/60">
                    Belirli ürünlerde 1 alana 1 bedava
                  </div>
                </button>
              </div>
            </div>

            {/* Campaign Specific Settings */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Kampanya Detayları
              </h3>

              {/* Cart Discount */}
              {campaignType === 'cart_discount' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        Minimum Sepet Tutarı (₺) *
                      </label>
                      <input
                        type="number"
                        className="input-ottoman"
                        value={formData.cartMinAmount}
                        onChange={(e) => setFormData({ ...formData, cartMinAmount: parseFloat(e.target.value) })}
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        İndirim Tipi *
                      </label>
                      <select
                        className="input-ottoman"
                        value={formData.cartDiscountType}
                        onChange={(e) => setFormData({ ...formData, cartDiscountType: e.target.value as 'percentage' | 'fixed' })}
                      >
                        <option value="percentage">Yüzde (%)</option>
                        <option value="fixed">Sabit Tutar (₺)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        İndirim Değeri *
                      </label>
                      <input
                        type="number"
                        className="input-ottoman"
                        value={formData.cartDiscountValue}
                        onChange={(e) => setFormData({ ...formData, cartDiscountValue: parseFloat(e.target.value) })}
                        required
                        min="0"
                      />
                    </div>
                    {formData.cartDiscountType === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-ottoman-cream mb-2">
                          Maksimum İndirim (₺)
                        </label>
                        <input
                          type="number"
                          className="input-ottoman"
                          value={formData.cartMaxDiscount}
                          onChange={(e) => setFormData({ ...formData, cartMaxDiscount: parseFloat(e.target.value) })}
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Free Shipping */}
              {campaignType === 'free_shipping' && (
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Minimum Sepet Tutarı (₺) *
                  </label>
                  <input
                    type="number"
                    className="input-ottoman"
                    value={formData.freeShippingMinAmount}
                    onChange={(e) => setFormData({ ...formData, freeShippingMinAmount: parseFloat(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
              )}

              {/* Category Discount */}
              {campaignType === 'category_discount' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Kategoriler *
                    </label>
                    <select
                      multiple
                      className="input-ottoman min-h-[100px]"
                      value={formData.selectedCategories}
                      onChange={(e) => setFormData({
                        ...formData,
                        selectedCategories: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                    >
                      <option value="elektronik">Elektronik</option>
                      <option value="mobilya">Mobilya</option>
                      <option value="ofis-malzemeleri">Ofis Malzemeleri</option>
                    </select>
                    <p className="text-xs text-ottoman-cream/50 mt-1">
                      Ctrl/Cmd tuşu ile birden fazla seçim yapabilirsiniz
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        İndirim Tipi *
                      </label>
                      <select
                        className="input-ottoman"
                        value={formData.categoryDiscountType}
                        onChange={(e) => setFormData({ ...formData, categoryDiscountType: e.target.value as 'percentage' | 'fixed' })}
                      >
                        <option value="percentage">Yüzde (%)</option>
                        <option value="fixed">Sabit Tutar (₺)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream mb-2">
                        İndirim Değeri *
                      </label>
                      <input
                        type="number"
                        className="input-ottoman"
                        value={formData.categoryDiscountValue}
                        onChange={(e) => setFormData({ ...formData, categoryDiscountValue: parseFloat(e.target.value) })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Buy One Get One */}
              {campaignType === 'buy_one_get_one' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Bedava Ürün Adedi *
                    </label>
                    <input
                      type="number"
                      className="input-ottoman"
                      value={formData.freeQuantity}
                      onChange={(e) => setFormData({ ...formData, freeQuantity: parseInt(e.target.value) })}
                      required
                      min="1"
                      placeholder="Örn: 1 (1+1 için)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Ürünler *
                    </label>
                    <select
                      multiple
                      className="input-ottoman min-h-[100px]"
                      value={formData.selectedProducts}
                      onChange={(e) => setFormData({
                        ...formData,
                        selectedProducts: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                    >
                      <option value="1">HP LaserJet Pro Yazıcı</option>
                      <option value="2">Dell Latitude 5420 Laptop</option>
                      <option value="3">Ergonomik Ofis Koltuğu</option>
                    </select>
                    <p className="text-xs text-ottoman-cream/50 mt-1">
                      Ctrl/Cmd tuşu ile birden fazla seçim yapabilirsiniz
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Kampanya Tarihleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Başlangıç Tarihi *
                  </label>
                  <input
                    type="datetime-local"
                    className="input-ottoman"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Bitiş Tarihi *
                  </label>
                  <input
                    type="datetime-local"
                    className="input-ottoman"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Hedef Kitle
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30"
                    checked={formData.targetUserTypes.includes('all')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, targetUserTypes: ['all'] })
                      } else {
                        setFormData({ ...formData, targetUserTypes: [] })
                      }
                    }}
                  />
                  <span className="text-ottoman-cream">Tüm Kullanıcılar</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30"
                    checked={formData.targetUserTypes.includes('customer')}
                    disabled={formData.targetUserTypes.includes('all')}
                  />
                  <span className="text-ottoman-cream">Sadece Müşteriler</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30"
                    checked={formData.targetUserTypes.includes('dealer')}
                    disabled={formData.targetUserTypes.includes('all')}
                  />
                  <span className="text-ottoman-cream">Sadece Bayiler</span>
                </label>
              </div>
            </div>

            {/* Usage Limits */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Kullanım Limitleri
              </h3>
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30 mt-0.5"
                    checked={formData.useTotalLimit}
                    onChange={(e) => setFormData({ ...formData, useTotalLimit: e.target.checked })}
                  />
                  <div className="flex-1">
                    <span className="text-ottoman-cream block mb-2">Toplam Kullanım Limiti</span>
                    {formData.useTotalLimit && (
                      <input
                        type="number"
                        className="input-ottoman"
                        value={formData.totalUsageLimit}
                        onChange={(e) => setFormData({ ...formData, totalUsageLimit: parseInt(e.target.value) })}
                        min="1"
                      />
                    )}
                  </div>
                </label>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30 mt-0.5"
                    checked={formData.usePerUserLimit}
                    onChange={(e) => setFormData({ ...formData, usePerUserLimit: e.target.checked })}
                  />
                  <div className="flex-1">
                    <span className="text-ottoman-cream block mb-2">Kullanıcı Başına Limit</span>
                    {formData.usePerUserLimit && (
                      <input
                        type="number"
                        className="input-ottoman"
                        value={formData.perUserLimit}
                        onChange={(e) => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) })}
                        min="1"
                      />
                    )}
                  </div>
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
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Kampanya Oluştur</span>
                </>
              )}
            </button>
            <Link href="/admin/campaigns" className="btn-ottoman-outline">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
