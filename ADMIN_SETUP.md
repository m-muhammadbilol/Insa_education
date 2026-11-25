# Admin va Super Admin kirishini sozlash

Rasmdagi `auth/api-key-not-valid` xatosi Firebase Web API kaliti noto‘g‘ri yoki namuna qiymat ekanini bildiradi. Bu sababli tizim parolni Firebase’da tekshirish хүртэл хүрэхгүй.

## Firebase sozlamalari

1. Firebase Console’da loyihani oching: **Project settings → General → Your apps → Web app**.
2. Web ilova sozlamalaridagi qiymatlarni `.env.local` fayliga kiriting:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Firebase Authentication’da **Email/Password** kirish usulini yoqing.
4. Birinchi Super Admin va admin yaratish uchun shu loyihaning Firebase Admin SDK qiymatlarini ham `.env.local` ga kiriting: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. Maxfiy private key’ni GitHub’ga yuklamang.
5. Lokal serverni qayta ishga tushiring. So‘ng `npm run bootstrap` buyrug‘ini bir marta bajaring.

Lokal `.env.local` fayliga so‘ralgan `superadmin` username va paroli qo‘yildi. Bootstrap orqali yaratilgan Super Admin birinchi kirishda parolni yangilashi shart. Agar bazada allaqachon Super Admin bo‘lsa, bootstrap xavfsizlik uchun yangi hisob yaratmaydi.

Oddiy admin hisoblari ochiq ro‘yxatdan o‘tmaydi: Super Admin tizimga kirgach, **Adminlar** bo‘limidan yaratadi.

## Sayt hostingda turgan bo‘lsa

Vercel yoki boshqa hosting sozlamalarida yuqoridagi Firebase qiymatlarini **Environment Variables** bo‘limiga ham kiriting. `NEXT_PUBLIC_` bilan boshlanadigan qiymatlar build vaqtida ishlatiladi, shuning uchun ularni o‘zgartirgach saytni qayta deploy qiling. Server Admin SDK kalitlarini maxfiy environment variable sifatida saqlang.

## Kodga kiritilgan o‘zgarishlar

- Soxta demo Firebase qiymatlari olib tashlandi.
- Login sahifasida noto‘g‘ri yoki yo‘q API key uchun tushunarli xabar ko‘rsatiladi.
- Bootstrap yaratgan Super Admin birinchi kirishda vaqtinchalik parolni almashtiradi.