# Supabase Kurulum Şablonları

Bu klasör, projeyi mevcut *Custom Backend (Express+Postgres vb.)* yerine Postgres tabanlı, Firebase alternatifi olan **Supabase** ile geliştirmek isteyenler için rehber dosyalar ve şablonlar içerir. 

Eğer Supabase kullanmayacaksanız bu klasörü tamamen yok sayabilirsiniz.

## Dosyalar

1. **`supabase-config.js`**
   - **Nerede Kullanılır?**: Frontend (Web/Vite/React) uygulamasında.
   - **Ne İşe Yarar?**: Kullanıcının web tarafında doğrudan Supabase servislerine (Auth, Database, Storage) "anonim" yetkilerle erişmesini sağlar.

2. **`supabase-admin.js`**
   - **Nerede Kullanılır?**: Backend (Node.js/Express) sunucusunda.
   - **Ne İşe Yarar?**: Service Role Key kullanarak veritabanına ve Auth sistemine *tam kısıtlamasız yönetici (admin)* erişimi sağlar. Özel güvenlik kurallarını bypass ederek çalışır.

## Nasıl Kurulur?

### A. Frontend İçin (Web Sürümü)
1. Supabase (https://supabase.com/) üzerinden bir proje (Organization & Project) oluşturun.
2. Dashboard > Settings > API bölümünden `Project URL` ve `anon` `public` anahtarlarını kopyalayın.
3. Frontend projenizin `.env` dosyasına şunları ekleyin:
   ```env
   VITE_SUPABASE_URL="https://xxxxx.supabase.co"
   VITE_SUPABASE_ANON_KEY="senin_anon_public_key_bilgin"
   ```
4. Uygulamanızda `npm install @supabase/supabase-js` komutunu çalıştırın.
5. Bu klasördeki `supabase-config.js` içeriğini kendi projenizin içine (`src/supabase/` veya benzeri bir yere) taşıyıp kullanmaya başlayın.

### B. Backend İçin (Express Sunucusu)
1. Supabase Dashboard > Settings > API bölümünden `service_role` `secret` anahtarını kopyalayın.
2. Backend projenizin `.env` dosyasına şunları ekleyin:
   ```env
   SUPABASE_URL="https://xxxxx.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="senin_service_role_secret_key_bilgin"
   ```
3. Backend projenizde `npm install @supabase/supabase-js` komutunu çalıştırın.
4. Bu klasördeki `supabase-admin.js` içeriğini projeninizin bir config dosyasına kopyalayıp admin yetkisi gereken yerlerde içeri aktarın (import/require).
