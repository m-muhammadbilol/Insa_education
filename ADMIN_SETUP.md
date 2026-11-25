# Supabase + Vercel sozlamalari

## 1. Supabase loyihasini tayyorlash

Supabase loyihasida **SQL Editor**ni ochib, repo ichidagi `supabase/schema.sql` fayl mazmunini bir marta ishga tushiring. Bu admin profillari, leadlar va audit jadvallarini hamda kerakli RLS qoidalarini yaratadi.

Supabase Dashboard → **Project Settings → API Keys** bo‘limidan quyidagilarni oling:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Secret key → `SUPABASE_SECRET_KEY`

Secret key faqat serverda ishlatiladi. Uni `NEXT_PUBLIC_` bilan boshlamang, GitHub’ga yoki chatga yubormang.

## 2. Vercel sozlamalari

Vercel project → **Settings → Environment Variables** ichida uchta Supabase qiymatini Production uchun saqlang. Zarur bo‘lsa Preview muhitini ham qo‘shing. So‘ng yangi deployment yarating.

## 3. Birinchi Super Admin

Lokal `.env.local` fayliga Supabase URL, publishable key, secret key hamda quyidagilarni qo‘ying:

```env
BOOTSTRAP_SUPERADMIN_USERNAME=superadmin
BOOTSTRAP_SUPERADMIN_PASSWORD=superadmin
```

Loyiha papkasida `npm run bootstrap` buyrug‘ini bir marta bajaring. U Supabase Auth’da tasdiqlangan login foydalanuvchisini va `profiles` jadvalida `SUPER_ADMIN` profilini yaratadi. Birinchi muvaffaqiyatli kirishda yangi parol o‘rnatish talab qilinadi.

## 4. Ma'lumotlarni ko‘chirish

`schema.sql` yangi va bo‘sh Supabase jadvallarini yaratadi. Firebase’dagi eski profillar, arizalar, izohlar va audit yozuvlari o‘z-o‘zidan ko‘chmaydi. Ularni ko‘chirishdan avval qaysi ma’lumotlar va qaysi Supabase loyihasiga o‘tishini alohida tasdiqlash kerak.
