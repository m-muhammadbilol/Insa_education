# INSA Education — loyiha holati

## Hozirgi arxitektura

- Frontend: Next.js 14, React, TypeScript va Tailwind CSS.
- Auth va ma'lumotlar bazasi: Supabase Auth va PostgreSQL.
- Server API'lari Supabase server secret key orqali ishlaydi; u brauzerga berilmaydi.
- Saytni Vercel'da joylashtirish ko'zda tutilgan.
- Ariza xabarnomalari Telegram Bot API orqali yuboriladi.

## Admin tizimi

- `/admin` — foydalanuvchi nomi va parol bilan kirish.
- Birinchi Super Admin `scripts/bootstrap.js` orqali yaratiladi.
- Yangi admin birinchi kirganda parolini almashtirishi shart.
- Super Admin adminlarni yaratish, muzlatish, parolini tiklash va o'chirish imkoniga ega.
- Leadlar, status tarixi va audit yozuvlari PostgreSQL jadvallarida saqlanadi.

## Firebase'dan Supabase'ga o'tish

Kod Firebase Auth va Firestore o'rniga Supabase Auth/PostgreSQL ishlatadigan qilib o'zgartirildi. Jadval va RLS sozlamalari `supabase/schema.sql` faylida, muhit o'zgaruvchilari `.env.example` faylida, ilk Super Admin sozlamasi `ADMIN_SETUP.md` faylida berilgan.

Firebase'dagi eski foydalanuvchilar, arizalar, izohlar yoki audit yozuvlari avtomatik ko'chirilmaydi. Hozircha ma'lumotlar migratsiyasi bajarilmadi. Eski tizimdan ma'lumot ko'chirishdan oldin qaysi yozuvlar va qaysi yangi loyihaga o'tishini aniq belgilash kerak.

## Hozircha bajarilishi kerak bo'lgan ishlar

1. Lokal `.env.local` fayliga yangi Supabase URL, publishable key va server-only secret key qiymatlarini qo'shish. `.env.local` GitHub'ga yuborilmasin.
2. `npm run bootstrap` bilan birinchi Super Adminni yaratish. Skript hisobni `must_change_password` holatida yaratadi; birinchi kirishda parolni yangilash shart.
3. `/admin` sahifasida superadmin loginini va admin funksiyalarini qo'lda tekshirish.
4. Telegram xabarnomasi kerak bo'lsa `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni Vercel Production'ga qo'shib, qayta deploy qilish.

## GitHub

Repo: <https://github.com/m-muhammadbilol/Insa_education>

Supabase migratsiya kodi `master` branch'ga push qilingan (`0fc7d90`). Supabase schema SQL Editor'da muvaffaqiyatli bajarilgan.

## Vercel deploy holati — 2026-11-25

- Production Environment Variables'ga `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` va server-only `SUPABASE_SECRET_KEY` qo'shildi.
- Production redeploy `BDDVoZSaWi2jQ4CMynT7qjCpTyCZ` holati `Ready` bo'ldi.
- Sayt `https://insa-education.vercel.app/` va admin login `https://insa-education.vercel.app/admin` ochilishi ko'rildi.
- Supabase'da Super Admin akkaunti hali yaratilmagan. Lokal `.env.local` da Supabase qiymatlari yo'q; shuning uchun bootstrap skripti ishga tushirilmagan.
- Build `Ready` bo'ldi, ammo bu to'liq auth yoki ariza oqimini isbotlamaydi. Auth, ariza va Telegram oqimlarini Super Admin tayyor bo'lgandan so'ng tekshirish kerak.
