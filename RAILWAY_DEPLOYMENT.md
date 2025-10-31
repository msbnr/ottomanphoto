# 🚀 OTTOMAN PLATFORM - RAILWAY.APP DEPLOYMENT REHBERİ

Bu rehber, Ottoman Platform projesini Railway.app'te ücretsiz olarak nasıl yayınlayacağınızı adım adım anlatır.

## 📋 GEREKSINIMLER

- GitHub hesabı
- Railway.app hesabı (GitHub ile giriş yapabilirsiniz)
- Cloudflare hesabı (DNS yönetimi için)
- Domain adı (örn: ottomanplatform.com)

---

## 🎯 ADIM 1: PROJE YAPISINI ANLAMA

Railway'de **3 ayrı servis** çalıştıracağız:

```
1. MongoDB Database  → Veritabanı
2. Backend Service   → API (Express.js)
3. Frontend Service  → Web sitesi (Next.js)
```

---

## 📦 ADIM 2: GITHUB'A PROJE YÜKLEME

### 2.1. GitHub'da Yeni Repo Oluşturun

1. https://github.com/new adresine gidin
2. Repository adı: `ottoman-platform` (veya istediğiniz bir isim)
3. **Private** seçin (önerilir)
4. `.gitignore` ve `README` eklemeyin (zaten var)
5. **Create repository** tıklayın

### 2.2. Projeyi GitHub'a Push Edin

Terminal/CMD'de proje dizininde:

```bash
cd /home/wsl-msbnr/projeler/veyaz/ottoman-platform

# Git remote ekle (GITHUB_USERNAME ve REPO_NAME'i değiştirin)
git remote add origin https://github.com/GITHUB_USERNAME/ottoman-platform.git

# Değişiklikleri commit edin (eğer uncommitted değişiklik varsa)
git add .
git commit -m "Railway deployment için hazırlandı"

# GitHub'a push edin
git branch -M main
git push -u origin main
```

**Not**: GitHub şifre yerine Personal Access Token kullanmanız gerekebilir:
- GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

## 🚂 ADIM 3: RAILWAY HESABI OLUŞTURMA

1. https://railway.app/ adresine gidin
2. **Login with GitHub** tıklayın
3. Railway'in GitHub'a erişim izni verin
4. E-posta doğrulama yapın

**Ücretsiz Plan**:
- $5 kredi (500 saat/ay)
- 3 proje
- 8GB RAM toplam
- 100GB bandwidth

---

## 🗄️ ADIM 4: MONGODB OLUŞTURMA

### 4.1. Railway Dashboard'da

1. **New Project** tıklayın
2. Proje adı: `Ottoman Platform`
3. **Add Service** → **Database** → **MongoDB**
4. MongoDB servisi otomatik oluşturulacak

### 4.2. MongoDB Bağlantı Bilgilerini Alma

1. MongoDB servisine tıklayın
2. **Variables** sekmesine gidin
3. `MONGO_URL` değişkenini kopyalayın (örnek):
   ```
   mongodb://mongo:ŞIFRE@monorail.proxy.rlwy.net:12345/railway
   ```

**ÖNEMLİ**: Bu URL'yi not edin, backend'de kullanacaksınız!

---

## 🔧 ADIM 5: BACKEND SERVİSİ OLUŞTURMA

### 5.1. Backend Servisi Ekle

1. Aynı projede **Add Service** tıklayın
2. **GitHub Repo** seçin
3. `ottoman-platform` reposunu seçin
4. **Add Service** tıklayın

### 5.2. Root Directory Ayarlama

1. Backend servisine tıklayın
2. **Settings** sekmesine gidin
3. **Root Directory** bölümünü bulun
4. `/backend` yazın ve kaydedin

### 5.3. Environment Variables Ayarlama

1. **Variables** sekmesine gidin
2. Aşağıdaki değişkenleri ekleyin:

```bash
# Database
MONGODB_URI=mongodb://mongo:ŞIFRE@monorail.proxy.rlwy.net:12345/railway

# Server
NODE_ENV=production
PORT=5000

# JWT (GÜVENLİ BİR KEY OLUŞTURUN!)
JWT_SECRET=ottoman_platform_super_secret_2024_railway_production_key_12345
JWT_EXPIRE=7d

# Frontend URL (Önce Railway URL, sonra custom domain)
FRONTEND_URL=https://ottoman-frontend-production-XXXX.up.railway.app

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email (Opsiyonel - şimdilik boş bırakabilirsiniz)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
```

**ÖNEMLİ**:
- `MONGODB_URI`: Adım 4.2'den aldığınız URL
- `JWT_SECRET`: Güçlü, benzersiz bir key oluşturun (en az 32 karakter)
- `FRONTEND_URL`: Önce Railway'in vereceği URL'yi kullanın, sonra domain'e çevirirsiniz

