# ⚡ RAILWAY HIZLI BAŞLANGIÇ - 15 DAKİKADA YAYINDA!

Bu rehber, Ottoman Platform'u Railway'de en hızlı şekilde nasıl yayınlayacağınızı gösterir.

---

## 📋 ÖNCE HAZIRLIK (5 dakika)

### 1. Hesaplar
- ✅ GitHub hesabı: https://github.com/signup
- ✅ Railway hesabı: https://railway.app/ (GitHub ile giriş)
- ✅ Cloudflare hesabı: https://dash.cloudflare.com/sign-up (domain için)

### 2. GitHub'a Proje Yükle

```bash
cd /home/wsl-msbnr/projeler/veyaz/ottoman-platform

# GitHub'da yeni repo oluşturun: ottoman-platform

# Terminal'de:
git remote add origin https://github.com/KULLANICI_ADINIZ/ottoman-platform.git
git add .
git commit -m "Railway deployment hazır"
git branch -M main
git push -u origin main
```

---

## 🚂 RAILWAY DEPLOYMENT (10 dakika)

### ADIM 1: MongoDB Oluştur (1 dk)

1. Railway → **New Project** → `Ottoman Platform`
2. **Add Service** → **Database** → **MongoDB**
3. MongoDB → **Variables** → `MONGO_URL` kopyala
   ```
   mongodb://mongo:ŞIFRE@monorail.proxy.rlwy.net:12345/railway
   ```

### ADIM 2: Backend Deploy (3 dk)

1. **Add Service** → **GitHub Repo** → `ottoman-platform`
2. Backend servisine tıkla
3. **Settings** → **Root Directory** → `/backend`
4. **Variables** ekle:

```bash
MONGODB_URI=mongodb://mongo:ŞIFRE@monorail.proxy.rlwy.net:12345/railway
NODE_ENV=production
PORT=5000
JWT_SECRET=ottoman_platform_super_secret_key_12345678
JWT_EXPIRE=7d
FRONTEND_URL=https://ottoman-frontend-production.up.railway.app
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

5. **Settings** → **Domains** → **Generate Domain**
6. Backend URL'yi kopyala: `https://ottoman-backend-production-XXXX.up.railway.app`

### ADIM 3: Frontend Deploy (3 dk)

1. **Add Service** → **GitHub Repo** → Aynı repo
2. Frontend servisine tıkla
3. **Settings** → **Root Directory** → `/frontend`
4. **Variables** ekle:

```bash
NEXT_PUBLIC_API_URL=https://ottoman-backend-production-XXXX.up.railway.app/api
NEXT_PUBLIC_BASE_URL=https://ottoman-backend-production-XXXX.up.railway.app
NODE_ENV=production
```

