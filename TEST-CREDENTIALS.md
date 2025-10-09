# 🧪 TEST BİLGİLERİ - Ottoman Platform

MongoDB kurulumunu tamamladıktan sonra bu bilgilerle API'yi test edebilirsiniz.

---

## 🚀 BACKEND SUNUCU

**Sunucu Adresi:** `http://localhost:5000`
**Health Check:** `http://localhost:5000/health`

### Sunucuyu Başlatma

```bash
cd /home/wsl-msbnr/projeler/veyaz/ottoman-platform/backend
npm run dev
```

Göreceğiniz mesaj:
```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
```

---

## 🌱 TEST VERİSİ YÜKLEME

Sunucu çalıştıktan sonra:

```bash
npm run seed
```

Bu komut otomatik olarak oluşturacak:
- 3 kullanıcı (admin, müşteri, bayi)
- 5 ürün
- 3 kategori

---

## 👥 TEST KULLANICILARI

### 1. Admin Kullanıcı
```
Email:    admin@ottoman.com
Şifre:    admin123
Rol:      Admin
Yetki:    Tüm özelliklere tam erişim
```

**Yapabilecekler:**
- Ürün ekle/düzenle/sil
- Sipariş yönetimi
- Franchise başvurularını görüntüle/onayla
- Kullanıcı yönetimi

---

### 2. Müşteri (Son Kullanıcı)
```
Email:    customer@test.com
Şifre:    123456
Rol:      Customer
Fiyat:    Retail (perakende)
```

**Yapabilecekler:**
- Ürünleri görüntüle (retail fiyatlarla)
- Sepete ekle ve sipariş oluştur
- Kendi siparişlerini görüntüle
- Profil güncelle

**Görecekleri Fiyatlar:**
- Premium Lazer Yazıcı: **5000 TL**
- Dell Laptop: **25000 TL**
- Ergonomik Koltuk: **3500 TL**

---

### 3. Bayi (Orta Seviye)
```
Email:    dealer@test.com
Şifre:    123456
Rol:      Dealer
Tier:     Medium (Orta Bayi)
Fiyat:    dealer_medium
```

**Yapabilecekler:**
- Ürünleri görüntüle (bayi fiyatlarıyla)
- Toplu sipariş oluştur
- Özel bayi ürünlerini gör (A4 kağıt, toner vb.)
- Kendi siparişlerini görüntüle

**Görecekleri Fiyatlar:**
- Premium Lazer Yazıcı: **4200 TL** (%16 indirim)
- Dell Laptop: **22000 TL** (%12 indirim)
- Ergonomik Koltuk: **3000 TL** (%14 indirim)
- A4 Kağıt (5000 yaprak): **380 TL** (sadece bayiler görebilir)
- HP Toner: **650 TL** (sadece bayiler görebilir)

---

## 📡 API TEST ADRESLERİ

### Health Check
```bash
curl http://localhost:5000/health
```

Beklenen yanıt:
```json
{
  "success": true,
  "message": "Ottoman Platform API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 1. Müşteri Girişi

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "123456"
  }'
```

Yanıt:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "customer@test.com",
      "userType": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Token'ı kopyalayın!** (Diğer isteklerde kullanacaksınız)

---

### 2. Bayi Girişi

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dealer@test.com",
    "password": "123456"
  }'
```

---

### 3. Admin Girişi

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ottoman.com",
    "password": "admin123"
  }'
```

---

### 4. Ürünleri Listele (Müşteri - Retail Fiyat)

Token'ı önceki login yanıtından kopyalayın:

```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN_HERE"
```

Göreceksiniz:
- 3 ürün (yazıcı, laptop, koltuk)
- Retail fiyatlar (5000, 25000, 3500 TL)
- A4 kağıt ve toner **GÖRÜNMEYECEK** (sadece bayiler için)

---

### 5. Ürünleri Listele (Bayi - Dealer Fiyat)