### 5.4. Backend Deploy

1. **Deploy** sekmesine gidin
2. Otomatik deploy başlayacak
3. Log'ları izleyin: `npm ci && npm run build` çalışacak
4. Build başarılı olunca servis çalışmaya başlar
5. **Deployments** → En son deployment → **View Logs** ile kontrol edin

### 5.5. Backend URL'yi Alma

1. **Settings** sekmesine gidin
2. **Domains** bölümünü bulun
3. **Generate Domain** tıklayın
4. Railway otomatik bir URL verecek:
   ```
   https://ottoman-backend-production-XXXX.up.railway.app
   ```
5. Bu URL'yi not edin!

### 5.6. Health Check Testi

Tarayıcıda veya curl ile test edin:
```bash
curl https://ottoman-backend-production-XXXX.up.railway.app/health
```

Beklenen çıktı:
```json
{"success":true,"message":"Ottoman Platform API is running","timestamp":"..."}
```

---

## 🎨 ADIM 6: FRONTEND SERVİSİ OLUŞTURMA

### 6.1. Frontend Servisi Ekle

1. Aynı projede tekrar **Add Service** tıklayın
2. **GitHub Repo** seçin
3. Aynı `ottoman-platform` reposunu seçin
4. **Add Service** tıklayın

### 6.2. Root Directory Ayarlama

1. Frontend servisine tıklayın
2. **Settings** → **Root Directory** → `/frontend` yazın

### 6.3. Environment Variables Ayarlama

1. **Variables** sekmesine gidin
2. Aşağıdaki değişkenleri ekleyin:

```bash
# API URL (Adım 5.5'ten aldığınız backend URL)
NEXT_PUBLIC_API_URL=https://ottoman-backend-production-XXXX.up.railway.app/api
NEXT_PUBLIC_BASE_URL=https://ottoman-backend-production-XXXX.up.railway.app

# Next.js Production Settings
NODE_ENV=production
```

### 6.4. Frontend Deploy

1. Otomatik deploy başlayacak
2. Log'ları izleyin: Next.js build süreci ~2-3 dakika sürer
3. Build başarılı olunca servis çalışmaya başlar

### 6.5. Frontend URL'yi Alma

1. **Settings** → **Domains** → **Generate Domain**
2. Railway otomatik URL:
   ```
   https://ottoman-frontend-production-XXXX.up.railway.app
   ```

### 6.6. Web Sitesi Testi

Tarayıcıda frontend URL'yi açın:
```
https://ottoman-frontend-production-XXXX.up.railway.app
```

✅ Ana sayfa, banner carousel ve ürünler görünüyor olmalı!

---

## 🔄 ADIM 7: FRONTEND_URL GÜNCELLEMESİ

Backend'in CORS ayarları için frontend URL'yi güncellemelisiniz:

1. **Backend servisine** gidin
2. **Variables** sekmesinde
3. `FRONTEND_URL` değişkenini bulun
4. Değeri frontend Railway URL'si ile değiştirin:
   ```
   FRONTEND_URL=https://ottoman-frontend-production-XXXX.up.railway.app
   ```
5. **Save** tıklayın (Backend otomatik restart olacak)

---

## 🌐 ADIM 8: CLOUDFLARE DNS AYARLARI

Şimdi kendi domain'inizi bağlayacağız!

### 8.1. Cloudflare'de DNS Kayıtları

1. Cloudflare Dashboard'a gidin
2. Domain'inizi seçin
3. **DNS** → **Records** sekmesine gidin

### 8.2. Backend için DNS Kaydı (API subdomain)

**CNAME kaydı ekleyin:**

| Type  | Name | Content                                                      | Proxy Status |
|-------|------|--------------------------------------------------------------|--------------|
| CNAME | api  | ottoman-backend-production-XXXX.up.railway.app              | DNS only (gri bulut) |

**Örnek**:
- Name: `api`
- Content: `ottoman-backend-production-XXXX.up.railway.app`
- Proxy: **DNS only** (gri bulut simgesi)

### 8.3. Frontend için DNS Kaydı (Ana domain)

**CNAME kayıtları ekleyin:**

| Type  | Name | Content                                                       | Proxy Status |
|-------|------|---------------------------------------------------------------|--------------|
| CNAME | @    | ottoman-frontend-production-XXXX.up.railway.app              | DNS only |
| CNAME | www  | ottoman-frontend-production-XXXX.up.railway.app              | DNS only |

**Örnek**:
- Name: `@` (root domain)
- Content: `ottoman-frontend-production-XXXX.up.railway.app`
- Proxy: **DNS only**

**Not**: Railway ile Cloudflare Proxy (turuncu bulut) çalışmaz, **DNS only** (gri bulut) kullanın!

---

