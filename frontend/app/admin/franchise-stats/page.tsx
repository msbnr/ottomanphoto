'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Building,
  ThumbsUp,
  TrendingUp,
  Headphones,
  Users,
  Award,
  Target,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Star,
  Heart,
  CheckCircle,
  TrendingDown,
  Activity,
  MapPin,
  Phone
} from 'lucide-react'

// Available icons for franchise stats
const AVAILABLE_ICONS = [
  { value: 'Building', label: 'Building (Bina)', icon: Building },
  { value: 'ThumbsUp', label: 'ThumbsUp (Beğeni)', icon: ThumbsUp },
  { value: 'TrendingUp', label: 'TrendingUp (Yükseliş)', icon: TrendingUp },
  { value: 'Headphones', label: 'Headphones (Kulaklık)', icon: Headphones },
  { value: 'Users', label: 'Users (Kullanıcılar)', icon: Users },
  { value: 'Award', label: 'Award (Ödül)', icon: Award },
  { value: 'Target', label: 'Target (Hedef)', icon: Target },
  { value: 'Shield', label: 'Shield (Kalkan)', icon: Shield },
  { value: 'Zap', label: 'Zap (Hız)', icon: Zap },
  { value: 'Clock', label: 'Clock (Saat)', icon: Clock },
  { value: 'DollarSign', label: 'DollarSign (Para)', icon: DollarSign },
  { value: 'Star', label: 'Star (Yıldız)', icon: Star },
  { value: 'Heart', label: 'Heart (Kalp)', icon: Heart },
  { value: 'CheckCircle', label: 'CheckCircle (Onay)', icon: CheckCircle },
  { value: 'BarChart3', label: 'BarChart3 (Grafik)', icon: BarChart3 },
  { value: 'Activity', label: 'Activity (Aktivite)', icon: Activity },
  { value: 'MapPin', label: 'MapPin (Konum)', icon: MapPin },
  { value: 'Phone', label: 'Phone (Telefon)', icon: Phone },
]
import { settingsAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface FranchiseStat {
  id: string
  label: string
  value: string
  icon: string
  order: number
}

export default function FranchiseStatsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [stats, setStats] = useState<FranchiseStat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStat, setEditingStat] = useState<FranchiseStat | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: 'BarChart3',
  })

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/franchise-stats')
      return
    }

    if (user?.userType !== 'admin') {
      router.push('/')
      return
    }

    fetchStats()
  }, [isHydrated, isAuthenticated, user, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await settingsAPI.get()
      const allStats = response.data.data.franchiseStats || []
      // Sort by order
      allStats.sort((a: FranchiseStat, b: FranchiseStat) => a.order - b.order)
      setStats(allStats)
    } catch (err: any) {
      setError(err.response?.data?.message || 'İstatistikler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const saveStats = async (updatedStats: FranchiseStat[]) => {
    try {
      setSaving(true)
      await settingsAPI.update({ franchiseStats: updatedStats })
      setStats(updatedStats)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kaydetme sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleAddStat = async () => {
    if (!formData.label || !formData.value) {
      setError('Etiket ve değer zorunludur')
      return
    }

    const newStat: FranchiseStat = {
      id: `stat${Date.now()}`,
      label: formData.label,
      value: formData.value,
      icon: formData.icon,
      order: stats.length + 1,
    }

    const updatedStats = [...stats, newStat]
    await saveStats(updatedStats)
    setShowAddModal(false)
    setFormData({ label: '', value: '', icon: 'BarChart3' })
  }

  const handleEditStat = async () => {
    if (!editingStat) return

    const updatedStats = stats.map(s =>
      s.id === editingStat.id ? editingStat : s
    )
    await saveStats(updatedStats)
    setEditingStat(null)
  }

  const handleDeleteStat = async (id: string) => {
    if (!confirm('Bu istatistiği silmek istediğinizden emin misiniz?')) return

    const updatedStats = stats.filter(s => s.id !== id)
    // Re-order after deletion
    updatedStats.forEach((s, index) => {
      s.order = index + 1
    })
    await saveStats(updatedStats)
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const updatedStats = [...stats]
    const temp = updatedStats[index]
    updatedStats[index] = updatedStats[index - 1]
    updatedStats[index - 1] = temp
    // Update order numbers
    updatedStats.forEach((s, i) => {
      s.order = i + 1
    })
    await saveStats(updatedStats)
  }

  const handleMoveDown = async (index: number) => {
    if (index === stats.length - 1) return
    const updatedStats = [...stats]
    const temp = updatedStats[index]
    updatedStats[index] = updatedStats[index + 1]
    updatedStats[index + 1] = temp
    // Update order numbers
    updatedStats.forEach((s, i) => {
      s.order = i + 1
    })
    await saveStats(updatedStats)
  }

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ottoman-cream/60">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-10 h-10 text-white" />
              <div>
                <h1 className="text-4xl font-serif font-bold text-white">
                  Franchise İstatistikleri
                </h1>
                <p className="text-ottoman-cream/70">
                  Franchise sayfasında gösterilecek istatistikleri yönetin
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-ottoman flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni İstatistik</span>
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {stats.length === 0 ? (
          <div className="card-ottoman text-center py-12">
            <BarChart3 className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60 mb-4">Henüz istatistik eklenmemiş</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-ottoman"
            >
              İlk İstatistiği Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="card-ottoman"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-ottoman-cream/50">#{stat.order}</span>
                    <span className="text-xs text-ottoman-cream/40 bg-white/5 px-2 py-1 rounded">
                      {stat.icon}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || saving}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === stats.length - 1 || saving}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-ottoman-cream/70 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingStat({ ...stat })}
                    disabled={saving}
                    className="btn-ottoman-outline btn-sm flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteStat(stat.id)}
                    disabled={saving}
                    className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                className="bg-[#0A0A0A] border border-white/10 rounded-lg max-w-2xl w-full p-6"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Yeni İstatistik Ekle</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:text-ottoman-gold transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Etiket *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="Örn: Aktif Franchise Sayısı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Değer *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="Örn: 50+ veya %95"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      İkon
                    </label>
                    <div className="relative">
                      <select
                        className="input-ottoman appearance-none pr-10"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      >
                        {AVAILABLE_ICONS.map((iconOption) => (
                          <option key={iconOption.value} value={iconOption.value}>
                            {iconOption.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-ottoman-cream/70">
                      <span>Önizleme:</span>
                      {AVAILABLE_ICONS.find(i => i.value === formData.icon)?.icon && (
                        <>
                          {(() => {
                            const IconComponent = AVAILABLE_ICONS.find(i => i.value === formData.icon)!.icon
                            return <IconComponent className="w-5 h-5" />
                          })()}
                        </>
                      )}
                      <span>{formData.icon}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleAddStat}
                      disabled={saving}
                      className="btn-ottoman flex-1 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      disabled={saving}
                      className="btn-ottoman-outline flex-1"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingStat && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStat(null)}
            >
              <motion.div
                className="bg-[#0A0A0A] border border-white/10 rounded-lg max-w-2xl w-full p-6"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-white">İstatistik Düzenle</h2>
                  <button
                    onClick={() => setEditingStat(null)}
                    className="text-white hover:text-ottoman-gold transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Etiket *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={editingStat.label}
                      onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Değer *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={editingStat.value}
                      onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      İkon
                    </label>
                    <div className="relative">
                      <select
                        className="input-ottoman appearance-none pr-10"
                        value={editingStat.icon}
                        onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                      >
                        {AVAILABLE_ICONS.map((iconOption) => (
                          <option key={iconOption.value} value={iconOption.value}>
                            {iconOption.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-ottoman-cream/70">
                      <span>Önizleme:</span>
                      {AVAILABLE_ICONS.find(i => i.value === editingStat.icon)?.icon && (
                        <>
                          {(() => {
                            const IconComponent = AVAILABLE_ICONS.find(i => i.value === editingStat.icon)!.icon
                            return <IconComponent className="w-5 h-5" />
                          })()}
                        </>
                      )}
                      <span>{editingStat.icon}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleEditStat}
                      disabled={saving}
                      className="btn-ottoman flex-1 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </button>
                    <button
                      onClick={() => setEditingStat(null)}
                      disabled={saving}
                      className="btn-ottoman-outline flex-1"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
