'use client'

import { motion } from 'framer-motion'
import { Settings, User, Bell, Lock, Globe, Plus, Trash2, Edit2, ArrowUp, ArrowDown, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { settingsAPI } from '@/lib/api'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Ottoman Platform',
    siteEmail: 'info@ottoman.com',
    sitePhone: '+90 (212) 555 0000',
    whatsappNumber: '+905551234567',
    enableNotifications: true,
    enableRegistrations: true,
    maintenanceMode: false,
    franchiseConcepts: [] as any[],
    franchiseFeatures: [] as any[],
  })
  const [loading, setLoading] = useState(true)
  const [newConcept, setNewConcept] = useState({ id: '', name: '', isActive: true })
  const [showConceptForm, setShowConceptForm] = useState(false)
  const [newFeature, setNewFeature] = useState({ id: '', title: '', description: '', icon: 'Award', isActive: true, order: 0 })
  const [showFeatureForm, setShowFeatureForm] = useState(false)
  const [editingFeature, setEditingFeature] = useState<any>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      setSettings(response.data.data || settings)
    } catch (err) {
      console.error('Ayarlar yüklenemedi', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await settingsAPI.update(settings)
      alert('Ayarlar başarıyla kaydedildi')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ayarlar kaydedilirken hata oluştu')
    }
  }

  const handleAddConcept = () => {
    if (!newConcept.name) {
      alert('Lütfen konsept adını girin')
      return
    }
    const id = newConcept.name.toLowerCase().replace(/\s+/g, '_')
    const concepts = [...settings.franchiseConcepts, { ...newConcept, id }]
    setSettings({ ...settings, franchiseConcepts: concepts })
    setNewConcept({ id: '', name: '', isActive: true })
    setShowConceptForm(false)
  }

  const handleRemoveConcept = (id: string) => {
    const concepts = settings.franchiseConcepts.filter(c => c.id !== id)
    setSettings({ ...settings, franchiseConcepts: concepts })
  }

  const toggleConceptActive = (id: string) => {
    const concepts = settings.franchiseConcepts.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    )
    setSettings({ ...settings, franchiseConcepts: concepts })
  }

  // Franchise Features Management
  const handleAddFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      alert('Lütfen başlık ve açıklama girin')
      return
    }
    const id = newFeature.title.toLowerCase().replace(/\s+/g, '_')
    const order = settings.franchiseFeatures.length + 1
    const features = [...settings.franchiseFeatures, { ...newFeature, id, order }]
    setSettings({ ...settings, franchiseFeatures: features })
    setNewFeature({ id: '', title: '', description: '', icon: 'Award', isActive: true, order: 0 })
    setShowFeatureForm(false)
  }

  const handleRemoveFeature = (id: string) => {
    const features = settings.franchiseFeatures.filter(f => f.id !== id)
    setSettings({ ...settings, franchiseFeatures: features })
  }

  const toggleFeatureActive = (id: string) => {
    const features = settings.franchiseFeatures.map(f =>
      f.id === id ? { ...f, isActive: !f.isActive } : f
    )
    setSettings({ ...settings, franchiseFeatures: features })
  }

  const moveFeatureUp = (index: number) => {
    if (index === 0) return
    const features = [...settings.franchiseFeatures]
    ;[features[index - 1], features[index]] = [features[index], features[index - 1]]
    features.forEach((f, i) => f.order = i + 1)
    setSettings({ ...settings, franchiseFeatures: features })
  }

  const moveFeatureDown = (index: number) => {
    if (index === settings.franchiseFeatures.length - 1) return
    const features = [...settings.franchiseFeatures]
    ;[features[index], features[index + 1]] = [features[index + 1], features[index]]
    features.forEach((f, i) => f.order = i + 1)
    setSettings({ ...settings, franchiseFeatures: features })
  }

  const handleEditFeature = (feature: any) => {
    setEditingFeature({ ...feature })
    setShowFeatureForm(true)
  }

  const handleUpdateFeature = () => {
    if (!editingFeature.title || !editingFeature.description) {
      alert('Lütfen başlık ve açıklama girin')
      return
    }
    const features = settings.franchiseFeatures.map(f =>
      f.id === editingFeature.id ? editingFeature : f
    )
    setSettings({ ...settings, franchiseFeatures: features })
    setEditingFeature(null)
    setShowFeatureForm(false)
  }

  const handleCancelEdit = () => {
    setEditingFeature(null)
    setShowFeatureForm(false)
    setNewFeature({ id: '', title: '', description: '', icon: 'Award', isActive: true, order: 0 })
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Settings className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-serif font-bold text-white">
              Sistem Ayarları
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            Platform ayarlarını yönetin
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Site Bilgileri */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-semibold text-white">Site Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  className="input-ottoman"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  className="input-ottoman"
                  value={settings.siteEmail}
                  onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  className="input-ottoman"
                  value={settings.sitePhone}
                  onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  WhatsApp Numarası
                </label>
                <input
                  type="tel"
                  className="input-ottoman"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="+905551234567"
                />
                <p className="text-xs text-ottoman-cream/60 mt-1">
                  Ülke kodu ile birlikte girin (örn: +905551234567)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bildirimler */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-semibold text-white">Bildirimler</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-ottoman-cream">Bildirimleri Aktif Et</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-white/30"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                />
              </label>
            </div>
          </motion.div>

          {/* Kullanıcı Ayarları */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-semibold text-white">Kullanıcı Ayarları</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-ottoman-cream">Yeni Kayıtları Aktif Et</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-white/30"
                  checked={settings.enableRegistrations}
                  onChange={(e) => setSettings({ ...settings, enableRegistrations: e.target.checked })}
                />
              </label>
            </div>
          </motion.div>

          {/* Sistem */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-semibold text-white">Sistem</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-ottoman-cream block">Bakım Modu</span>
                  <span className="text-sm text-ottoman-cream/60">
                    Aktif edildiğinde site ziyaretçiler için kapalı olur
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-white/30"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                />
              </label>
            </div>
          </motion.div>

          {/* Franchise Konseptleri */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-semibold text-white">Franchise Konseptleri</h2>
              </div>
              <button
                onClick={() => setShowConceptForm(!showConceptForm)}
                className="btn-ottoman-outline btn-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Konsept
              </button>
            </div>

            {showConceptForm && (
              <div className="bg-ottoman-black-lighter p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-ottoman-cream mb-4">Yeni Konsept Ekle</h3>
                <div className="mb-4">
                  <input
                    type="text"
                    className="input-ottoman"
                    placeholder="Konsept Adı (ör: Mini Market)"
                    value={newConcept.name}
                    onChange={(e) => setNewConcept({ ...newConcept, name: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <button onClick={handleAddConcept} className="btn-ottoman flex-1">
                    Ekle
                  </button>
                  <button
                    onClick={() => setShowConceptForm(false)}
                    className="btn-ottoman-outline flex-1"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {settings.franchiseConcepts.map((concept, index) => (
                <div
                  key={concept.id}
                  className="flex items-center justify-between p-4 bg-ottoman-black-lighter rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-ottoman-cream">{concept.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleConceptActive(concept.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        concept.isActive
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}
                    >
                      {concept.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                    <button
                      onClick={() => handleRemoveConcept(concept.id)}
                      className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              {settings.franchiseConcepts.length === 0 && (
                <p className="text-center text-ottoman-cream/50 py-8">Henüz konsept eklenmemiş</p>
              )}
            </div>
          </motion.div>

          {/* Franchise Features */}
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-semibold text-white">Franchise Özellikleri</h2>
              </div>
              <button
                onClick={() => setShowFeatureForm(!showFeatureForm)}
                className="btn-ottoman-outline btn-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Özellik
              </button>
            </div>

            {showFeatureForm && (
              <div className="bg-ottoman-black-lighter p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-ottoman-cream mb-4">
                  {editingFeature ? 'Özellik Düzenle' : 'Yeni Özellik Ekle'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Başlık</label>
                    <input
                      type="text"
                      className="input-ottoman"
                      placeholder="Özellik başlığı (ör: Profesyonel Eğitim)"
                      value={editingFeature ? editingFeature.title : newFeature.title}
                      onChange={(e) => editingFeature
                        ? setEditingFeature({ ...editingFeature, title: e.target.value })
                        : setNewFeature({ ...newFeature, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">Açıklama</label>
                    <textarea
                      className="input-ottoman min-h-[80px]"
                      placeholder="Özellik açıklaması"
                      value={editingFeature ? editingFeature.description : newFeature.description}
                      onChange={(e) => editingFeature
                        ? setEditingFeature({ ...editingFeature, description: e.target.value })
                        : setNewFeature({ ...newFeature, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">İkon</label>
                    <select
                      className="input-ottoman"
                      value={editingFeature ? editingFeature.icon : newFeature.icon}
                      onChange={(e) => editingFeature
                        ? setEditingFeature({ ...editingFeature, icon: e.target.value })
                        : setNewFeature({ ...newFeature, icon: e.target.value })
                      }
                    >
                      <option value="Award">Ödül (Award)</option>
                      <option value="GraduationCap">Mezuniyet Şapkası (GraduationCap)</option>
                      <option value="Computer">Bilgisayar (Computer)</option>
                      <option value="TrendingUp">Yukarı Trend (TrendingUp)</option>
                      <option value="Shield">Kalkan (Shield)</option>
                      <option value="Users">Kullanıcılar (Users)</option>
                      <option value="DollarSign">Dolar İşareti (DollarSign)</option>
                      <option value="Check">Onay (Check)</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={editingFeature ? handleUpdateFeature : handleAddFeature}
                    className="btn-ottoman flex-1"
                  >
                    {editingFeature ? 'Güncelle' : 'Ekle'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-ottoman-outline flex-1"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {settings.franchiseFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-4 bg-ottoman-black-lighter rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-ottoman-cream">{feature.title}</h4>
                    <p className="text-sm text-ottoman-cream/60 mt-1">{feature.description}</p>
                    <p className="text-xs text-ottoman-cream/40 mt-1">İkon: {feature.icon}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveFeatureUp(index)}
                      disabled={index === 0}
                      className={`btn-ottoman-outline btn-sm ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFeatureDown(index)}
                      disabled={index === settings.franchiseFeatures.length - 1}
                      className={`btn-ottoman-outline btn-sm ${index === settings.franchiseFeatures.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFeatureActive(feature.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        feature.isActive
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-500/20 text-gray-500'
                      }`}
                    >
                      {feature.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                    <button
                      onClick={() => handleEditFeature(feature)}
                      className="btn-ottoman-outline btn-sm bg-blue-500/10 border-blue-500/20"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleRemoveFeature(feature.id)}
                      className="btn-ottoman-outline btn-sm bg-red-500/10 border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              {settings.franchiseFeatures.length === 0 && (
                <p className="text-center text-ottoman-cream/50 py-8">Henüz özellik eklenmemiş</p>
              )}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button onClick={handleSave} className="btn-ottoman w-full">
              Ayarları Kaydet
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