```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_DEALER_TOKEN_HERE"
```

Göreceksiniz:
- 5 ürün (tümü)
- Bayi fiyatları (4200, 22000, 3000, 380, 650 TL)
- A4 kağıt ve toner **GÖRÜNECEK**

---

### 6. Tek Ürün Detay

```bash
# Önce ürün listesinden bir ID alın, sonra:
curl http://localhost:5000/api/products/PRODUCT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7. Sipariş Oluştur

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID_1",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "fullName": "Ahmet Yılmaz",
      "phone": "+905551234567",
      "street": "Test Sokak No:5",
      "city": "İstanbul",
      "state": "İstanbul",
      "country": "Türkiye",
      "postalCode": "34000"
    },
    "notes": "Hızlı teslimat lütfen"
  }'
```

---

### 8. Siparişlerimi Görüntüle

```bash
curl http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 9. Franchise Başvurusu (Public)

```bash
curl -X POST http://localhost:5000/api/franchise/apply \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Mehmet Demir",
    "location": {
      "city": "Ankara",
      "country": "Türkiye"
    },
    "concept": "concept1",
    "contact": {
      "phone": "+905559876543",
      "email": "mehmet@example.com"
    },
    "agreements": {
      "terms": true,
      "privacy": true,
      "contract": true
    }
  }'
```

---

### 10. Tüm Franchise Başvurularını Gör (Admin)

```bash
curl http://localhost:5000/api/franchise \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

---

### 11. Yeni Ürün Ekle (Admin)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Ürün",
    "sku": "TEST-001",
    "description": "Test için eklenen ürün",
    "category": "elektronik",
    "pricing": {
      "retail": 1000,
      "dealer_small": 900,
      "dealer_medium": 850,
      "dealer_large": 800,
      "dealer_main": 750
    },
    "visibility": {
      "customer": true,
      "dealer": true
    },
    "stock": 100
  }'
