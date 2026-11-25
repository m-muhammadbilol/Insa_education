# Vercel’da Firebase va admin kirishini sozlash

## 1. Firebase loyihasini tayyorlash

Firebase Console’da loyiha oching. **Project settings → General → Your apps → Web app** ichidagi Web config qiymatlarini Vercel Environment Variables’ga kiriting:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Firebase Authentication → Sign-in method’dan **Email/Password** usulini yoqing. Firebase Console’da Cloud Firestore’ni ham yarating.

## 2. Vercel sozlamalari

Vercel Dashboard’da `Insa_education` project’ni oching → **Settings → Environment Variables**. Yuqoridagi 6 ta Web qiymat bilan birga quyidagi server qiymatlarini ham Production uchun qo‘shing (Preview’dan ham foydalanayotgan bo‘lsangiz, Preview’ni ham belgilang):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

`FIREBASE_PRIVATE_KEY` — Firebase service account private key. Uni GitHub’ga yoki chatga yubormang; faqat Vercel’dagi maxfiy Environment Variable sifatida kiriting. Vercel’da qiymatlarni saqlagandan keyin **Deployments → Redeploy** qiling. Yangi environment qiymatlari faqat keyingi deployment’da ishlaydi.

## 3. Birinchi Super Adminni yaratish

Super Admin bootstrap’ini lokal kompyuterdan bir marta bajaring. Repo ichidagi `.env.local` faylida shu Firebase Admin SDK qiymatlari va `BOOTSTRAP_SUPERADMIN_USERNAME`, `BOOTSTRAP_SUPERADMIN_PASSWORD` bo‘lsin. Bu ignored fayldagi login ma’lumotlarini GitHub’ga qo‘shmang.

Terminalda loyiha papkasiga o‘tib `npm install`, so‘ng `npm run bootstrap` bajaring. Skript endi `.env.local` ni o‘zi o‘qiydi. Bu buyruq Firebase Authentication’da `superadmin` hisobini va Firestore’da profilini yaratadi. Agar Super Admin profili avvaldan bo‘lsa, skript parolni o‘zgartirmaydi va qayta hisob yaratmaydi.

## 4. Qanday kiriladi

Vercel saytingizdagi `/admin` sahifasini oching. Username: `superadmin`; boshlang‘ich parol `.env.local` faylidagi `BOOTSTRAP_SUPERADMIN_PASSWORD` qiymati. Birinchi kirishda tizim yangi parol o‘rnatishni talab qiladi. Oddiy admin hisoblarini Super Admin panelining **Adminlar** bo‘limidan yarating; alohida ommaviy ro‘yxatdan o‘tish sahifasi yo‘q.

## Koddagi tuzatishlar

- Demo Firebase client fallback’lari olib tashlandi; noto‘g‘ri Web API key uchun aniq xabar ko‘rsatiladi.
- Server API’lar haqiqiy Firebase Admin SDK sozlamalari bo‘lmasa demo loyihaga ulanmaydi, aniq sozlama xatosi beradi.
- `npm run bootstrap` `.env.local` faylini o‘qiydi.
- Bootstrap Super Admin birinchi kirishda parolini yangilashga majbur qiladi.