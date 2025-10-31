'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Check,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Target,
  GraduationCap,
  Computer,
  Heart,
  CheckCircle,
  Building,
  Users
} from 'lucide-react'

// Available icons for franchise features
const AVAILABLE_ICONS = [
  { value: 'Check', label: 'Check (Onay)', icon: Check },
  { value: 'Award', label: 'Award (Ödül)', icon: Award },
  { value: 'Star', label: 'Star (Yıldız)', icon: Star },
  { value: 'TrendingUp', label: 'TrendingUp (Yükseliş)', icon: TrendingUp },
  { value: 'Shield', label: 'Shield (Kalkan)', icon: Shield },
  { value: 'Zap', label: 'Zap (Hız)', icon: Zap },
  { value: 'Target', label: 'Target (Hedef)', icon: Target },
  { value: 'GraduationCap', label: 'GraduationCap (Eğitim)', icon: GraduationCap },
  { value: 'Computer', label: 'Computer (Bilgisayar)', icon: Computer },
  { value: 'Heart', label: 'Heart (Kalp)', icon: Heart },
  { value: 'CheckCircle', label: 'CheckCircle (Onay)', icon: CheckCircle },
  { value: 'Building', label: 'Building (Bina)', icon: Building },
  { value: 'Users', label: 'Users (Kullanıcılar)', icon: Users },
]
import { settingsAPI } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface FranchiseFeature {
  id: string
  title: string
  description: string
  icon: string
  isActive: boolean
  order: number
}

export default function FranchiseFeaturesPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [features, setFeatures] = useState<FranchiseFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<FranchiseFeature | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Check',
  })

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/franchise-features')
      return
    }

    if (user?.userType !== 'admin') {
      router.push('/')
      return
    }

    fetchFeatures()
  }, [isHydrated, isAuthenticated, user, router])

  const fetchFeatures = async () => {
    try {
      setLoading(true)
      const response = await settingsAPI.get()
      const allFeatures = response.data.data.franchiseFeatures || []
      // Sort by order
      allFeatures.sort((a: FranchiseFeature, b: FranchiseFeature) => a.order - b.order)
      setFeatures(allFeatures)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Özellikler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const saveFeatures = async (updatedFeatures: FranchiseFeature[]) => {
    try {
      setSaving(true)
      await settingsAPI.update({ franchiseFeatures: updatedFeatures })
      setFeatures(updatedFeatures)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kaydetme sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleAddFeature = async () => {
    if (!formData.title || !formData.description) {
      setError('Başlık ve açıklama zorunludur')
      return
    }

    const newFeature: FranchiseFeature = {
      id: `feature${Date.now()}`,
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      isActive: true,
      order: features.length + 1,
    }

    const updatedFeatures = [...features, newFeature]
    await saveFeatures(updatedFeatures)
    setShowAddModal(false)
    setFormData({ title: '', description: '', icon: 'Check' })
  }

  const handleEditFeature = async () => {
    if (!editingFeature) return

    const updatedFeatures = features.map(f =>
      f.id === editingFeature.id ? editingFeature : f
    )
    await saveFeatures(updatedFeatures)
    setEditingFeature(null)
  }

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Bu özelliği silmek istediğinizden emin misiniz?')) return

    const updatedFeatures = features.filter(f => f.id !== id)
    // Re-order after deletion
    updatedFeatures.forEach((f, index) => {
      f.order = index + 1
    })
    await saveFeatures(updatedFeatures)
  }

  const handleToggleActive = async (id: string) => {
    const updatedFeatures = features.map(f =>
      f.id === id ? { ...f, isActive: !f.isActive } : f
    )
    await saveFeatures(updatedFeatures)
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const updatedFeatures = [...features]
    const temp = updatedFeatures[index]
    updatedFeatures[index] = updatedFeatures[index - 1]
    updatedFeatures[index - 1] = temp
    // Update order numbers
    updatedFeatures.forEach((f, i) => {
      f.order = i + 1
    })
    await saveFeatures(updatedFeatures)
  }

  const handleMoveDown = async (index: number) => {
    if (index === features.length - 1) return
    const updatedFeatures = [...features]
    const temp = updatedFeatures[index]
    updatedFeatures[index] = updatedFeatures[index + 1]
    updatedFeatures[index + 1] = temp
    // Update order numbers
    updatedFeatures.forEach((f, i) => {
      f.order = i + 1
    })
    await saveFeatures(updatedFeatures)
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
              <Award className="w-10 h-10 text-white" />
              <div>
                <h1 className="text-4xl font-serif font-bold text-white">
                  Franchise Özellikleri
                </h1>
                <p className="text-ottoman-cream/70">
                  Franchise sayfasında gösterilecek avantajları yönetin
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-ottoman flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Özellik</span>
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {features.length === 0 ? (
          <div className="card-ottoman text-center py-12">
            <Award className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
            <p className="text-ottoman-cream/60 mb-4">Henüz özellik eklenmemiş</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-ottoman"
            >
              İlk Özelliği Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`card-ottoman ${!feature.isActive ? 'opacity-50' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || saving}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === features.length - 1 || saving}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm text-ottoman-cream/50">
                          #{feature.order}
                        </span>
                        <h3 className="text-lg font-semibold text-ottoman-cream">
                          {feature.title}
                        </h3>
                        <span className="text-xs text-ottoman-cream/40 bg-white/5 px-2 py-1 rounded">
                          {feature.icon}
                        </span>
                      </div>
                      <p className="text-sm text-ottoman-cream/70">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(feature.id)}
                      disabled={saving}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title={feature.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                    >
                      {feature.isActive ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingFeature({ ...feature })}
                      disabled={saving}
                      className="btn-ottoman-outline btn-sm"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      disabled={saving}
                      className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
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
                  <h2 className="text-2xl font-serif font-bold text-white">Yeni Özellik Ekle</h2>
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
                      Başlık *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Örn: Yerleşik Marka Gücü"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      className="input-ottoman min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Açıklama giriniz..."
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
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ottoman-cream/50 pointer-events-none" />
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
                      onClick={handleAddFeature}
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
          {editingFeature && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFeature(null)}
            >
              <motion.div
                className="bg-[#0A0A0A] border border-white/10 rounded-lg max-w-2xl w-full p-6"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-white">Özellik Düzenle</h2>
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="text-white hover:text-ottoman-gold transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      className="input-ottoman"
                      value={editingFeature.title}
                      onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Açıklama *
                    </label>
                    <textarea
                      className="input-ottoman min-h-[100px]"
                      value={editingFeature.description}
                      onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      İkon
                    </label>
                    <div className="relative">
                      <select
                        className="input-ottoman appearance-none pr-10"
                        value={editingFeature.icon}
                        onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                      >
                        {AVAILABLE_ICONS.map((iconOption) => (
                          <option key={iconOption.value} value={iconOption.value}>
                            {iconOption.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ottoman-cream/50 pointer-events-none" />
                    </div>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-ottoman-cream/70">
                      <span>Önizleme:</span>
                      {AVAILABLE_ICONS.find(i => i.value === editingFeature.icon)?.icon && (
                        <>
                          {(() => {
                            const IconComponent = AVAILABLE_ICONS.find(i => i.value === editingFeature.icon)!.icon
                            return <IconComponent className="w-5 h-5" />
                          })()}
                        </>
                      )}
                      <span>{editingFeature.icon}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleEditFeature}
                      disabled={saving}
                      className="btn-ottoman flex-1 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </button>
                    <button
                      onClick={() => setEditingFeature(null)}
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