```

---

### 12. Profil Bilgilerimi Görüntüle

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎮 POSTMAN / THUNDER CLIENT İLE TEST

Daha kolay test için API Collection kullanın:

1. **Thunder Client** (VS Code) veya **Postman** açın
2. **Import** edin: `/home/wsl-msbnr/projeler/veyaz/ottoman-platform/backend/api-collection.json`
3. **24 hazır API isteği** göreceksiniz
4. Login yapın, token'ı alın
5. Collection variables'a token'ı ekleyin
6. Tüm endpoint'leri tek tıkla test edin!

---

## 🔄 FİYAT KARŞILAŞTIRMASI

Aynı ürünler, farklı kullanıcı tipleriyle:

### Premium Lazer Yazıcı

| Kullanıcı Tipi | Fiyat | İndirim |
|----------------|-------|---------|
| Müşteri (Customer) | 5000 TL | - |
| Küçük Bayi | 4500 TL | %10 |
| **Orta Bayi** (dealer@test.com) | **4200 TL** | **%16** |
| Büyük Bayi | 4000 TL | %20 |
| Ana Bayi | 3800 TL | %24 |

### Dell Latitude Laptop

| Kullanıcı Tipi | Fiyat | İndirim |
|----------------|-------|---------|
| Müşteri (Customer) | 25000 TL | - |
| Küçük Bayi | 23000 TL | %8 |
| **Orta Bayi** (dealer@test.com) | **22000 TL** | **%12** |
| Büyük Bayi | 21000 TL | %16 |
| Ana Bayi | 20000 TL | %20 |

---

## 🛒 ÜRÜN LİSTESİ (Seed Sonrası)

### Tüm Kullanıcılar Görebilir:

1. **Premium Lazer Yazıcı**
   - SKU: YAZICI-001
   - Kategori: Elektronik
   - Stok: 50

2. **Dell Latitude 5420 Laptop**
   - SKU: LAPTOP-001
   - Kategori: Elektronik
   - Stok: 15

3. **Ergonomik Ofis Koltuğu**
   - SKU: KOLTUK-001
   - Kategori: Mobilya
   - Stok: 30

### Sadece Bayiler Görebilir:

4. **A4 Fotokopi Kağıdı (5000 Yaprak)**
   - SKU: KAGIT-001
   - Kategori: Ofis Malzemeleri
   - Stok: 200

5. **HP Toner Kartuş 85A**
   - SKU: TONER-001
   - Kategori: Ofis Malzemeleri
   - Stok: 100

---

## ✅ TEST SENARYOSU

### Senaryo 1: Müşteri Akışı

1. ✅ Login yap → `customer@test.com` / `123456`
2. ✅ Token'ı al
3. ✅ Ürünleri listele → 3 ürün göreceksiniz (kağıt ve toner yok)
4. ✅ Bir ürün seç ve detayını gör
5. ✅ Sipariş oluştur
6. ✅ Siparişlerimi görüntüle

### Senaryo 2: Bayi Akışı

1. ✅ Login yap → `dealer@test.com` / `123456`
2. ✅ Token'ı al
3. ✅ Ürünleri listele → 5 ürün göreceksiniz (tümü)
4. ✅ Bayi fiyatlarını gör (daha ucuz)
5. ✅ Toplu sipariş oluştur
6. ✅ Siparişlerimi görüntüle

### Senaryo 3: Admin Akışı

1. ✅ Login yap → `admin@ottoman.com` / `admin123`
2. ✅ Token'ı al
3. ✅ Yeni ürün ekle
4. ✅ Tüm siparişleri görüntüle
5. ✅ Sipariş durumu güncelle
6. ✅ Franchise başvurularını gör

### Senaryo 4: Franchise Başvurusu

1. ✅ Franchise başvurusu yap (token gerekmez)
2. ✅ Admin ile login yap
3. ✅ Başvuruları görüntüle
4. ✅ Başvuruyu onayla/reddet

---

## 🔐 GÜVENLİK NOTLARI

- **JWT Token'lar 7 gün geçerli**
- **Token'ı her istekte `Authorization: Bearer TOKEN` ile gönder**
- **Rate limit: 100 istek / 15 dakika**
- **Şifreler bcrypt ile hash'leniyor**

---

## 📊 BAŞARILI YANIT ÖRNEKLERİ

### Login Başarılı:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJ..."
  }
}
```

### Ürün Listesi:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

### Sipariş Oluşturuldu:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "totalAmount": 10000,
    "status": "pending",
    ...
  }
}
```

---

## ❌ HATA YANIT ÖRNEKLERİ

### Yanlış şifre:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Token yok:
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Yetkisiz erişim:
```json
{
  "success": false,
  "message": "User role 'customer' is not authorized to access this resource"
}
```

---

## 🎯 ÖNEMLİ NOKTALAR

1. **Önce `npm run seed` çalıştırın** - Test kullanıcıları ve ürünleri oluşturur
2. **Her login'de yeni token alın** - 7 gün geçerli
3. **Token'ı saklayın** - Tüm korumalı endpoint'lerde gerekli
4. **Müşteri ve bayi fiyat farklarını test edin** - Aynı ürün, farklı fiyatlar
5. **Ürün görünürlüğünü test edin** - Bayiler daha fazla ürün görür

---

## 📞 DESTEK

Sorun yaşarsanız:

```bash
# Sunucu loglarını kontrol edin
# Terminalde npm run dev çıktısına bakın

# MongoDB bağlantısını kontrol edin
mongosh -u root -p '_Aa102030!' --authenticationDatabase admin

# API health check
curl http://localhost:5000/health
```

---

## 🎉 BAŞARILAR!

Bu bilgilerle API'nizin tüm özelliklerini test edebilirsiniz!

**MongoDB kurulumu → Seed data → Test başlasın! 🚀**
