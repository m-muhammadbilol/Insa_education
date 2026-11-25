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

1. Supabase loyihasini tanlash yoki yaratish va `supabase/schema.sql` ni SQL Editor'da bajarish.
2. `.env.example` dagi kerakli qiymatlarni lokal muhitga va Vercel Environment Variables'ga kiritish.
3. Bootstrap skripti bilan dastlabki Super Adminni yaratish.
4. Vercel deploy'dan keyin admin login, lead yuborish, admin boshqaruvi va Telegram xabarnomasini tekshirish.
5. O'zgarishlarni tekshirib, so'ng GitHub'ga commit/push qilish.

## GitHub

Repo: <https://github.com/m-muhammadbilol/Insa_education>

Koddagi o'zgarishlar va hujjatlar hali ko'rib chiqilib, tekshirilishi kerak. Yangi deploy tasdiqlangan deb hisoblanmaydi.
