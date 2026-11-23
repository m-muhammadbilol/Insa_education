# INSA Education — World-Class Full-Stack Platform

> **INSA Education** o'quv markazining to'liq funksional, xavfsiz va demonstratsion veb-platformasi (Ommaviy veb-sayt, Lead Management CRM, Admin Panel va Super Admin boshqaruv tizimi).

---

## 🏛️ Loyiha Haqida

- **Brend:** INSA Education
- **Joylashuv:** Toshkent shahri, Mirzo Ulug'bek metrosi yaqinida
- **Instagram:** [@insa_education](https://instagram.com/insa_education)
- **Telegram:** [@INSAadmin](https://t.me/INSAadmin)
- **Yo'nalishlar:** IELTS, CEFR, Milliy sertifikat, Til kurslari, Fan kurslari
- **Dizayn yo'nalishi:** **White + Purple Minimal** (Premium, akademik, qulay va tezkor)

---

## 🚀 Texnologik Stek

- **Frontend:** Next.js 14 (App Router), TypeScript (Strict), Tailwind CSS, Lucide Icons
- **Forma va Validatsiya:** React Hook Form, Zod
- **Autentifikatsiya:** Firebase Authentication (Deterministik foydalanuvchi nomiga asoslangan ichki xavfsiz mexanizm)
- **Ma'lumotlar Bazasi:** Cloud Firestore (Qat'iy xavfsizlik qoidalari bilan)
- **Server:** Next.js Route Handlers (Firebase Spark bepul tarifiga 100% mos — Cloud Functions talab qilinmaydi)
- **Xabarnomalar:** Telegram Bot API (Failsafe arxitektura)
- **Deployment:** Vercel (Hobby) / Firebase Spark

---

## 📁 Loyiha Strukturasi

```
insa-education/
├── firestore.rules               # Cloud Firestore qat'iy xavfsizlik qoidalari
├── firestore.indexes.json        # Firestore kompozit indekslari
├── .env.example                  # Maxfiy ma'lumotlarsiz konfiguratsiya shabloni
├── scripts/
│   ├── bootstrap.js              # Super Admin yaratish bo'yicha bir martalik xavfsiz skript
│   └── test-scenarios.js         # Biznes mantig'i va xavfsizlik testlari
├── public/
│   ├── assets/
│   │   ├── insa-badge.svg        # Rasmiy binafsharang 6-qanotli vortex nishoni
│   │   ├── insa-logo.svg         # Gorizontal logotip (INSA Education)
│   │   ├── insa-mark-purple.svg  # Shaffof binafsharang vortex
│   │   └── insa-mark-white.svg   # Shaffof oq vortex
│   └── favicon.svg               # Brauzer nishoni
└── src/
    ├── app/
    │   ├── page.tsx              # O'zbek tilidagi rasmiy bosh sahifa
    │   ├── admin/
    │   │   ├── page.tsx          # Universal login sahifasi (/admin)
    │   │   ├── change-password/  # Majburiy vaqtinchalik parolni o'zgartirish
    │   │   ├── dashboard/        # Admin CRM ko'rsatkichlar paneli
    │   │   ├── leads/            # Leadlar jadvali, status o'zgartirish, tel: qo'ng'iroq
    │   │   └── superadmin/
    │   │       ├── page.tsx      # Super Admin umumiy xavfsizlik portali
    │   │       ├── admins/       # Adminlar CRUD, muzlatish (Freeze) va parolni tiklash
    │   │       ├── leads/        # Super Admin lead nazorati
    │   │       └── audit-logs/   # Tizim audit jurnali
    │   └── api/
    │       ├── leads/            # Lead qabul qilish (Rate-limit va Telegram integratsiyasi)
    │       ├── admin/leads/      # Leadlarni olish, status va izohlarni yangilash
    │       ├── auth/             # Parolni o'zgartirish endpointi
    │       └── superadmin/       # Admin CRUD, muzlatish, tokenlarni bekor qilish, audit
    ├── components/
    │   ├── public/               # Navbar, Hero, LeadForm, Courses, WhyInsa, Results, FAQ, Footer
    │   └── admin/                # AdminLayout, LeadStatusBadge
    └── lib/
        ├── auth/                 # Deterministik username mapping va sessiya tekshiruvi
        ├── firebase/             # Firebase Client va Firebase Admin SDK
        ├── services/             # Telegram bildirishnomalar servisi
        ├── types/                # Lead, Profile va Audit TypeScript interfeyslari
        └── validations/          # Zod validatsiya sxemalari (O'zbekcha xato xabarlari)
```

---

## 🛠️ O'rnatish va Ishga Tushirish

### 1. Repozitoriy va Bog'liqliklar
```bash
cd insa-education
npm install
```

### 2. Muhit O'zgaruvchilari
`.env.example` faylidan nusxa olib `.env.local` yarating:
```bash
cp .env.example .env.local
```
Va Firebase hamda Telegram sozlamalarini kiriting.

### 3. Dastlabki Super Adminni Initsializatsiya Qilish (Bootstrap)
Bir martalik skript orqali tizimga birinchi Super Admin hisobi kiritiladi:
```bash
npm run bootstrap
# yoki: node scripts/bootstrap.js
```
*Eslatma: Skript faqat bazada Super Admin hisobi umuman bo'lmagandagina ishlaydi. Mavjud yoki muzlatilgan hisoblarni qayta yaratmaydi.*

### 4. Dasturchi Rejimida Ishga Tushirish
```bash
npm run dev
```
Brauzerda `http://localhost:3000` manzilini oching.

### 5. Ishlab Chiqarish (Production Build)
```bash
npm run build
npm run start
```

---

## 🔐 Xavfsizlik Invariantlari va RBAC

1. **Deterministik Username Autentifikatsiyasi:**
   Firebase Auth parollarni xeshlovchi va tekshiruvchi asosiy vosita bo'lib xizmat qiladi. Foydalanuvchi nomlari xavfsiz deterministik manzilga (`username@insa.internal`) xaritalanadi.
2. **Muzlatish (Freeze Engine):**
   Super Admin biror adminni muzlatganda:
   - Firestore'da holat `FROZEN` ga o'tkaziladi.
   - `admin.auth().revokeRefreshTokens(uid)` chaqirilib, mavjud barcha sessiyalar darhol bekor qilinadi.
   - Himoyalangan API va Firestore Security Rules muzlatilgan hisoblardan kelgan so'rovlarni bir zumda rad etadi (`ACCOUNT_FROZEN`).
3. **Vaqtinchalik Parol Tizimi:**
   Super Admin tomonidan yaratilgan admin birinchi kirishida `/admin/change-password` sahifasiga yo'naltiriladi va o'zining shaxsiy parolini o'rnatmaguncha boshqaruv paneliga kiritilmaydi.
4. **Failsafe Telegram Bildirishnomalari:**
   Lead avval bazaga saqlanadi, so'ng Telegram botiga xabar yuboriladi. Telegram API ishlamasa yoki uzilsa ham, o'quvchining arizasi yo'qolmaydi.

---

## 📋 Sinov Natijalari (Verification Matrix)

Avtomatlashtirilgan testlarni ishga tushirish uchun:
```bash
node scripts/test-scenarios.js
```

- ✅ **Ssenariy 1:** O'zbekiston telefon raqamlari formatini tozalash va to'g'ri qabul qilish (`+998901234567`).
- ✅ **Ssenariy 2:** Noto'g'ri yoki yetarli bo'lmagan raqamlarni qat'iy rad etish.
- ✅ **Ssenariy 3:** Foydalanuvchi nomini deterministik tarzda `username@insa.internal` ga o'tkazish.
- ✅ **Ssenariy 4:** 15 soniya ichida qayta yuborilgan takroriy arizalarni (Spam / Double-click) cheklash.
- ✅ **Ssenariy 5:** Telegram uzilgan taqdirda ham leaddan xoli tranzaksiya yaxlitligi.
- ✅ **Ssenariy 6:** ADMIN va SUPER_ADMIN ruxsatlar matritsasi va muzlatilgan hisoblar blokirovkasi.
- ✅ **Ssenariy 7:** `mustChangePassword` majburiy almashtirish oqimi.

---

## 🌐 Vercel-ga Joylashtirish (Deployment Guide)

1. Repozitoriyni GitHub hisobingizga yuklang.
2. [Vercel Dashboard](https://vercel.com) orqali yangi loyiha qo'shing.
3. **Environment Variables** bo'limida quyidagilarni sozlang:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. **Deploy** tugmasini bosing — loyiha Vercel Hobby bepul rejasida to'liq mustaqil ishlaydi.
