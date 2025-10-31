'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Share2, Check, Minus, Plus, Package, Truck, Shield } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { productAPI } from '@/lib/api'
import Loading from '@/components/Loading'

interface Product {
  _id: string
  name: string
  sku: string
  category: string
  description?: string
  longDescription?: string
  price: number
  dealerPrice?: number
  boxQuantity?: number
  stock: number
  rating?: number
  reviews?: number
  images?: string[]
  specifications?: Array<{ label: string; value: string }>
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const addToCart = useCartStore((state) => state.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getById(params.id as string)
      setProduct(response.data.data)
    } catch (error: any) {
      console.error('Error fetching product:', error)
      setError('Ürün yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    // Sepete ürünü ekle
    addToCart(
      {
        id: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        boxQuantity: product.boxQuantity,
        image: product.images?.[0],
      },
      quantity
    )

    // Başarı animasyonunu göster
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)

    // Miktarı sıfırla
    setQuantity(1)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: API call to add/remove from wishlist
  }

  const handleShare = async () => {
    if (!product) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link panoya kopyalandı!')
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            {error || 'Ürün bulunamadı'}
          </h2>
          <Link href="/products" className="btn-ottoman mt-4 inline-block">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-ottoman-cream/60 mb-8">
          <Link href="/" className="hover:text-white">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white">Ürünler</Link>
          <span>/</span>
          <span className="text-ottoman-cream">{product.category}</span>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="card-ottoman p-8 mb-4">
              <div className="aspect-square bg-gradient-to-br from-white/10 to-ottoman-red/10 rounded-lg flex items-center justify-center">
                <div className="text-9xl">📦</div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`card-ottoman p-4 aspect-square ${
                      selectedImage === index ? 'border-2 border-white' : ''
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-ottoman-red/10 rounded flex items-center justify-center text-4xl">
                      📦
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-block px-3 py-1 bg-white/20 text-white text-sm rounded-full mb-4">
              {product.category}
            </div>

            <h1 className="text-4xl font-serif font-bold text-ottoman-cream mb-4">
              {product.name}
            </h1>

            {(product.rating || product.reviews) && (
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {product.rating && [...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating!) ? 'text-white' : 'text-ottoman-cream/30'}>
                      ★
                    </span>
                  ))}
                  <span className="text-ottoman-cream/70 ml-2">
                    {product.rating && `${product.rating} `}
                    {product.reviews && `(${product.reviews} değerlendirme)`}
                  </span>
                </div>
              </div>
            )}

            {product.description && (
              <p className="text-ottoman-cream/80 text-lg mb-6">
                {product.description}
              </p>
            )}

            {/* SKU & Stock */}
            <div className="flex items-center space-x-6 mb-6 text-sm text-ottoman-cream/70">
              <div>SKU: <span className="text-white font-mono">{product.sku}</span></div>
              <div>Stok: <span className={product.stock > 20 ? 'text-green-500' : 'text-red-500'}>{product.stock} adet</span></div>
            </div>

            {/* Price */}
            <div className="card-ottoman mb-6">
              <div className="flex items-baseline space-x-4">
                <div className="text-4xl font-bold text-white">
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
              {product.boxQuantity && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ottoman-cream/70">
                      <Package className="w-4 h-4 inline mr-2" />
                      Koli İçi Adet: {product.boxQuantity}
                    </span>
                    <span className="text-white font-semibold">
                      1 Koli: {(product.price * product.boxQuantity * 0.9).toLocaleString('tr-TR')} ₺ (%10 indirim)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-ottoman-cream font-medium">Miktar:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-center"
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
                  className="w-10 h-10 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-center"
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
              <button
                onClick={handleWishlist}
                className={`btn-ottoman-outline p-4 ${isWishlisted ? 'bg-white/20' : ''}`}
                title={isWishlisted ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-white text-white' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="btn-ottoman-outline p-4"
                title="Paylaş"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card-ottoman text-center p-4">
                <Truck className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-sm text-ottoman-cream/80">Hızlı Kargo</div>
              </div>
              <div className="card-ottoman text-center p-4">
                <Shield className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-sm text-ottoman-cream/80">2 Yıl Garanti</div>
              </div>
              <div className="card-ottoman text-center p-4">
                <Package className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-sm text-ottoman-cream/80">Orjinal Ürün</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="card-ottoman mb-16">
          <div className="border-b border-white/20 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === 'description'
                    ? 'border-white text-white'
                    : 'border-transparent text-ottoman-cream/70 hover:text-white'
                }`}
              >
                Açıklama
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-white text-white'
                    : 'border-transparent text-ottoman-cream/70 hover:text-white'
                }`}
              >
                Teknik Özellikler
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-white text-white'
                    : 'border-transparent text-ottoman-cream/70 hover:text-white'
                }`}
              >
                Değerlendirmeler {product.reviews ? `(${product.reviews})` : ''}
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            {activeTab === 'description' && (
              <div className="text-ottoman-cream/80 whitespace-pre-line">
                {product.longDescription || product.description || 'Ürün açıklaması bulunmamaktadır.'}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-ottoman-cream/70">{spec.label}:</span>
                      <span className="text-white font-semibold">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 col-span-2">
                    <p className="text-ottoman-cream/70">Teknik özellik bilgisi bulunmamaktadır.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-2xl font-semibold text-ottoman-cream mb-2">
                  Henüz değerlendirme yok
                </h3>
                <p className="text-ottoman-cream/70">
                  Bu ürün için ilk değerlendirmeyi siz yapın!
                </p>
                <button className="btn-ottoman mt-6">
                  Değerlendirme Yaz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
