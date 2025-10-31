'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Search, HelpCircle, ShoppingCart,
  Package, CreditCard, Truck, RefreshCw, Phone
} from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  // Genel Sorular
  {
    category: 'Genel',
    question: 'Ottoman Platform nedir?',
    answer: 'Ottoman Platform, Türkiye\'nin önde gelen ofis ürünleri ve iş ekipmanları tedarikçisidir. 500\'den fazla ürün çeşidi ile müşterilerimize ve bayilerimize hizmet veriyoruz.',
  },
  {
    category: 'Genel',
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz. Tüm ödeme yöntemleri güvenli şekilde işlenmektedir.',
  },
  {
    category: 'Genel',
    question: 'Çalışma saatleriniz nedir?',
    answer: 'Pazartesi-Cuma: 09:00-18:00, Cumartesi: 10:00-16:00. Pazar günleri kapalıyız. E-posta desteğimiz 7/24 aktiftir.',
  },

  // Sipariş ve Teslimat
  {
    category: 'Sipariş',
    question: 'Siparişimi nasıl takip edebilirim?',
    answer: 'Hesabınıza giriş yaparak "Siparişlerim" sayfasından tüm siparişlerinizi görüntüleyebilir ve durumlarını takip edebilirsiniz. Ayrıca sipariş durumu değişikliklerinde SMS ile bilgilendirilirsiniz.',
  },
  {
    category: 'Sipariş',
    question: 'Minimum sipariş tutarı var mı?',
    answer: 'Hayır, minimum sipariş tutarı bulunmamaktadır. Ancak 2.500 TL ve üzeri siparişlerde kargo ücretsizdir.',
  },
  {
    category: 'Sipariş',
    question: 'Siparişimi iptal edebilir miyim?',
    answer: 'Siparişiniz henüz kargoya verilmemişse iptal edebilirsiniz. İptal talepleriniz için müşteri hizmetleri ile iletişime geçin.',
  },
  {
    category: 'Sipariş',
    question: 'Teslimat süresi ne kadar?',
    answer: 'Standart teslimat süresi 2-5 iş günüdür. Stokta olmayan ürünler için süre değişiklik gösterebilir.',
  },
  {
    category: 'Sipariş',
    question: 'Kargo ücreti ne kadar?',
    answer: '2.500 TL altı siparişler için kargo ücreti 50 TL\'dir. 2.500 TL ve üzeri tüm siparişlerde kargo ücretsizdir.',
  },

  // İade ve Değişim
  {
    category: 'İade',
    question: 'İade politikanız nedir?',
    answer: 'Ürünü teslim aldıktan sonra 14 gün içinde herhangi bir neden belirtmeden iade edebilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.',
  },
  {
    category: 'İade',
    question: 'İade nasıl yapabilirim?',
    answer: 'Hesabınıza giriş yaparak "Siparişlerim" bölümünden iade talebinde bulunabilirsiniz. İade onaylandıktan sonra kargo şirketimiz ürünü adresinizden alacaktır.',
  },
  {
    category: 'İade',
    question: 'İade ücretini kim karşılıyor?',
    answer: 'Cayma hakkı kapsamındaki iadelerde kargo ücreti müşteriye aittir. Hasarlı veya yanlış ürün gönderiminde kargo ücreti tarafımızca karşılanır.',
  },
  {
    category: 'İade',
    question: 'İade bedelim ne zaman hesabıma geçer?',
    answer: 'İade ettiğiniz ürün depomıza ulaştıktan sonra 5-10 iş günü içinde ödeme iade edilir.',
  },

  // Bayi
  {
    category: 'Bayi',
    question: 'Nasıl bayi olabilirim?',
    answer: 'Kayıt sayfasından "Bayi Olarak Kayıt" seçeneğini kullanarak başvurabilirsiniz. Başvurunuz incelendikten sonra size geri dönüş yapılacaktır.',
  },
  {
    category: 'Bayi',
    question: 'Bayi seviyesi nedir?',
    answer: 'Bayi seviyesi sistemimiz 4 kademeden oluşur: Küçük Bayi (%5-10), Orta Bayi (%10-15), Büyük Bayi (%15-20) ve Ana Bayi (%20-25). Sipariş hacminize göre otomatik olarak seviye yükseltilir.',
  },
  {
    category: 'Bayi',
    question: 'Bayi fiyatlandırması nasıl çalışır?',
    answer: 'Bayi hesabınızla giriş yaptığınızda tüm ürünlerde bayi seviyenize özel indirimli fiyatları görürsünüz. Fiyatlar otomatik olarak uygulanır.',
  },
  {
    category: 'Bayi',
    question: 'Toplu sipariş verebilir miyim?',
    answer: 'Evet, bayiler için özel toplu sipariş imkanı sunuyoruz. Bayi panelinizden toplu sipariş verebilir ve özel kampanyalardan yararlanabilirsiniz.',
  },

  // Hesap
  {
    category: 'Hesap',
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama linki gönderebilirsiniz.',
  },
  {
    category: 'Hesap',
    question: 'Hesap bilgilerimi nasıl güncellerim?',
    answer: 'Hesabınıza giriş yaptıktan sonra "Profil" sayfasından tüm bilgilerinizi güncelleyebilirsiniz.',
  },
  {
    category: 'Hesap',
    question: 'Birden fazla teslimat adresi ekleyebilir miyim?',
    answer: 'Evet, profil sayfanızdan istediğiniz kadar teslimat adresi ekleyebilir ve varsayılan adresinizi belirleyebilirsiniz.',
  },

  // Ürünler
  {
    category: 'Ürünler',
    question: 'Ürünlerde garanti var mı?',
    answer: 'Tüm ürünlerimiz üretici garantisi ile gönderilir. Garanti süresi ürüne göre değişiklik gösterir ve ürün sayfasında belirtilir.',
  },
  {
    category: 'Ürünler',
    question: 'Stokta olmayan ürünü sipariş edebilir miyim?',
    answer: 'Evet, stokta olmayan ürünler için sipariş verebilirsiniz. Ürün tedarik edildikten sonra size bilgi verilir ve gönderilir.',
  },
  {
    category: 'Ürünler',
    question: 'Toptan satış yapıyor musunuz?',
    answer: 'Evet, kurumsal ve toptan siparişler için özel fiyatlandırma sunuyoruz. Detaylı bilgi için iletişim sayfamızdan bize ulaşabilirsiniz.',
  },
]

