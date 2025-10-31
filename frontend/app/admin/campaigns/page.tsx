'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Power, Gift, ShoppingCart, Truck, Percent } from 'lucide-react'
import Link from 'next/link'

// Mock data
const campaigns = [
  {
    id: '1',
    name: 'Elektronik Ürünlerde %16 İndirim',
    type: 'category_discount',
    description: 'Tüm elektronik ürünlerde %16 indirim',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usage: { current: 45, total: 100 }
  },
  {
    id: '2',
    name: '2500₺ Üzeri Ücretsiz Kargo',
    type: 'free_shipping',
    description: '2500₺ ve üzeri alışverişlerde kargo bedava',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    usage: { current: 120, total: null }
  },
  {
    id: '3',
    name: 'Yazıcıda 1+1',
    type: 'buy_one_get_one',
    description: 'Seçili yazıcılarda 1 alana 1 bedava',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    isActive: true,
    usage: { current: 8, total: 50 }
  },
  {
    id: '4',
    name: 'Sepette %5 İndirim',
    type: 'cart_discount',
    description: '5000₺ üzeri alışverişlerde sepette %5 indirim',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    isActive: false,
    usage: { current: 30, total: 100 }
  },
]

const campaignTypeIcons = {
  buy_one_get_one: Gift,
  cart_discount: ShoppingCart,
  free_shipping: Truck,
  category_discount: Percent,
}

const campaignTypeLabels = {
  buy_one_get_one: '1+1 Kampanya',
  cart_discount: 'Sepet İndirimi',
  free_shipping: 'Ücretsiz Kargo',
  category_discount: 'Kategori İndirimi',
}

export default function AdminCampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleActive = async (campaignId: string) => {
    // TODO: API call to toggle campaign status
    alert(`Kampanya durumu değiştirildi: ${campaignId}`)
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      return
    }
    // TODO: API call to delete campaign
    alert(`Kampanya ${campaignId} silindi`)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              <span className="text-white">
                Kampanya Yönetimi
              </span>
            </h1>
            <p className="text-ottoman-cream/70">
              Tüm kampanyaları görüntüle, düzenle ve yönet
            </p>
          </div>
          <Link href="/admin/campaigns/new" className="btn-ottoman flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Yeni Kampanya</span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="text"
              placeholder="Kampanya adı ile ara..."
              className="input-ottoman pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredCampaigns.map((campaign, index) => {
            const Icon = campaignTypeIcons[campaign.type as keyof typeof campaignTypeIcons]
            const typeLabel = campaignTypeLabels[campaign.type as keyof typeof campaignTypeLabels]

            return (
              <motion.div
                key={campaign.id}
                className="card-ottoman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ottoman-cream mb-1">
                        {campaign.name}
                      </h3>
                      <span className="text-xs text-ottoman-cream/60">
                        {typeLabel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(campaign.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      campaign.isActive
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    }`}
                    title={campaign.isActive ? 'Kampanyayı Devre Dışı Bırak' : 'Kampanyayı Etkinleştir'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-ottoman-cream/70 text-sm mb-4">
                  {campaign.description}
                </p>

                <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-white/10">
                  <div className="text-ottoman-cream/60">
                    Başlangıç: {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="text-ottoman-cream/60">
                    Bitiş: {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                {/* Usage Stats */}
                {campaign.usage.total && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-ottoman-cream/60">Kullanım</span>
                      <span className="text-white font-semibold">
                        {campaign.usage.current} / {campaign.usage.total}
                      </span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-white to-white-light"
                        style={{ width: `${(campaign.usage.current / campaign.usage.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/admin/campaigns/${campaign.id}`}
                    className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Kampanyayı Düzenle"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Kampanyayı Sil"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {campaigns.length}
            </div>
            <div className="text-sm text-ottoman-cream/70">Toplam Kampanya</div>
          </div>
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {campaigns.filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-ottoman-cream/70">Aktif Kampanya</div>
          </div>
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {campaigns.filter(c => !c.isActive).length}
            </div>
            <div className="text-sm text-ottoman-cream/70">Pasif Kampanya</div>
          </div>
          <div className="card-ottoman text-center">
            <div className="text-3xl font-bold text-ottoman-cream mb-2">
              {campaigns.reduce((sum, c) => sum + c.usage.current, 0)}
            </div>
            <div className="text-sm text-ottoman-cream/70">Toplam Kullanım</div>
          </div>
        </div>
      </div>
    </div>
  )
}
