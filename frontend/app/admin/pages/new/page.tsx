'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewPagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    isPublished: false,
    showInMenu: false,
    menuOrder: 0,
  })

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    setFormData({ ...formData, title, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // TODO: API call to create page
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/pages')
    }, 1500)
  }

  const handlePreview = () => {
    // Open preview in new window with temp data
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.title || 'Önizleme'}</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                line-height: 1.6;
                background: #000;
                color: #e8dcc4;
              }
              h1 {
                color: #c9a961;
                border-bottom: 2px solid #c9a961;
                padding-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <h1>${formData.title}</h1>
            <div>${formData.content}</div>
          </body>
        </html>
      `)
      previewWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin/pages"
              className="inline-flex items-center text-ottoman-gold hover:text-ottoman-gold-light mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Link>
            <h1 className="text-3xl font-serif font-bold">
              <span className="bg-gradient-to-r from-ottoman-gold to-ottoman-gold-light bg-clip-text text-transparent">
                Yeni Sayfa Oluştur
              </span>
            </h1>
          </div>
          <button
            type="button"
            onClick={handlePreview}
            className="btn-ottoman-outline flex items-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>Önizle</span>
          </button>
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
                    Sayfa Başlığı *
                  </label>
                  <input
                    type="text"
                    className="input-ottoman"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    placeholder="Örn: Gizlilik Politikası"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    URL (Slug) *
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-ottoman-cream/50">/p/</span>
                    <input
                      type="text"
                      className="input-ottoman flex-1"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      pattern="[a-z0-9-]+"
                      placeholder="gizlilik-politikasi"
                    />
                  </div>
                  <p className="text-xs text-ottoman-cream/50 mt-1">
                    Sadece küçük harf, rakam ve tire (-) kullanın
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ottoman-cream mb-2">
                    Meta Açıklama
                  </label>
                  <textarea
                    className="input-ottoman min-h-[80px]"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    maxLength={160}
                    placeholder="SEO için kısa açıklama (maksimum 160 karakter)"
                  />
                  <p className="text-xs text-ottoman-cream/50 mt-1">
                    {formData.metaDescription.length} / 160 karakter
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-ottoman-cream mb-2">
                Sayfa İçeriği *
              </label>
              <textarea
                className="input-ottoman min-h-[400px] font-mono text-sm"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="HTML içerik girebilirsiniz...

Örnek:
<h2>Başlık</h2>
<p>Paragraf metni...</p>
<ul>
  <li>Liste elemanı 1</li>
  <li>Liste elemanı 2</li>
</ul>"
              />
              <p className="text-xs text-ottoman-cream/50 mt-1">
                HTML etiketleri kullanabilirsiniz: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;
              </p>
            </div>

            {/* Menu Settings */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Menü Ayarları
              </h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-ottoman-gold/30"
                    checked={formData.showInMenu}
                    onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                  />
                  <div>
                    <span className="text-ottoman-cream block">Menüde Göster</span>
                    <span className="text-xs text-ottoman-cream/60">
                      Bu sayfa site menüsünde görünecek
                    </span>
                  </div>
                </label>

                {formData.showInMenu && (
                  <div>
                    <label className="block text-sm font-medium text-ottoman-cream mb-2">
                      Menü Sırası
                    </label>
                    <input
                      type="number"
                      className="input-ottoman"
                      value={formData.menuOrder}
                      onChange={(e) => setFormData({ ...formData, menuOrder: parseInt(e.target.value) })}
                      min="0"
                    />
                    <p className="text-xs text-ottoman-cream/50 mt-1">
                      Küçük sayılar önce görünür
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Publishing */}
            <div>
              <h3 className="text-lg font-semibold text-ottoman-gold mb-4">
                Yayınlama
              </h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-ottoman-gold/30"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <div>
                  <span className="text-ottoman-cream block">Hemen Yayınla</span>
                  <span className="text-xs text-ottoman-cream/60">
                    İşaretlenmezse sayfa taslak olarak kaydedilir
                  </span>
                </div>
              </label>
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
                  <span>Sayfayı Kaydet</span>
                </>
              )}
            </button>
            <Link href="/admin/pages" className="btn-ottoman-outline">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
