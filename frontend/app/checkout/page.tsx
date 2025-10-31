'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MapPin, Plus, CreditCard, Banknote, Truck,
  ShoppingCart, X, ChevronRight, AlertCircle
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { authAPI, orderAPI } from '@/lib/api'

interface Address {
  _id: string
  title: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault: boolean
}

type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash_on_delivery'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery')
  const [notes, setNotes] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // New address form state
  const [newAddress, setNewAddress] = useState({
    title: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Türkiye',
    postalCode: '',
    isDefault: false,
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout')
      return
    }

    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/products')
      return
    }

    fetchAddresses()
  }, [isAuthenticated, items.length])

  const fetchAddresses = async () => {
    try {
      const response = await authAPI.getAddresses()
      const addressData = response.data.data.addresses
      setAddresses(addressData)

      // Auto-select default address
      const defaultAddr = addressData.find((addr: Address) => addr.isDefault)
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id)
      } else if (addressData.length > 0) {
        setSelectedAddress(addressData[0]._id)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authAPI.addAddress(newAddress)
      await fetchAddresses()
      setShowAddressForm(false)
      setNewAddress({
        title: '',
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        country: 'Türkiye',
        postalCode: '',
        isDefault: false,
      })
    } catch (error: any) {
      setError(error.response?.data?.message || 'Adres eklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Lütfen teslimat adresi seçin')
      return
    }

    setLoading(true)
    setError('')

    try {
      const address = addresses.find(addr => addr._id === selectedAddress)
      if (!address) {
        setError('Seçili adres bulunamadı')
        return
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode,
        },
        paymentMethod,
        notes: notes || undefined,
      }

      const response = await orderAPI.create(orderData)
      const orderId = response.data.data._id

      // Kredi kartı ödemesi için PayTR'ye yönlendir
      if (paymentMethod === 'credit_card') {
        try {
          const token = localStorage.getItem('token')
          const paymentResponse = await fetch('http://localhost:5000/api/payment/paytr/create-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId,
              email: user?.email || 'customer@example.com',
            }),
          })

          const paymentData = await paymentResponse.json()

          if (paymentData.success) {
            // PayTR iframe'i aç
            window.location.href = paymentData.iframeUrl
          } else {
            setError(paymentData.message || 'Ödeme başlatılamadı')
            setLoading(false)
            return
          }
        } catch (paymentError: any) {
          setError('Ödeme sistemi hatası: ' + (paymentError.message || 'Bilinmeyen hata'))
          setLoading(false)
          return
        }
      } else {
        // Diğer ödeme yöntemleri için sepeti temizle ve başarı sayfasına yönlendir
        clearCart()
        router.push(`/order-confirmation/${orderId}`)
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Sipariş oluşturulurken hata oluştu')
    } finally {
      if (paymentMethod !== 'credit_card') {
        setLoading(false)
      }
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-serif font-bold text-white mb-2">
            Sipariş Özeti
          </h1>
          <p className="text-ottoman-cream/70">
            Siparişinizi tamamlamak için aşağıdaki bilgileri kontrol edin
          </p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Addresses */}
            <motion.div
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-ottoman-gold" />
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Teslimat Adresi
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="btn-ottoman-outline flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Yeni Adres
                </button>
              </div>

              {showAddressForm && (
                <motion.form
                  onSubmit={handleAddAddress}
                  className="bg-white/5 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Yeni Adres Ekle</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        Adres Başlığı *
                      </label>
                      <input
                        type="text"
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                        placeholder="Ev, İş, vb."
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        Şehir *
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        İlçe *
                      </label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        Posta Kodu *
                      </label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ottoman-cream/70 mb-2">
                        Adres *
                      </label>
                      <textarea
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        rows={3}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-ottoman-cream/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="w-4 h-4 rounded border-white/20 bg-white/10 text-ottoman-gold focus:ring-ottoman-gold"
                        />
                        Varsayılan adres olarak ayarla
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-ottoman"
                    >
                      {loading ? 'Ekleniyor...' : 'Adresi Ekle'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="btn-ottoman-outline"
                    >
                      İptal
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-ottoman-cream/50 text-center py-8">
                    Henüz kayıtlı adres bulunmuyor. Lütfen yeni adres ekleyin.
                  </p>
                ) : (
                  addresses.map((address) => (
                    <motion.div
                      key={address._id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedAddress === address._id
                          ? 'bg-ottoman-gold/10 border-ottoman-gold'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {address.title}
                            </h3>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs bg-ottoman-gold text-black rounded">
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <p className="text-ottoman-cream/70 mb-1">
                            {address.fullName} - {address.phone}
                          </p>
                          <p className="text-ottoman-cream/70 text-sm">
                            {address.street}, {address.state} / {address.city} {address.postalCode}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAddress === address._id
                            ? 'border-ottoman-gold bg-ottoman-gold'
                            : 'border-white/30'
                        }`}>
                          {selectedAddress === address._id && (
                            <div className="w-3 h-3 bg-black rounded-full" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-ottoman-gold" />
                <h2 className="text-2xl font-serif font-bold text-white">
                  Ödeme Yöntemi
                </h2>
              </div>

              <div className="space-y-3">
                <motion.div
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-ottoman-gold/10 border-ottoman-gold'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-ottoman-gold" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Kapıda Ödeme</h3>
                        <p className="text-sm text-ottoman-cream/70">
                          Ürün teslim alınırken nakit veya kartla ödeme
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-ottoman-gold bg-ottoman-gold'
                        : 'border-white/30'
                    }`}>
                      {paymentMethod === 'cash_on_delivery' && (
                        <div className="w-3 h-3 bg-black rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-ottoman-gold/10 border-ottoman-gold'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setPaymentMethod('bank_transfer')}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-5 h-5 text-ottoman-gold" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Havale / EFT</h3>
                        <p className="text-sm text-ottoman-cream/70">
                          Banka hesabına havale veya EFT ile ödeme
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-ottoman-gold bg-ottoman-gold'
                        : 'border-white/30'
                    }`}>
                      {paymentMethod === 'bank_transfer' && (
                        <div className="w-3 h-3 bg-black rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    paymentMethod === 'credit_card'
                      ? 'bg-ottoman-gold/10 border-ottoman-gold'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => setPaymentMethod('credit_card')}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-ottoman-gold" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">Kredi Kartı</h3>
                        <p className="text-sm text-ottoman-cream/70">
                          Kredi kartı ile online ödeme
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'credit_card'
                        ? 'border-ottoman-gold bg-ottoman-gold'
                        : 'border-white/30'
                    }`}>
                      {paymentMethod === 'credit_card' && (
                        <div className="w-3 h-3 bg-black rounded-full" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Order Notes */}
            <motion.div
              className="card-ottoman"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-4">
                Sipariş Notu
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Siparişiniz hakkında not eklemek isterseniz buraya yazabilirsiniz..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-ottoman-cream/50 focus:outline-none focus:ring-2 focus:ring-ottoman-gold"
              />
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <motion.div
              className="card-ottoman sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-ottoman-gold" />
                <h2 className="text-2xl font-serif font-bold text-white">
                  Sipariş Özeti
                </h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={`${baseUrl}${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-white/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-ottoman-cream/50">
                        {item.quantity} x ₺{item.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-ottoman-gold mt-1">
                        ₺{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-ottoman-cream/70">
                  <span>Ara Toplam</span>
                  <span>₺{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ottoman-cream/70">
                  <span>Kargo</span>
                  <span className="text-green-500">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                  <span>Toplam</span>
                  <span className="text-ottoman-gold">₺{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress}
                className="w-full btn-ottoman flex items-center justify-center gap-2"
              >
                {loading ? (
                  'İşleniyor...'
                ) : (
                  <>
                    Siparişi Tamamla
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-ottoman-cream/50 text-center mt-4">
                Siparişinizi tamamlayarak{' '}
                <a href="#" className="text-ottoman-gold hover:underline">
                  kullanım koşullarını
                </a>{' '}
                ve{' '}
                <a href="#" className="text-ottoman-gold hover:underline">
                  gizlilik politikasını
                </a>{' '}
                kabul etmiş olursunuz.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
