'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Mock function to fetch page data
const fetchPageData = async (slug: string) => {
  // TODO: Replace with actual API call
  const mockPages: Record<string, any> = {
    'gizlilik-politikasi': {
      title: 'Gizlilik Politikası',
      content: `
        <h2>1. Giriş</h2>
        <p>Bu gizlilik politikası, Ottoman Platform tarafından toplanan kişisel verilerin işlenmesi ve korunması hakkında bilgi vermektedir.</p>

        <h2>2. Toplanan Veriler</h2>
        <p>Web sitemizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
        <ul>
          <li>Ad, soyad ve iletişim bilgileri</li>
          <li>Sipariş ve ödeme bilgileri</li>
          <li>IP adresi ve tarayıcı bilgileri</li>
          <li>Çerez verileri</li>
        </ul>

        <h2>3. Verilerin Kullanımı</h2>
        <p>Toplanan veriler şu amaçlarla kullanılır:</p>
        <ul>
          <li>Siparişlerinizi işlemek ve teslimat yapmak</li>
          <li>Müşteri hizmetleri sağlamak</li>
          <li>Web sitemizi geliştirmek</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
        </ul>

        <h2>4. Veri Güvenliği</h2>
        <p>Kişisel verilerinizin güvenliği için endüstri standartlarında güvenlik önlemleri alınmaktadır.</p>

        <h2>5. İletişim</h2>
        <p>Gizlilik politikamız hakkında sorularınız için <a href="/contact" style="color: #c9a961;">iletişim sayfamızdan</a> bize ulaşabilirsiniz.</p>
      `,
      updatedAt: '2024-01-15T10:30:00',
    },
    'kullanim-kosullari': {
      title: 'Kullanım Koşulları',
      content: `
        <h2>1. Genel Koşullar</h2>
        <p>Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş olursunuz.</p>

        <h2>2. Ürün ve Fiyatlar</h2>
        <p>Tüm ürün fiyatları Türk Lirası (₺) cinsindendir ve KDV dahildir. Fiyatlar önceden haber verilmeksizin değiştirilebilir.</p>

        <h2>3. Sipariş ve Teslimat</h2>
        <p>Siparişler onaylandıktan sonra belirtilen süre içinde kargoya verilir. Teslimat süreleri kargo firmasına ve bölgeye göre değişiklik gösterebilir.</p>

        <h2>4. İade ve İptal</h2>
        <p>14 gün içinde ürünleri iade edebilirsiniz. Detaylı bilgi için iade ve değişim politikamızı inceleyiniz.</p>

        <h2>5. Fikri Mülkiyet</h2>
        <p>Bu sitedeki tüm içerik, logo, tasarım ve görseller Ottoman Platform'a aittir ve telif hakları ile korunmaktadır.</p>
      `,
      updatedAt: '2024-01-14T15:20:00',
    },
    'iade-ve-degisim': {
      title: 'İade ve Değişim Politikası',
      content: `
        <h2>İade Koşulları</h2>
        <p>Satın aldığınız ürünleri teslim tarihinden itibaren 14 gün içerisinde iade edebilirsiniz.</p>

        <h3>İade Edilebilir Ürünler</h3>
        <ul>
          <li>Orijinal ambalajında ve kullanılmamış ürünler</li>
          <li>Ürünle birlikte gelen tüm aksesuarlar ve belgeler tam olmalıdır</li>
          <li>Ürün hasarsız ve temiz olmalıdır</li>
        </ul>

        <h3>İade Edilemeyen Ürünler</h3>
        <ul>
          <li>Hijyen kuralları gereği kullanılmış ürünler</li>
          <li>Özel olarak üretilmiş veya kişiselleştirilmiş ürünler</li>
          <li>Yazılım ve lisans ürünleri</li>
        </ul>

        <h2>İade İşlemi</h2>
        <p>İade için müşteri hizmetlerimizle iletişime geçin. Ürün onaylandıktan sonra ödeme iade edilecektir.</p>

        <h2>Değişim</h2>
        <p>Aynı ürünün farklı modeli veya rengi ile değişim yapabilirsiniz.</p>
      `,
      updatedAt: '2024-01-10T09:15:00',
    },
  }

  return mockPages[slug] || null
}

export default function DynamicPage() {
  const params = useParams()
  const slug = params.slug as string
  const [pageData, setPageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true)
      const data = await fetchPageData(slug)
      setPageData(data)
      setLoading(false)
    }
    loadPage()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-white mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-ottoman-cream/70">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <motion.div
          className="card-ottoman max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="text-3xl font-serif font-bold text-white mb-4">
            404 - Sayfa Bulunamadı
          </h1>
          <p className="text-ottoman-cream/80 mb-6">
            Aradığınız sayfa bulunamadı veya kaldırılmış olabilir.
          </p>
          <Link href="/" className="btn-ottoman">
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-white hover:text-white-light mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="header-ottoman mb-4">
              {pageData.title}
            </h1>
            <p className="text-sm text-ottoman-cream/50">
              Son Güncelleme: {new Date(pageData.updatedAt).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Page Content */}
          <div className="card-ottoman">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
              style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
              }}
            />
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .prose h2 {
          color: #c9a961;
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(201, 169, 97, 0.2);
        }
        .prose h3 {
          color: #c9a961;
          font-size: 1.4rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          color: rgba(232, 220, 196, 0.9);
          margin-bottom: 1rem;
        }
        .prose ul, .prose ol {
          color: rgba(232, 220, 196, 0.9);
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose a {
          color: #c9a961;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #d4b976;
        }
        .prose strong {
          color: #e8dcc4;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
