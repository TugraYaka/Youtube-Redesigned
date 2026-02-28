# Firebase Kurulum Şablonları

Bu klasör, projeyi mevcut *Custom Backend (Express+Postgres vb.)* yerine veya ona ek olarak **Firebase** hizmetleriyle (kimlik doğrulama, veritabanı, resim/video depolama) bağlamak isteyenler için rehber dosyalar ve şablonlar içerir. 

Eğer Firebase kullanmayacaksanız bu klasörü tamamen yok sayabilirsiniz.

## Dosyalar

1. **`firebase-config.js`**
   - **Nerede Kullanılır?**: Frontend (Web/Vite/React) uygulamasında kullanılır.
   - **Ne İşe Yarar?**: Kullanıcının web tarafında Firebase ile iletişim kurmasını sağlar. Doğrudan tarayıcıdan veri çekmek veya oturum açmak için kullanılır.

2. **`firebase-admin.js`**
   - **Nerede Kullanılır?**: Backend (Node.js/Express) sunucusunda kullanılır.
   - **Ne İşe Yarar?**: Admin yetkilendirmesiyle (Service Account kullanarak) Firebase hizmetlerine sınırsız erişim sağlar. Güvenli işlemler, kullanıcı yönetimi (Admin SDK) gibi işlemlerde kullanılır.

## Nasıl Kurulur?

### A. Frontend İçin (Web Sürümü)
1. Firebase Konsolu (https://console.firebase.google.com/) üzerinden bir proje oluşturun.
2. Web projesi ekleyin ve verdiği API anahtarlarını kopyalayın.
3. Frontend projenizin (Tugra'nın YouTube Web'i) `.env` (veya `.env.local`) dosyasına şunları ekleyin:
   ```env
   VITE_FIREBASE_API_KEY="senin_api_anahtarin"
   VITE_FIREBASE_AUTH_DOMAIN="senin_projen.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="senin_projen"
   VITE_FIREBASE_STORAGE_BUCKET="senin_projen.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="mesajlasma_id_numaran"
   VITE_FIREBASE_APP_ID="uygulama_id_numaran"
   ```
4. Uygulamanızda `npm install firebase` komutunu çalıştırın.
5. Bu klasördeki `firebase-config.js` içeriğini kendi web projenizin içine taşıyın ve kullanmaya başlayın.

### B. Backend İçin (Express Sunucusu)
1. Firebase Konsolunda *Project Settings (Proje Ayarları)* > *Service Accounts (Hizmet Hesapları)* sekmesine gidin.
2. **"Generate New Private Key"** diyerek `.json` formatında admin bilgilerini indirin.
3. Verilen hassas bilgileri Backend projenizin `.env` dosyasına ekleyin:
   ```env
   FIREBASE_PROJECT_ID="senin_projen"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@senin_projen.iam.gserviceaccount.com"
   # Diğer tırnakları değil sadece bu çift tırnakları ve satır arası \n içeren hallerini kopyalayın
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSeninGizliAnahtarin\n-----END PRIVATE KEY-----\n"
   ```
4. Backend projenizde `npm install firebase-admin` komutunu çalıştırın.
5. Bu klasördeki `firebase-admin.js` içeriğini backend kodunuz içerisine taşıyıp veritabanını dilediğiniz gibi kullanın.