(XXXX yerine kendi backend URL'inizi yazın)

5. **Settings** → **Domains** → **Generate Domain**
6. Frontend URL'yi kopyala: `https://ottoman-frontend-production-YYYY.up.railway.app`

### ADIM 4: FRONTEND_URL Güncelle (1 dk)

1. Backend servisine geri dön
2. **Variables** → `FRONTEND_URL` güncelle:
   ```
   FRONTEND_URL=https://ottoman-frontend-production-YYYY.up.railway.app
   ```

### ADIM 5: Test Et! (2 dk)

✅ Backend: https://ottoman-backend-production-XXXX.up.railway.app/health
✅ Frontend: https://ottoman-frontend-production-YYYY.up.railway.app

**BAŞARILI!** Proje Railway'de çalışıyor!

---

## 🌐 CLOUDFLARE DOMAIN BAĞLAMA (Opsiyonel - 10 dk)

Railway URL'ler yerine kendi domain'inizi kullanmak için:

### ADIM 1: Cloudflare DNS Kayıtları

Cloudflare → Domain → **DNS** → **Records**:

**3 CNAME kaydı ekle:**

| Name | Target                                           | Proxy     |
|------|--------------------------------------------------|-----------|
| api  | ottoman-backend-production-XXXX.up.railway.app   | DNS only  |
| @    | ottoman-frontend-production-YYYY.up.railway.app  | DNS only  |
| www  | ottoman-frontend-production-YYYY.up.railway.app  | DNS only  |

**ÖNEMLİ**: Proxy status **DNS only** (gri bulut) olmalı!

### ADIM 2: Railway Custom Domain

**Backend**:
- Settings → Domains → Custom Domain → `api.yourdomain.com`

**Frontend**:
- Settings → Domains → Custom Domain → `yourdomain.com`
- Settings → Domains → Custom Domain → `www.yourdomain.com`

### ADIM 3: Environment Variables Güncelle

**Backend**:
```bash
FRONTEND_URL=https://yourdomain.com
```

**Frontend**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_BASE_URL=https://api.yourdomain.com
```

### ADIM 4: Test

✅ https://api.yourdomain.com/health
✅ https://yourdomain.com
✅ https://www.yourdomain.com

---

## 🎯 DEPLOYMENT SONRASI

### Hemen Yapılacaklar:

1. **Admin Hesabı Oluştur**:
   - https://yourdomain.com/register
   - İlk kayıt olan otomatik admin olur

2. **Banner Ekle**:
   - Admin Panel → Banners → Yeni Banner

3. **Ürün Ekle**:
   - Admin Panel → Products → Yeni Ürün

4. **Site Ayarları**:
   - Admin Panel → Settings → Site bilgilerini gir

### Otomatik Deploy

Artık GitHub'a her push otomatik deploy tetikler:

```bash
# Kod değişikliği yap
git add .
git commit -m "Yeni özellik eklendi"
git push origin main

# Railway otomatik deploy başlatacak!
```

---

## 📊 MONITORING

### Railway Dashboard

Her servis için:
- **Logs**: Real-time log izleme
- **Metrics**: CPU, RAM, Network kullanımı
- **Deployments**: Deployment geçmişi

### Maliyet Takibi

- Dashboard → Project → **Usage**
- Ücretsiz $5 kredi/ay
- Her servis ~$0.01-0.02/saat

---

## 🆘 SIK KARŞILAŞILAN SORUNLAR

### Sorun 1: Backend Başlamıyor

**Çözüm**:
- Backend → **Logs** kontrol et
- `MONGODB_URI` doğru mu?
- `npm run build` başarılı mı?

### Sorun 2: CORS Hatası

**Çözüm**:
- Backend → Variables → `FRONTEND_URL` kontrol et
- Frontend URL ile eşleşmeli

### Sorun 3: Domain Bağlanmıyor

**Çözüm**:
- Cloudflare DNS: **DNS only** (gri bulut) kullan
- 10 dakika bekle (DNS propagation)

---

## 📚 DETAYLI REHBERLER

Daha detaylı bilgi için:

- **RAILWAY_DEPLOYMENT.md**: Komple Railway rehberi (14 adım)
- **CLOUDFLARE_DNS.md**: Cloudflare DNS detayları
- **WEB/KURULUM_TALİMATI.txt**: VPS deployment (alternatif)

---

## ✅ BAŞARILI KURULUM KONTROL

- [ ] MongoDB çalışıyor
- [ ] Backend deploy edildi
- [ ] Backend health check: ✅
- [ ] Frontend deploy edildi
- [ ] Frontend açılıyor: ✅
- [ ] API çağrıları çalışıyor
- [ ] (Opsiyonel) Custom domain bağlandı
- [ ] (Opsiyonel) SSL aktif: 🔒

---

## 🎉 TEBRIKLER!

Ottoman Platform artık Railway'de canlı!

**Site Adresleri**:
- 🌐 Frontend: https://yourdomain.com (veya Railway URL)
- 🔧 Backend: https://api.yourdomain.com (veya Railway URL)
- 📊 Admin: https://yourdomain.com/admin

**İyi Çalışmalar!** 🚀

---

**Oluşturulma**: 31 Ekim 2024
**Platform**: Railway.app
**Ottoman Platform**: v1.0
