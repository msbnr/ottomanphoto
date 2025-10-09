# Ottoman Platform - Frontend

Next.js 14 tabanlı, Osmanlı temalı modern e-ticaret frontend uygulaması.

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Ana Renk (Siyah)**: #0A0A0A, #1A1A1A, #2A2A2A
- **Vurgu Rengi (Altın)**: #D4AF37, #FFD700, #B8960F
- **İkincil Renk (Koyu Kırmızı)**: #8B0000, #A52A2A, #660000
- **Arka Plan (Krem)**: #F5F5DC, #E5E5CC

### Özellikler
- ✅ Osmanlı motifli background patterns
- ✅ Altın tonlarında shimmer efektleri
- ✅ Smooth animasyonlar (Framer Motion)
- ✅ Responsive tasarım (mobile-first)
- ✅ Dark theme (siyah tonlar)
- ✅ Lüks ve premium görünüm

## 🚀 Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Dil**: TypeScript
- **Styling**: Tailwind CSS
- **Animasyon**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Yönetimi**: React Hook Form + Zod
- **İkonlar**: Lucide React

## 📁 Proje Yapısı

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Ana sayfa
│   ├── globals.css          # Global stiller
│   ├── products/            # Ürünler sayfası
│   ├── login/               # Giriş sayfası
│   └── register/            # Kayıt sayfası
├── components/              # React bileşenleri
│   ├── Header.tsx           # Üst menü
│   ├── Footer.tsx           # Alt menü
│   ├── HeroSection.tsx      # Ana hero bölümü
│   ├── FeaturedProducts.tsx # Öne çıkan ürünler
│   ├── BusinessModel.tsx    # İş modeli açıklaması
│   └── FranchiseSection.tsx # Franchise başvuru
├── lib/                     # Utility fonksiyonlar
├── store/                   # Zustand store'lar
├── public/                  # Statik dosyalar
└── tailwind.config.ts       # Tailwind yapılandırması
```

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd /home/wsl-msbnr/projeler/veyaz/ottoman-platform/frontend
npm install
```

### 2. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışacaktır.

## 📄 Sayfalar

### Ana Sayfa (/)
- Hero section (hoş geldiniz)
- Öne çıkan ürünler
- İş modeli açıklaması (5 seviye)
- Franchise başvuru bölümü

### Ürünler (/products)
- Tüm ürünleri listeleme
- Kategori filtresi
- Fiyat aralığı filtresi
- Arama özelliği
- Sepete ekleme

### Giriş (/login)
- E-posta ve şifre ile giriş
- "Beni hatırla" özelliği
- Test hesapları gösterimi

### Kayıt (/register)
- Müşteri veya bayi seçimi
- Kullanıcı bilgileri formu
- Bayi için ek alanlar (firma, vergi no)
- Şartlar ve koşullar onayı

## 🎨 Tailwind CSS Sınıfları

### Butonlar
- `btn-ottoman`: Altın renkli ana buton
- `btn-ottoman-secondary`: Koyu kırmızı ikincil buton
- `btn-ottoman-outline`: Çerçeveli buton

### Kartlar
- `card-ottoman`: Osmanlı temalı kart
- `header-ottoman`: Başlık stili (altın gradient)

### İnputlar
- `input-ottoman`: Form input alanları

### Diğer
- `ottoman-pattern-bg`: Arka plan pattern'i
- `badge-premium`: Premium rozeti
- `price-ottoman`: Fiyat gösterimi
- `nav-link`: Navigasyon linki
- `divider-ottoman`: Altın çizgi ayırıcı

## 🔄 Backend Bağlantısı

Frontend, backend API'ye `.env.local` dosyasındaki URL üzerinden bağlanır:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API Endpoint'leri
- `GET /api/products` - Ürün listesi
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register/customer` - Müşteri kaydı
- `POST /api/auth/register/dealer` - Bayi kaydı
- `POST /api/orders` - Sipariş oluşturma
- `POST /api/franchise/apply` - Franchise başvuru

## 🎯 Yapılacaklar

### Öncelikli
- [ ] API entegrasyonu (Axios + Zustand)
- [ ] Authentication state yönetimi
- [ ] Ürün detay sayfası
- [ ] Sepet sistemi
- [ ] Checkout akışı
- [ ] Kullanıcı profil sayfası

### İkincil
- [ ] Admin dashboard
- [ ] Franchise başvuru formu
- [ ] Sipariş takip sayfası
- [ ] Hakkımızda sayfası
- [ ] İletişim formu
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications

## 🧪 Test Kullanıcıları

Backend'de tanımlı test kullanıcıları:

### Admin
- Email: `admin@ottoman.com`
- Şifre: `admin123`

### Müşteri
- Email: `customer@test.com`
- Şifre: `123456`

### Bayi (Orta)
- Email: `dealer@test.com`
- Şifre: `123456`

## 📱 Responsive Breakpoints

Tailwind CSS breakpoint'leri:

- **sm**: 640px (mobil-landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (küçük desktop)
- **xl**: 1280px (büyük desktop)

## 🎨 Animasyonlar

Framer Motion ile hazır animasyonlar:

```tsx
// Fade in from bottom
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Fade in from left
initial={{ opacity: 0, x: -50 }}
animate={{ opacity: 1, x: 0 }}

// Scale on hover
whileHover={{ scale: 1.05 }}

// Float animation
className="animate-float"
```

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production başlat
npm start

# Lint kontrol
npm run lint
```

## 📞 Destek

Sorun yaşarsanız:
1. Backend sunucusunun çalıştığından emin olun (http://localhost:5000)
2. MongoDB'nin aktif olduğunu kontrol edin
3. `.env.local` dosyasını kontrol edin
4. `npm install` komutunu tekrar çalıştırın

---

**İyi çalışmalar! 🎉**
