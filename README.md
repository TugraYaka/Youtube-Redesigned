# YouTube Redesign

Bu repo, YouTube benzeri bir arayüz ve çoklu backend stratejisi içeren full-stack bir projedir.

- Frontend: React + Vite
- Backend (önerilen başlangıç): Node.js + Express (`custom`)
- Alternatif şablonlar: Firebase ve Supabase

Bu README, projeyi ilk kez kuracak biri için en kolay yolu anlatır.

## 1) Proje Yapısı

```text
Youtube-redesign/
├── frontend/
│   └── Youtube-Web/youtube-redesign-web/   # React + Vite frontend
├── backend-custom/
│   └── Youtube-Redesign-Backend/            # Node.js + Express backend
├── backend-firebase/                        # Firebase entegrasyon şablonları
├── backend-supabase/                        # Supabase entegrasyon şablonları
├── AI-ML/                                   # Öneri sistemleri (JS)
└── README.md
```

## 2) Gereksinimler

- Node.js `20+`
- npm `10+`
- Git

Kontrol:

```bash
node -v
npm -v
git --version
```

## 3) En Kolay Kurulum (Custom Backend ile)

Bu proje için başlangıçta `custom` modunu kullanman en pratik yöntemdir.

### Adım 1: Backend'i çalıştır

```bash
cd backend-custom/Youtube-Redesign-Backend
cp .env.example .env
npm install
```

`.env` dosyasını aç ve en az şu alanları doldur:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
COOKIE_KEY=uzun_ve_rastgele_bir_deger
PORT=5001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5001
GOOGLE_CALLBACK_URL=http://localhost:5001/auth/google/callback
```

Notlar:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` ve `COOKIE_KEY` boş olursa backend açılmaz.
- Google OAuth kurulu değilse backend'i sadece ayağa kaldırmak için geçici dummy değer verebilirsin; giriş akışı çalışmaz.

Backend'i başlat:

```bash
npm run dev
```

Beklenen çıktı: `Server is running on port 5001`

### Adım 2: Frontend'i çalıştır (yeni terminal)

```bash
cd frontend/Youtube-Web/youtube-redesign-web
cp .env.example .env.local
npm install
```

`.env.local` içinde başlangıç için şunları ayarla:

```env
VITE_BACKEND_MODE=custom
VITE_BACKEND_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=... # backend'deki Google client id ile aynı proje olmalı
```

Frontend'i başlat:

```bash
npm run dev
```

Tarayıcıda aç:

- `http://localhost:5173`

## 4) İlk Çalıştığını Nasıl Anlarsın?

- Frontend açılıyor mu: `http://localhost:5173`
- Backend ayakta mı: `http://localhost:5001/test` (cevap: `Backend is working!`)
- Login butonu Google'a yönlendiriyor mu: `/auth/google`

## 5) Backend Modları (Custom / Firebase / Supabase)

Frontend tarafında mod seçimi:

`frontend/Youtube-Web/youtube-redesign-web/.env.local`

```env
VITE_BACKEND_MODE=custom   # veya firebase / supabase
```

### `custom` modu
- Express backend gerekir (`backend-custom/...`).
- Video yükleme, `/api/*` route'ları ve Socket.IO bu modda aktif çalışır.

### `firebase` modu
- `VITE_FIREBASE_*` alanlarını doldur.
- Rehber ve şablonlar: `backend-firebase/README.md`

### `supabase` modu
- `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` doldur.
- Rehber ve şablonlar: `backend-supabase/README.md`

## 6) Sık Kullanılan Komutlar

### Frontend

```bash
cd frontend/Youtube-Web/youtube-redesign-web
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend (Custom)

```bash
cd backend-custom/Youtube-Redesign-Backend
npm run dev
npm run build
npm run start
```

## 7) Yaygın Hatalar ve Çözüm

1. `Missing required environment variable` hatası
- Backend `.env` içinde gerekli alanlardan biri boştur.

2. Frontend login'de hata veriyor
- `VITE_BACKEND_MODE` ile verdiğin env'ler uyumsuzdur (ör: mode `supabase` ama Supabase env yok).

3. CORS / redirect sorunu
- Backend `FRONTEND_URL` ve frontend `VITE_BACKEND_URL` değerleri local portlarla birebir eşleşmeli.

4. `npm` kurulum hataları
- Node sürümünü `20+` yap.
- Gerekirse `node_modules` silip tekrar `npm install` çalıştır.

## 8) Ek Dokümanlar

- Frontend workspace: `frontend/README.md`
- Custom backend workspace: `backend-custom/README.md`
- Katkı rehberi: `CONTRIBUTING.md`
- Güvenlik: `SECURITY.md`
- Davranış kuralları: `CODE_OF_CONDUCT.md`

## Lisans

MIT. Ayrıntı: `LICENSE`