## 🔗 ADIM 9: RAILWAY'DE CUSTOM DOMAIN EKLEME

### 9.1. Backend için Custom Domain

1. **Backend servisine** gidin
2. **Settings** → **Domains** bölümü
3. **Custom Domain** tıklayın
4. Domain girin: `api.yourdomain.com` (yourdomain.com yerine kendi domain'iniz)
5. **Add Domain** tıklayın

Railway, domain'i doğrulayacak (DNS propagation 5-10 dakika sürebilir)

### 9.2. Frontend için Custom Domain

1. **Frontend servisine** gidin
2. **Settings** → **Domains**
3. **Custom Domain** tıklayın
4. İki domain ekleyin:
   - `yourdomain.com`
   - `www.yourdomain.com`

---

## 🔄 ADIM 10: ENVIRONMENT VARIABLES GÜNCELLEMESİ

Custom domain'ler eklendikten sonra environment variables'ı güncelleyin:

### Backend Service

```bash
# FRONTEND_URL'yi custom domain ile değiştir
FRONTEND_URL=https://yourdomain.com
```

### Frontend Service

```bash
# API URL'lerini custom domain ile değiştir
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_BASE_URL=https://api.yourdomain.com
```

Kaydedin ve servisler otomatik restart olacak.

---

## 🔒 ADIM 11: SSL SERTİFİKASI

Railway otomatik olarak **Let's Encrypt SSL sertifikası** sağlar.

✅ Hem Railway URL'ler hem custom domain'ler otomatik HTTPS ile gelir!

Doğrulama:
```
https://yourdomain.com → ✅
https://www.yourdomain.com → ✅
https://api.yourdomain.com → ✅
```

---

## 🎉 ADIM 12: TEST VE DOĞRULAMA

### 12.1. Backend API Testi

```bash
curl https://api.yourdomain.com/health
```

Beklenen:
```json
{"success":true,"message":"Ottoman Platform API is running"}
```

### 12.2. Frontend Testi

Tarayıcıda açın:
```
https://yourdomain.com
```

Test edilecekler:
- ✅ Ana sayfa yükleniyor
- ✅ Banner carousel çalışıyor
- ✅ Ürünler listeleniyor
- ✅ Login/Register sayfaları açılıyor
- ✅ Admin paneline giriş yapılabiliyor

### 12.3. MongoDB Bağlantı Testi

Railway Dashboard'da:
1. Backend servisine gidin
2. **Logs** sekmesinde şunu görmelisiniz:
   ```
   MongoDB connected successfully
   Server running on port 5000
   ```

---

## 📊 ADIM 13: MONITORING VE YÖNETIM

### 13.1. Railway Dashboard'da İzleme

Her servis için:
- **Deployments**: Deployment geçmişi
- **Logs**: Real-time loglar
- **Metrics**: CPU, RAM, Network kullanımı
- **Settings**: Tüm ayarlar

### 13.2. Otomatik Deploy (GitHub Integration)

Railway, GitHub'a her push yaptığınızda otomatik deploy eder:

```bash
# Kod değişikliği yaptınız
git add .
git commit -m "Banner düzeltmeleri"
git push origin main

# Railway otomatik deploy başlatacak!
```

**Deploy'ları Durdurmak İsterseniz**:
- Servis → **Settings** → **Service** → **Disable Auto Deploy**

### 13.3. Logs İzleme

```bash
# Railway CLI ile (opsiyonel)
npm install -g @railway/cli
railway login
railway logs
```

Veya Dashboard'dan **Logs** sekmesinde real-time izleyin.

---

## 💰 ADIM 14: MALIYET YÖNETIMI

### Ücretsiz Plan Limitleri

Railway ücretsiz $5 kredi verir (aylık ~500 saat):

**Hesaplama**:
- 3 servis × 24 saat × 30 gün = 2,160 saat/ay
- Her saat ~$0.01-0.02 maliyetli
- **Ücretsiz $5 kredi ile yaklaşık 250-500 saat/ay**

**Maliyet Düşürme İpuçları**:

1. **Sleep Mode** (Boşta olan servisleri durdur):
   - Servis → **Settings** → **Sleep Mode** aktif et
   - 10 dakika aktivite yoksa sleep mode'a geçer

2. **Replica Count** (Tek instance kullan):
   - Varsayılan zaten 1, değiştirmeyin

3. **Resource Limits** (RAM limiti):
   - Servis → **Settings** → **Resources**
   - RAM: 512MB (backend) / 1GB (frontend)

### Ödeme Gerekirse

Eğer ücretsiz limit doluyorsa:
- **Hobby Plan**: $5/ay (ekstra kredi)
- Kredi kartı ekleyin: Dashboard → **Account** → **Billing**

---

## 🔧 SORUN GİDERME

### Sorun 1: Backend Başlamıyor

**Hata**: `Cannot find module 'dist/server.js'`

**Çözüm**:
1. Backend servisine gidin
2. **Logs** kontrol edin
3. `npm run build` başarılı mı?
4. `backend/package.json` içinde `build` script'i var mı?

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### Sorun 2: MongoDB Bağlantı Hatası

**Hata**: `MongoServerError: Authentication failed`

**Çözüm**:
1. Backend → **Variables** → `MONGODB_URI` kontrol edin
2. MongoDB servisinden doğru URL'yi kopyalayın
3. URL formatı: `mongodb://mongo:PASSWORD@host:port/railway`

### Sorun 3: CORS Hatası (Frontend API çağrılamıyor)

**Hata**: `CORS policy: No 'Access-Control-Allow-Origin'`

**Çözüm**:
1. Backend → **Variables** → `FRONTEND_URL` kontrol edin
2. Değerin frontend URL'si ile eşleştiğinden emin olun
3. Frontend ve backend servislerini restart edin

### Sorun 4: 404 Hatası (Custom Domain çalışmıyor)

**Çözüm**:
1. Cloudflare DNS kayıtlarını kontrol edin
2. **DNS only** (gri bulut) kullandığınızdan emin olun
3. DNS propagation için 5-10 dakika bekleyin
4. `nslookup api.yourdomain.com` ile DNS'i test edin

### Sorun 5: Build Hatası (Next.js)

**Hata**: `Error: ESLint errors found`

**Çözüm**:
1. Lokal'de build test edin: `cd frontend && npm run build`
2. Hataları düzeltin
3. Git commit ve push yapın

---

## 📝 HIZLI REFERANS

### Railway CLI Komutları

```bash
# Railway CLI kur
npm install -g @railway/cli

# Login
railway login

# Mevcut projeye bağlan
railway link

# Logs izle
railway logs

# Environment variables listele
railway variables

# Servis restart
railway restart
```

### Yararlı Railway Dashboard Linkleri

```
Dashboard: https://railway.app/dashboard
Projects: https://railway.app/projects
Docs: https://docs.railway.app/
```

### Domain Yapısı

```
https://yourdomain.com           → Frontend (Ana site)
https://www.yourdomain.com       → Frontend (WWW)
https://api.yourdomain.com       → Backend (API)
```

### Environment Variables Özet

**Backend**:
- `MONGODB_URI`: MongoDB bağlantı
- `JWT_SECRET`: JWT şifreleme anahtarı
- `FRONTEND_URL`: Frontend domain
- `NODE_ENV`: production
- `PORT`: 5000

**Frontend**:
- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_BASE_URL`: Backend base URL
- `NODE_ENV`: production

---

## ✅ KURULUM SONRASI KONTROL LİSTESİ

- [ ] GitHub'a proje yüklendi
- [ ] Railway hesabı oluşturuldu
- [ ] MongoDB servisi eklendi ve çalışıyor
- [ ] Backend servisi deploy edildi
- [ ] Backend health check başarılı
- [ ] Frontend servisi deploy edildi
- [ ] Frontend sayfası açılıyor
- [ ] Cloudflare DNS kayıtları eklendi (api, @, www)
- [ ] Railway'de custom domain'ler eklendi
- [ ] SSL sertifikaları aktif (HTTPS çalışıyor)
- [ ] Environment variables güncellendi (custom domain'ler ile)
- [ ] Backend logs kontrol edildi (hata yok)
- [ ] Frontend çalışıyor (banner, ürünler görünüyor)
- [ ] Login/Register test edildi
- [ ] Admin paneline giriş yapıldı

---

## 🎊 TEBRIKLER!

Ottoman Platform artık Railway'de canlı olarak yayında!

**Site Adresleri**:
- 🌐 Web: https://yourdomain.com
- 🔧 API: https://api.yourdomain.com
- 📊 Admin: https://yourdomain.com/admin

**Sonraki Adımlar**:
1. Admin hesabı oluşturun (ilk kayıt admin olur)
2. Ürün ekleyin
3. Banner'ları düzenleyin
4. Site ayarlarını yapılandırın
5. Test siparişleri oluşturun

**Önemli Hatırlatma**:
- Düzenli olarak Railway Dashboard'da resource kullanımını kontrol edin
- Ücretsiz $5 kredi doluyorsa ödeme kartı ekleyin
- GitHub'a her push otomatik deploy tetikler

---

## 📞 DESTEK

**Railway Docs**: https://docs.railway.app/
**Ottoman Platform GitHub**: https://github.com/GITHUB_USERNAME/ottoman-platform
**Cloudflare Docs**: https://developers.cloudflare.com/

---

**Son Güncelleme**: 31 Ekim 2024
**Railway Platform Versiyonu**: v2
**Ottoman Platform**: v1.0
