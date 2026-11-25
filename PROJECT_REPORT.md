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

## Ro'yxatdan o'tish oqimi haqida

- Ochiq sayt hozirda talabalar uchun login hisobini ochmaydi; kursga qabul bo'yicha ariza (`lead`) qabul qiladi. Arizalar `leads` jadvaliga saqlanadi.
- Admin va Super Admin bir xil CRM sahifasida `/admin/leads` orqali arizalarni ko'rishi va boshqarishi mumkin. Super Admin uchun qo'shimcha `/admin/superadmin/leads` manzili ham mavjud.
- Admin API'dagi 100 ta yozuv chegarasi sabab eski ko'rinish yangi arizalarning bir qismini yashirishi mumkin edi. API endi `limit`/`offset` va jami sonni qaytaradi; CRM sahifasi yozuvlarni 100 tadan yuklab, 10,000 gacha bo'lgan arizalarni ko'rsatadi.
- Rozilik checkbox'i bo'sh boshlanadi; ism/familiya serverda tekshirishdan oldin bo'sh joylardan tozalanadi.
- Telefon maydonlari mobil uchun raqam klaviaturasini va brauzer autofill'ini taklif qiladi.

## Xavfsizlik tekshiruvi

- Ma'lumotlar bazasi RLS bilan himoyalangan. Lead, audit va tarix jadvallarini brauzer bevosita o'qimaydi; server marshrutlari Supabase server secret bilan murojaat qiladi.
- CRM va Super Admin API'lari Supabase access tokenini tekshiradi; Super Admin amallari roli bo'yicha tekshiriladi. Secret kalit faqat serverda saqlanishi kerak, GitHub'ga qo'shilmasin.
- Admin API chaqiruvlari token muddati tugashiga yaqin yangilanadi va `401` bo'lsa bir marta yangilab qayta urinadi. Yangilab ham bo'lmasa sessiyani tozalab, qayta kirishni so'raydi.
- Ochiq ariza endpointidagi takroriy yuborish limiti xotirada saqlanadi. Serverless instansiyalar o'rtasida bu limit umumiy emas; jiddiy spamdan himoya uchun keyinchalik umumiy rate-limit xizmati yoki CAPTCHA qo'shish kerak.
- Ariza telefon raqami kabi shaxsiy ma'lumotlarni saqlaydi. Admin hisoblarida kuchli, alohida parol ishlatish va Supabase/Vercel secret qiymatlarini oshkor qilmaslik kerak.

## Keyingi qadamlar

1. Bu kod o'zgarishlarini GitHub `master` ga yuborish; Vercel avtomatik deploy qilsa yangi Production holatini tekshirish.
2. Deploy'dan keyin telefonda ariza jo'natib, Admin hamda Super Admin CRM sahifalarida ko'rinishini tekshirish.
3. Super Admin bilan audit sahifasini qayta ochib, sessiya xatosi tuzalganini tekshirish.
4. Telegram xabarnomasi kerak bo'lsa `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni Vercel Production'ga qo'shish.

## GitHub

Repo: <https://github.com/m-muhammadbilol/Insa_education>

Supabase migratsiya kodi `master` branch'ga push qilingan (`0fc7d90`). Supabase schema SQL Editor'da muvaffaqiyatli bajarilgan.

## Vercel deploy holati — 2026-11-25

- Production Environment Variables'ga `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` va server-only `SUPABASE_SECRET_KEY` qo'shildi.
- Production redeploy `BDDVoZSaWi2jQ4CMynT7qjCpTyCZ` holati `Ready` bo'ldi.
- Sayt `https://insa-education.vercel.app/` va admin login `https://insa-education.vercel.app/admin` ochilishi ko'rildi.
- Foydalanuvchi `npm.cmd run bootstrap` ni muvaffaqiyatli bajarganini yubordi; Supabase Super Admin hisobi yaratildi va birinchi kirishda vaqtinchalik parolni almashtirish kerak.
- 2026-11-25 kuni koddagi auth sessiya, CRM sahifalash, mobil ariza maydonlari va rozilik holati yangilandi. O'zgarishlar hali deploy'dan keyin amalda tekshirilmagan.
