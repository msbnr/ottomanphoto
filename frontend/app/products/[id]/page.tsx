'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Check, Minus, Plus, Package, Truck, Shield } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock data - will be replaced with API call
const product = {
  id: '1',
  name: 'Premium Lazer Yazıcı HP LaserJet Pro',
  sku: 'YAZICI-001',
  category: 'Elektronik',
  description: 'Yüksek kapasiteli, profesyonel kullanıma uygun lazer yazıcı. Ofis ve işletmeler için ideal çözüm.',
  longDescription: `HP LaserJet Pro serisi, işletmelerin ihtiyaçlarını karşılamak üzere tasarlanmış profesyonel bir yazıcıdır.

  Özellikler:
  • Yüksek baskı hızı (40 sayfa/dakika)
  • Otomatik çift taraflı baskı
  • Ağ bağlantısı (WiFi & Ethernet)
  • Mobil baskı desteği
  • 550 sayfa kağıt kapasitesi
  • Enerji tasarruflu
  • 2 yıl garantili`,
  price: 5000,
  dealerPrice: 4200,
  boxQuantity: 5,
  stock: 50,
  rating: 4.8,
  reviews: 127,
  images: [
    '/placeholder-product.jpg',
    '/placeholder-product.jpg',
    '/placeholder-product.jpg',
  ],
  specs: [
    { label: 'Marka', value: 'HP' },
    { label: 'Model', value: 'LaserJet Pro M404dn' },
    { label: 'Baskı Hızı', value: '40 sayfa/dakika' },
    { label: 'Çözünürlük', value: '1200 x 1200 dpi' },
    { label: 'Bağlantı', value: 'WiFi, Ethernet, USB' },
    { label: 'Kağıt Kapasitesi', value: '550 sayfa' },
  ]
}

export default function ProductDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-ottoman-cream/60 mb-8">
          <Link href="/" className="hover:text-ottoman-gold">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-ottoman-gold">Ürünler</Link>
          <span>/</span>
          <span className="text-ottoman-cream">{product.category}</span>
          <span>/</span>
          <span className="text-ottoman-gold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="card-ottoman p-8 mb-4">
              <div className="aspect-square bg-gradient-to-br from-ottoman-gold/10 to-ottoman-red/10 rounded-lg flex items-center justify-center">
                <div className="text-9xl">📦</div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`card-ottoman p-4 aspect-square ${
                    selectedImage === index ? 'border-2 border-ottoman-gold' : ''
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-ottoman-gold/10 to-ottoman-red/10 rounded flex items-center justify-center text-4xl">
                    📦
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-block px-3 py-1 bg-ottoman-gold/20 text-ottoman-gold text-sm rounded-full mb-4">
              {product.category}
            </div>

            <h1 className="text-4xl font-serif font-bold text-ottoman-cream mb-4">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-ottoman-gold' : 'text-ottoman-cream/30'}>
                    ★
                  </span>
                ))}
                <span className="text-ottoman-cream/70 ml-2">
                  {product.rating} ({product.reviews} değerlendirme)
                </span>
              </div>
            </div>

            <p className="text-ottoman-cream/80 text-lg mb-6">
              {product.description}
            </p>

            {/* SKU & Stock */}
            <div className="flex items-center space-x-6 mb-6 text-sm text-ottoman-cream/70">
              <div>SKU: <span className="text-ottoman-gold font-mono">{product.sku}</span></div>
              <div>Stok: <span className={product.stock > 20 ? 'text-green-500' : 'text-red-500'}>{product.stock} adet</span></div>
            </div>

            {/* Price */}
            <div className="card-ottoman mb-6">
              <div className="flex items-baseline space-x-4">
                <div className="text-4xl font-bold text-ottoman-gold">
                  {product.price.toLocaleString('tr-TR')} ₺
                </div>
                <div className="text-lg text-ottoman-cream/60 line-through">
                  {(product.price * 1.2).toLocaleString('tr-TR')} ₺
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                  %16 İndirim
                </div>
              </div>

              {/* Box Quantity Info */}
              <div className="mt-4 pt-4 border-t border-ottoman-gold/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ottoman-cream/70">
                    <Package className="w-4 h-4 inline mr-2" />
                    Koli İçi Adet: {product.boxQuantity}
                  </span>
                  <span className="text-ottoman-gold font-semibold">
                    1 Koli: {(product.price * product.boxQuantity * 0.9).toLocaleString('tr-TR')} ₺ (%10 indirim)
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-ottoman-cream font-medium">Miktar:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-ottoman-gold/30 hover:border-ottoman-gold rounded-lg flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center input-ottoman"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-ottoman-gold/30 hover:border-ottoman-gold rounded-lg flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className="btn-ottoman flex-1 py-4 flex items-center justify-center space-x-2"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Sepete Eklendi!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Sepete Ekle</span>
                  </>
                )}
              </button>
              <button className="btn-ottoman-outline p-4">
                <Heart className="w-6 h-6" />
              </button>
              <button className="btn-ottoman-outline p-4">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card-ottoman text-center p-4">
                <Truck className="w-6 h-6 text-ottoman-gold mx-auto mb-2" />
                <div className="text-sm text-ottoman-cream/80">Hızlı Kargo</div>
              </div>
              <div className="card-ottoman text-center p-4">
                <Shield className="w-6 h-6 text-ottoman-gold mx-auto mb-2" />
                <div className="text-sm text-ottoman-cream/80">2 Yıl Garanti</div>
              </div>
              <div className="card-ottoman text-center p-4">
                <Package className="w-6 h-6 text-ottoman-gold mx-auto mb-2" />
                <div className="text-sm text-ottoman-cream/80">Orjinal Ürün</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="card-ottoman mb-16">
          <div className="border-b border-ottoman-gold/20 mb-6">
            <div className="flex space-x-8">
              <button className="pb-4 border-b-2 border-ottoman-gold text-ottoman-gold">
                Açıklama
              </button>
              <button className="pb-4 text-ottoman-cream/70 hover:text-ottoman-gold">
                Teknik Özellikler
              </button>
              <button className="pb-4 text-ottoman-cream/70 hover:text-ottoman-gold">
                Değerlendirmeler ({product.reviews})
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="text-ottoman-cream/80 whitespace-pre-line">
              {product.longDescription}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