const categories = [
  { name: 'Tümü', icon: HelpCircle },
  { name: 'Genel', icon: HelpCircle },
  { name: 'Sipariş', icon: ShoppingCart },
  { name: 'İade', icon: RefreshCw },
  { name: 'Bayi', icon: Package },
  { name: 'Hesap', icon: CreditCard },
  { name: 'Ürünler', icon: Truck },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'Tümü' || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="header-ottoman mb-4">Sık Sorulan Sorular</h1>
          <p className="text-xl text-ottoman-cream/70 max-w-3xl mx-auto">
            Merak ettiğiniz her şey burada. Cevap bulamazsanız bize ulaşın.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ottoman-cream/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sorunuzu buraya yazın..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-ottoman-cream/50 focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  selectedCategory === category.name
                    ? 'bg-ottoman-gold text-black font-semibold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              className="card-ottoman text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HelpCircle className="w-16 h-16 text-ottoman-cream/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
              <p className="text-ottoman-cream/70">
                Aramanızla eşleşen soru bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="card-ottoman overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-start justify-between gap-4 text-left"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {faq.question}
                      </h3>
                      <span className="text-sm text-ottoman-gold">
                        {faq.category}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <ChevronDown className="w-6 h-6 text-ottoman-cream" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-white/10">
                          <p className="text-ottoman-cream/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <motion.div
          className="card-ottoman max-w-4xl mx-auto mt-12 bg-gradient-to-r from-ottoman-gold/10 to-ottoman-red/10 border-ottoman-gold/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-ottoman-gold/20 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-ottoman-gold" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Cevabınızı Bulamadınız mı?
              </h3>
              <p className="text-ottoman-cream/80">
                Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/contact" className="btn-ottoman">
                İletişime Geç
              </a>
              <a href="tel:+908501234567" className="btn-ottoman-outline">
                Bizi Ara
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
