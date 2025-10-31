'use client'

import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()

  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice > 2500 ? 0 : 50
  const finalTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          className="card-ottoman max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 sm:mb-4">
            Sepetiniz Boş
          </h2>
          <p className="text-sm sm:text-base text-ottoman-cream/80 mb-6">
            Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimize göz atın.
          </p>
          <Link href="/products" className="btn-ottoman inline-block px-6 py-3 text-sm sm:text-base">
            Ürünlere Göz At
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-6 sm:mb-8">Sepetim</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="card-ottoman"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Ürün Görseli ve Bilgileri */}
                    <div className="flex items-start sm:items-center space-x-4 flex-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/10 to-ottoman-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-3xl sm:text-4xl">📦</div>
                      </div>

                      {/* Ürün Bilgileri */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-ottoman-cream mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-ottoman-cream/60 mb-2">
                          SKU: {item.sku}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="text-base sm:text-lg text-white font-semibold">
                            {item.price.toLocaleString('tr-TR')} ₺
                          </span>
                          {item.boxQuantity && item.boxQuantity > 1 && (
                            <span className="text-xs text-ottoman-cream/50">
                              Koli içi: {item.boxQuantity} adet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Miktar Kontrolü ve İşlemler */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Miktar Kontrolü */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 sm:w-12 text-center font-semibold text-ottoman-cream text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-white/30 hover:border-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Ara Toplam */}
                      <div className="text-right min-w-[80px] sm:min-w-[100px]">
                        <div className="text-base sm:text-lg font-bold text-white">
                          {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                        </div>
                      </div>

                      {/* Sil Butonu */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 flex-shrink-0"
                        title="Sepetten Çıkar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Sepeti Temizle */}
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-400 text-xs sm:text-sm flex items-center space-x-2 mt-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sepeti Temizle</span>
              </button>
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <motion.div
                className="card-ottoman lg:sticky lg:top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-4 sm:mb-6">
                  Sipariş Özeti
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-ottoman-cream/80">
                    <span>Ara Toplam:</span>
                    <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-ottoman-cream/80">
                    <span>Kargo:</span>
                    <span className={shippingCost === 0 ? 'text-green-500' : ''}>
                      {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost} ₺`}
                    </span>
                  </div>
                  {totalPrice < 2500 && (
                    <p className="text-xs text-ottoman-cream/50">
                      2.500₺ ve üzeri alışverişlerde kargo ücretsiz!
                    </p>
                  )}
                  <div className="border-t border-white/20 pt-3 sm:pt-4">
                    <div className="flex justify-between text-lg sm:text-xl font-bold">
                      <span className="text-ottoman-cream">Toplam:</span>
                      <span className="text-white">
                        {finalTotal.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-ottoman w-full py-3 mb-3 sm:py-4 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/products"
                  className="btn-ottoman-outline w-full py-3 sm:py-4 flex justify-center items-center text-center mt-6 text-sm sm:text-base"
                >
                  Alışverişe Devam Et
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
