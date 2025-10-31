'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Save, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { settingsAPI } from '@/lib/api';

interface PayTRSettings {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
  isActive: boolean;
}

export default function PaymentSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    merchantKey: false,
    merchantSalt: false,
  });

  const [paytrSettings, setPaytrSettings] = useState<PayTRSettings>({
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
    testMode: true,
    isActive: false,
  });

  // Wait for zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/payment-settings');
      return;
    }

    if (user?.userType !== 'admin') {
      router.push('/');
      return;
    }

    fetchSettings();
  }, [isHydrated, isAuthenticated, user, router]);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data.success && response.data.data.paytr) {
        setPaytrSettings(response.data.data.paytr);
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await settingsAPI.update({ paytr: paytrSettings });

      if (response.data.success) {
        alert('PayTR ayarları başarıyla kaydedildi!');
      } else {
        throw new Error(response.data.message || 'Kaydetme hatası');
      }
    } catch (error: any) {
      alert('Hata: ' + (error.response?.data?.message || error.message || 'Ayarlar kaydedilemedi'));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PayTRSettings, value: string | boolean) => {
    setPaytrSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSecretVisibility = (field: 'merchantKey' | 'merchantSalt') => {
    setShowSecrets((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen py-8 flex justify-center items-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
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
            <CreditCard className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-serif font-bold text-white">
              Ödeme Yöntemi Ayarları
            </h1>
          </div>
          <p className="text-ottoman-cream/70">
            PayTR ödeme sistemi ayarlarını yönetin
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            className="card-ottoman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-semibold text-white">PayTR Ayarları</h2>
              </div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <span className="text-ottoman-cream">Aktif</span>
                <input
                  type="checkbox"
                  checked={paytrSettings.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-white/30"
                />
              </label>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-semibold mb-1">Önemli Güvenlik Uyarısı</p>
                  <p>
                    Merchant Key ve Merchant Salt bilgilerinizi kimseyle paylaşmayın.
                    Bu bilgiler üçüncü şahısların elinede geçerse hesabınızda yetkisiz işlemler yapılabilir.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Merchant ID (Mağaza Kodu)
                </label>
                <input
                  type="text"
                  value={paytrSettings.merchantId}
                  onChange={(e) => handleChange('merchantId', e.target.value)}
                  className="input-ottoman"
                  placeholder="123456"
                  required
                />
                <p className="text-xs text-ottoman-cream/60 mt-1">
                  PayTR hesabınızdan alacağınız mağaza kodu
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Merchant Key
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.merchantKey ? 'text' : 'password'}
                    value={paytrSettings.merchantKey}
                    onChange={(e) => handleChange('merchantKey', e.target.value)}
                    className="input-ottoman pr-12"
                    placeholder="••••••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('merchantKey')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ottoman-cream/50 hover:text-ottoman-cream transition-colors"
                  >
                    {showSecrets.merchantKey ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-ottoman-cream/60 mt-1">
                  PayTR hesabınızdan alacağınız gizli anahtar
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ottoman-cream mb-2">
                  Merchant Salt
                </label>
                <div className="relative">
                  <input
                    type={showSecrets.merchantSalt ? 'text' : 'password'}
                    value={paytrSettings.merchantSalt}
                    onChange={(e) => handleChange('merchantSalt', e.target.value)}
                    className="input-ottoman pr-12"
                    placeholder="••••••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('merchantSalt')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ottoman-cream/50 hover:text-ottoman-cream transition-colors"
                  >
                    {showSecrets.merchantSalt ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-ottoman-cream/60 mt-1">
                  PayTR hesabınızdan alacağınız salt değeri
                </p>
              </div>

              <div className="bg-ottoman-black-lighter p-4 rounded-lg">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-ottoman-cream block font-medium">Test Modu</span>
                    <span className="text-sm text-ottoman-cream/60">
                      Aktif edildiğinde gerçek ödeme alınmaz, test işlemleri yapılır
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={paytrSettings.testMode}
                    onChange={(e) => handleChange('testMode', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30"
                  />
                </label>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-300 mb-2">
                  PayTR Hesabınız Yoksa
                </h3>
                <p className="text-sm text-blue-200 mb-3">
                  PayTR ile ödeme almak için öncelikle bir hesap oluşturmanız gerekiyor.
                </p>
                <a
                  href="https://www.paytr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
                >
                  PayTR ye Git →
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="submit"
              disabled={saving}
              className="btn-ottoman w-full flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Ayarları Kaydet
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
