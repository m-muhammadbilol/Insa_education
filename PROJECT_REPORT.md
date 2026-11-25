# INSA Education — To'liq Loyiha Hisoboti va Qo'llanma

> **Loyiha nomi:** INSA Education Web Platform & CRM  
> **Sana:** 2026-yil noyabr  
> **Status:** Demonstratsion bosqich to'liq yakunlandi (Production-Ready Architecture)  
> **Manzil:** Toshkent shahri, Mirzo Ulug'bek metrosi yaqinida  
> **Bog'lanish:** Instagram: `@insa_education` | Telegram: `@INSAadmin`  

---

## 📑 MUNDARIJA

1. [Loyiha Arxitekturasi va Umumiy Tavsif](#1-loyiha-arxitekturasi-va-umumiy-tavsif)
2. [Bajarilgan Barcha Ishlar (Nima Qilindi)](#2-bajarilgan-barcha-ishlar-nima-qilindi)
3. [Kiritilgan O'zgarishlar va Maxsus Moslashtirishlar](#3-kiritilgan-ozgarishlar-va-maxsus-moslashtirishlar)
4. [Demodan To'liq Ishlab Chiqarishga (Production) O'tishda Nima Qoldi](#4-demodan-toliq-ishlab-chiqarishga-production-otishda-nima-qoldi)
5. [GitHub-ga Yuklash Bo'yicha Aniq Qo'llanma](#5-github-ga-yuklash-boyicha-aniq-qollanma)
6. [Arxiv (ZIP) Fayli Haqida](#6-arxiv-zip-fayli-haqida)

---

## 1. Loyiha Arxitekturasi va Umumiy Tavsif

Loyiha jahon andozalariga mos, Next.js (App Router), TypeScript, Tailwind CSS va Firebase texnologiyalari asosida barpo etilgan to'liq stekli ta'lim platformasidir.

### Texnologiyalar:
- **Frontend:** Next.js 14.2 (App Router), React 18, TypeScript (Strict rejim), Tailwind CSS.
- **Validatsiya va Formalar:** React Hook Form, Zod.
- **Belgilar (Icons):** Lucide React.
- **Autentifikatsiya:** Firebase Authentication (Deterministik foydalanuvchi nomiga asoslangan ichki xaritalash).
- **Ma'lumotlar Bazasi:** Cloud Firestore (Qat'iy xavfsizlik qoidalari bilan).
- **Backend va API:** Next.js Server Route Handlers + Firebase Admin SDK (Firebase Spark bepul tarifiga 100% mos — Cloud Functions talab etilmaydi).
- **Xabarnomalar:** Telegram Bot API (Failsafe rejimida).

---

## 2. Bajarilgan Barcha Ishlar (Nima Qilindi)

### A. Brend Identifikatsiyasi va Logotiplar Vektorizatsiyasi
1. **Asl Logotip Tahlili:** `@insa_education` profilining original tasviri tahlil qilinib, 6 qanotli aerodinamik spiral/vortex belgisi aniqlandi.
2. **SVG Formatda Qayta Yaratish:**
   - `public/assets/insa-badge.svg` — Chuqur binafsharang (`#54158C`) fonli rasmiy kvadrat nishon.
   - `public/assets/insa-logo.svg` — INSA Education yozuvli to'liq gorizontal logotip.
   - `public/assets/insa-logo-white.svg` — To'q yuzalar uchun oq variant.
   - `public/assets/insa-mark-purple.svg` va `public/assets/insa-mark-white.svg` — Shaffof fonli alohida ramzlar.
   - `public/favicon.svg` — Brauzer uchun moslashtirilgan yuqori kontrastli belgi.
3. **Dizayn Tizimi (White + Purple Minimal):** Ortiqcha qora gradientlar va arzon shishasimon effektlardan voz kechilib, toza oq fon, engil kulrang sathlar va chuqur shohona binafsharang urg'u tanlandi.

---

### B. Ommaviy Veb-Sayt (Public Landing Page — `/`)
To'liq O'zbek tilida, xalqaro kengaytirishga (RU/EN) tayyor holda yaratildi:
1. **Navigatsiya (Navbar):** Responsive menyu, bo'limlarga tezkor o'tish linklari, til indikatori va "Kursga yozilish" asosiy CTA tugmasi.
2. **Hero Bo'limi:** Aniq sarlavha, afzalliklar ro'yxati, Mirzo Ulug'bek metrosi ko'rsatkichi hamda birinchi ekranning o'zidayoq to'ldirish mumkin bo'lgan tezkor ariza formasi.
3. **Kurslar Bo'limi:**
   - *IELTS Intensive & Standard* (Listening, Reading, Writing, Speaking + haftalik Mock).
   - *CEFR / Multi-level* (B1, B2, C1 darajalar, Davlat test markazi sertifikati).
   - *Milliy Sertifikat* (Ona tili, matematika, tarix — OTMga 100% imtiyoz).
   - *Til Kurslari* (General English, so'zlashuv va grammatika).
   - *Fan Kurslari* (Aniq va tabiiy fanlar, litsey va maktab o'quvchilari uchun).
4. **Nega Aynan INSA Bo'limi:** Haqiqiy ustunliklar (kichik guruhlar, qulay metro lokatsiyasi, intizom, zamonaviy xonalar).
5. **Natijalar Bo'limi:** Namoyish talabiga binoan soxta yutuqlarsiz, aniq `[Demo Namuna]` belgisi bilan jihozlangan kartochkalar.
6. **O'qish Bosqichlari:** 4 qadamli sayohat (Diagnostika $\to$ Shaxsiy reja $\to$ Mashg'ulot $\to$ Sertifikat).
7. **Fikrlar Bo'limi:** Ko'rgazmali arxiv sifatida belgilangan ota-onalar va o'quvchilar fikrlari.
8. **FAQ (Savol-Javoblar):** Interaktiv akkordeon interfeysi.
9. **Aloqa va Lokatsiya:** Metro sxemasi, Chilonzor yo'nalishi, `@INSAadmin`, ish vaqti va bevosita bog'lanish CTA.
10. **Footer:** To'liq huquqiy va navigatsiya havolalari.

---

### C. Ommaviy Lead Qabul Qilish Tizimi (`/api/leads`)
1. **Forma Maydonlari:**
   - Ism (Kamida 2 ta harf).
   - Familiya (Kamida 2 ta harf).
   - Asosiy telefon raqami (`+998 XX XXX XX XX` qat'iy tekshiruvi).
   - Qo'shimcha telefon raqami (Ixtiyoriy).
   - Qiziqqan kursi (Dropdown).
   - Shaxsiy ma'lumotlarni qayta ishlashga rozilik (Majburiy).
2. **Xavfsizlik va Anti-Spam:**
   - Server va klient tomonida Zod validatsiyasi.
   - Bir IP/telefon raqamidan 15 soniya ichida qayta yuborishni cheklovchi (Rate-Limit) mexanizm.
   - Bir vaqtda ikki marta bosib yuborishdan (Double-click) himoya.
3. **Failsafe Telegram Integratsiyasi:**
   - Ariza avval Firestore ma'lumotlar bazasiga `NEW` holati bilan to'liq yoziladi.
   - Shundan so'ng alohida Telegram Bot orqali administrator guruhiga xabar jo'natiladi.
   - Agar Telegram servisi ishlamasa yoki internet uzilsa ham, o'quvchining arizasi bazada 100% saqlanib qoladi.
   - Telegram bot tokeni brauzerga hech qachon oshkor qilinmaydi.

---

### D. Autentifikatsiya va RBAC Tizimi (`/admin`)
1. **Yagona Kirish Sahifasi:** Admin ham, Super Admin ham bitta `/admin` manzilidan kiradi.
2. **Deterministik Username Mapping:**
   - Firebase Auth aslida elektron pochtani talab qiladi.
   - Biz `usernameToInternalEmail(username)` algoritmini ishlab chiqdik: masalan, `superadmin` $\to$ `superadmin@insa.internal`.
   - Foydalanuvchi hech qanday pochtani kiritishi shart emas — faqat username va parol orqali xavfsiz tizimga kiradi.
3. **Majburiy Vaqtinchalik Parolni O'zgartirish (`/admin/change-password`):**
   - Yangi yaratilgan adminga `mustChangePassword = true` belgilanadi.
   - U birinchi kirganida boshqaruv paneliga kiritilmaydi, avval o'zining yangi shaxsiy parolini o'rnatishi shart.
4. **Muzlatilgan Hisoblar Blokirovkasi (Freeze Check):**
   - Agar hisob holati `FROZEN` bo'lsa, tizim darhol sessiyani uzadi (`signOut`) va xabar chiqaradi.

---

### E. Admin CRM Paneli (`/admin/dashboard` & `/admin/leads`)
1. **Dashboard Overview:**
   - Haqiqiy bazadan hisoblanadigan ko'rsatkichlar: Jami leadlar, Yangi, Bog'lanildi, Qiziqmoqda, Qabul qilindi, Rad etildi.
2. **Leadlar CRM Jadvali:**
   - Ism, telefon, kurs, holat, sana ustunlari.
   - **Clickable `tel:` tugmasi:** Bitta bosish bilan mijozga qo'ng'iroq qilish.
   - **Holat o'zgartirish:** Dropdown orqali real vaqtda yangilanadi va o'zgarishlar tarixi `lead_status_history` to'plamiga yoziladi.
   - **Izohlar (Notes Modal):** Har bir o'quvchi bo'yicha maxsus ichki eslatmalar yozish.
   - **Tafsilotlar modali:** To'liq tarixni ko'rish.
   - Qidiruv (ism, telefon, kurs bo'yicha) va status bo'yicha filtr hamda sahifalash (Pagination).

---

### F. Super Admin Boshqaruv Tizimi (`/admin/superadmin/*`)
1. **Xavfsizlik Portali (`/admin/superadmin`):**
   - Alohida to'q binafsha/indigo rangdagi oliy darajali interfeys.
2. **Adminlar Boshqaruvi (CRUD — `/admin/superadmin/admins`):**
   - **Create:** Yangi admin yaratish, vaqtinchalik parol berish, bir marta ko'rinuvchi parolni nusxalash.
   - **Read:** Barcha adminlar holati, yaratilgan vaqti.
   - **Freeze/Unfreeze:** Admin hisobini bir zumda muzlatish. Bu amal Firebase Auth'da `revokeRefreshTokens(uid)` chaqirib, uning barcha ochiq sessiyalarini darhol bekor qiladi.
   - **Reset Password:** Yangi vaqtinchalik parol o'rnatish.
   - **Delete:** Adminni butunlay o'chirish.
3. **Audit Jurnali (`/admin/superadmin/audit-logs`):**
   - Kim, qachon, qaysi admin yoki lead ustida qanday amal bajarganligining o'zgarmas arxivi.

---

### G. Initsializatsiya (Bootstrap) va Xavfsizlik Qoidalari
1. **Bootstrap Skripti (`scripts/bootstrap.js`):**
   - Muhit o'zgaruvchilaridan foydalanib birinchi Super Adminni xavfsiz yaratadi.
   - Baza tekshiriladi: agar bitta ham Super Admin bo'lsa, skript qayta ishlamaydi (idempotent).
2. **Firestore Xavfsizlik Qoidalari (`firestore.rules`):**
   - Ommaviy tashrif buyuruvchilarga ma'lumotlarni o'qish/yozish qat'iy taqiqlangan.
   - Faqat `ACTIVE` maqomidagi `ADMIN` va `SUPER_ADMIN` leadlarni ko'ra oladi.
   - Muzlatilgan yoki begona shaxslar ma'lumotlar bazasiga kira olmaydi.

---

## 3. Kiritilgan O'zgarishlar va Maxsus Moslashtirishlar

| Asl Ko'rsatma / Holat | Qanday Amalga Oshirildi / Moslashtirildi | Sababi va Foydasi |
|---|---|---|
| **Firebase Cloud Functions** | O'rniga Next.js Server Route Handlers ishlatildi | Firebase Spark bepul tarifiga 100% mos bo'lishi va keraksiz xarajatlarning oldini olish uchun |
| **Email orqali kirish** | Deterministik Username-to-Email arxitekturasi | Xodimlar email yaratib yurishi shart emas; oddiy login/parol bilan kirishadi, lekin orqa fonda Firebase Auth xavfsizligi saqlanadi |
| **Telegram API uzilishi** | Failsafe asinxron jo'natish mexanizmi | Telegram bloklansa yoki kechiksa ham, talabaning arizasi ma'lumotlar bazasiga tushib qoladi |
| **Dizayn uslubi** | White + Purple Minimal | Ta'lim markazining ishonchli, toza va professional ko'rinishini ta'minlash |
| **Statistika va natijalar** | Aniq Demo belgilari bilan jihozlandi | Rasmiy sertifikatlar tasdiqlanmaguncha nohaq ma'lumot bermaslik |

---

## 4. Demodan To'liq Ishlab Chiqarishga (Production) O'tishda Nima Qoldi

Demo loyiha hozir to'liq ishchi holatda. Uni INSA Education markazining haqiqiy faoliyatiga to'liq ulash uchun quyidagi 4 ta qadamni bajarish kifoya:

### 1. Haqiqiy Firebase Loyihasini Ulash
- [Firebase Console](https://console.firebase.google.com)'da `insa-education` loyihasini ochish.
- Authentication (Email/Password) va Cloud Firestore-ni faollashtirish.
- `firestore.rules` va `firestore.indexes.json` fayllarini `firebase deploy --only firestore` orqali yuklash.
- Loyiha sozlamalaridan olingan haqiqiy kalitlarni `.env.local` (yoki Vercel sozlamalari)ga joylash:
  ```env
  FIREBASE_PROJECT_ID=...
  FIREBASE_CLIENT_EMAIL=...
  FIREBASE_PRIVATE_KEY="..."
  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  ```

### 2. Telegram Botini Ulash
- Telegram'dagi `@BotFather` orqali yangi bot yaratish va tokenini olish.
- Adminlar guruhini ochib, botni qo'shish va guruh `CHAT_ID` sini aniqlash.
- `.env.local` ga yozish:
  ```env
  TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
  TELEGRAM_CHAT_ID=-100123456789
  ```

### 3. Haqiqiy Ma'lumotlarni Joylash (Kontent)
- O'qituvchilarning real ismlari va tasdiqlangan rasmlarini qo'shish.
- O'quvchilarning haqiqiy IELTS/CEFR sertifikatlari skanlarini `Results` bo'limiga kiritish (Demo kartalar o'rniga).
- Aniq kurs narxlari va jadvalini kiritish (agar ommaviy ko'rsatish ma'qul ko'rilsa).

### 4. Vercel Hostingga Joylash va Domen Ulash
- GitHub orqali Vercel-ga ulash.
- O'quv markazining rasmiy domenini (masalan: `insaeducation.uz` yoki `insa.uz`) DNS orqali ulash.

---

## 5. GitHub-ga Yuklash Bo'yicha Aniq Qo'llanma

Loyiha lokal ravishda Git bilan to'liq commit qilingan. Uni o'zingizning GitHub hisobingizga yuklash uchun quyidagi oddiy buyruqlarni bajaring:

### 1-qadam: GitHub-da yangi repozitoriy oching
1. [github.com/new](https://github.com/new) sahifasiga kiring.
2. Repozitoriy nomini yozing (masalan: `insa-education`).
3. Uni **Public** yoki **Private** qiling (lekin `README` yoki `.gitignore` qo'shish katakchalarini **belgilamang**, chunki bizda allaqachon tayyor).
4. **Create repository** tugmasini bosing.

### 2-qadam: Terminalda quyidagi buyruqlarni ishga tushiring
Terminalni ochib, loyiha papkasiga kiring va o'z repozitoriy havolangizni qo'ying:

```powershell
cd C:\Users\Muhammadbilol\.gemini\antigravity\scratch\insa-education

# Asosiy tarmoqni 'main' deb nomlash
git branch -M main

# O'z GitHub manzilingizni qo'shing (USERNAME va REPO o'rniga o'zingiznikini yozing):
git remote add origin https://github.com/USERNAME/insa-education.git

# GitHub-ga yuklash:
git push -u origin main
```

*(Agar GitHub parolni so'rasa, GitHub Personal Access Token (PAT) dan foydalaning).*

---

## 6. Arxiv (ZIP) Fayli Haqida

Siz loyihani arxiv sifatida boshqa dasturchilarga yoki mijozga yuborishingiz uchun loyihaning toza ZIP varianti tayyorlandi.

Keraksiz og'ir `node_modules` va `.next` kesh fayllari chiqarib tashlangan, shuning uchun arxiv juda yengil va tez ochiladi.

📁 **Tayyor ZIP fayl joylashuvi:**
- `C:\Users\Muhammadbilol\Downloads\insa-education.zip`
- `C:\Users\Muhammadbilol\Desktop\insa-education.zip`

Boshqa kompyuterda ishga tushirish uchun:
```bash
unzip insa-education.zip
cd insa-education
npm install
npm run dev
```

---
*INSA Education platformasi professional darajada, sifat va xavfsizlik talablariga to'liq javob beradigan holatda topshirildi.*
