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
- Admin API'da sahifalash bor. CRM ochilganda bitta so'rov bilan birinchi 100 ariza yuklanadi; qolganlari `Yana 100 ta ariza` tugmasi bilan kerak bo'lganda olinadi.
- Rozilik checkbox'i bo'sh boshlanadi; ism/familiya serverda tekshirishdan oldin bo'sh joylardan tozalanadi.
- Telefon maydonlari mobil uchun raqam klaviaturasini va brauzer autofill'ini taklif qiladi.
- Telefon navigatsiyasida katta bosish maydonlari, screen reader uchun menyu holati va doim ko'rinadigan pastki ariza tugmasi bor; forma maydonlari iPhone'da avtomatik zoom bo'lmasligi uchun kattalashtirildi.
- Anchor tugmalarni bosganda sahifa darhol kerakli bo'limga o'tadi; global sekin smooth scroll olib tashlandi.
- 1 MB atrofidagi PNG logotip kichik SVG logotip bilan almashtirildi, FAQ va kurslar interaktivligi native HTML/server renderga o'tkazilib client JavaScript yuklamasi kamaytirildi.
- Ishlamaydigan til tanlash dropdown'i olib tashlandi (sayt faqat o'zbekcha tarjimaga ega edi); keraksiz blur effektlari ham olib tashlandi.
- Production build hisobotida bosh sahifa route JavaScript hajmi 11.1 KB dan 6.57 KB ga, birinchi yuklanish JavaScript jami 147 KB dan 142 KB ga tushdi.
- Ishlab turgan lead API arizani bazaga yozadi, rozilikni serverda tekshiradi, keyin Telegram xabarini imkon bo'lsa yuboradi. Jonli saytda yangi test arizasi yuborilmadi, shuning uchun Production end-to-end qabul tasdiqlanmadi.

## Admin parolini boshqarish

- Barcha adminlar va Super Admin uchun panel navigatsiyasida `Parolni o'zgartirish` sahifasi bor.
- Oddiy parol yangilashda server joriy parolni Supabase Auth bilan tekshiradi; birinchi kirishdagi vaqtinchalik parolni almashtirish esa yaroqli login sessiyasi bilan bajariladi.
- Yangi parol audit jurnaliga yoziladi (parolning o'zi hech qachon log'ga qo'shilmaydi).

## Admin kirish va profil xatolari — 2026-11-25

- `Failed to fetch` login/parol noto'g'ri degani bo'lmasligi mumkin; Supabase serveriga ulanish xatosi sifatida aniq ko'rsatma qo'shildi. Lokal `.env.local` da URL formati HTTPS/Supabase domeniga mos va public key mavjud; Vercel Production qiymatlarini bu sessiyada ko'rib bo'lmadi. Agar xabar yana chiqsa, Vercel'dagi URL va Publishable key aynan bir Supabase loyihasiga qarashini tekshirib, qayta deploy qilish kerak.
- Admin yaratish formasida vaqtinchalik parol kamida 8 belgidan bo'lishi oldindan tekshiriladi, parol yozilayotganda yashiriladi va ulanish xatosi uchun aniqroq xabar ko'rsatiladi.
- Super Admin `/admin/superadmin/profile` sahifasida username'ni almashtira oladi. Amalda hozirgi parolni tasdiqlaydi; Auth email, `profiles` username va audit jurnali birga yangilanadi.
- Parol sahifasiga rolga mos qaytish havolasi qo'shildi; mobil admin menyusida asosiy saytga qaytish havolasi bor.
- Kontakt bo'limidagi tasdiqlanmagan metro chizmasi, masofa va vaqt olib tashlandi. O'rniga hozir ma'lum bo'lgan mo'ljal, aniq manzilni Telegram'dan so'rash va Google Maps qidiruvi qo'yildi.
- Skrinshotda vaqtinchalik parol ochiq ko'ringan edi. O'sha parolni yangisiga almashtirish kerak; u hisobotga yoki log'larga ko'chirilmadi.

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
- 2026-11-25: auth sessiyasi, CRM sahifalash, mobil UI, rozilik va Super Admin parolni mustaqil o'zgartirishi yangilandi.
- Tekshiruv: `npm.cmd run test:verify` — 7/7 ssenariy o'tdi; `npm.cmd run build` — production build muvaffaqiyatli. Jonli Vercel ariza yuborish oqimi qo'lda sinovdan o'tkazilmadi.


- Tekshiruvdan keyingi natija: `npm.cmd run build` muvaffaqiyatli (15 route prerender qilindi); `npm.cmd run test:verify` — 7/7 ssenariy o'tdi; `git diff --check` xatosiz yakunlandi.

## Yangi ariza bildirishnomasi, logo va admin kirishi — 2026-11-25

- Admin va Super Admin menyusidagi `Leadlar Ro'yxati (CRM)` yonida holati `NEW` bo'lgan arizalar soni chiqadi: 1, 2 yoki 3+ (3 va undan ko'p). Panel ochiq turganda sanog'i 15 soniyada va sahifaga qaytilganda qayta olinadi.
- Hozirgi mahsulotda alohida `USER` login/roli mavjud emas: tashrifchi ariza yuboradi va tasdiq oladi. Jonli ariza badge'i tizimdagi real hisoblar — `ADMIN` hamda `SUPER_ADMIN` uchun ishlaydi.
- Login, bosh sahifa, footer, admin menyu va favicon'da chizib olingan, yuborilgan logoga mos kelmaydigan SVG belgisi yuborilgan logotipning `insa-mark-photo.png` rasmiga almashtirildi; rasmiy belgi ekranda tiniqroq ko'rinadi.
- Birinchi kirishdagi vaqtinchalik parolni almashtirgach brauzer yangi parol bilan sessiyani qayta ochadi va foydalanuvchini Admin yoki Super Admin paneliga olib kiradi. Qayta ro'yxatdan o'tish talab qilinmaydi.
- Login ostida `Parolni unutdingizmi?` havolasi qo'shildi. Username yuborilganda, mos faol Admin uchun Telegram sozlangan umumiy admin chatiga tiklash so'rovi boradi. Javob username bor-yo'qligini oshkor qilmaydi. Super Admin mavjud `Adminlarni boshqarish` sahifasida vaqtinchalik parol o'rnatadi.
- Xavfsizlik: reset xabari parolni o'z ichiga olmaydi. Vaqtinchalik parol Telegramga jo'natilmasin; Super Admin uni ishonchli shaxsiy kanal orqali adminning o'ziga yetkazib, birinchi kirishda yangilashni talab qilsin.
- Telegram bildirishnomasi ishlashi uchun Vercel Production'da `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` sozlangan bo'lishi kerak. Bu sessiyada Vercel sozlamalari ko'rilmadi.
- Tekshiruv: `npm.cmd run build` muvaffaqiyatli; yangi reset sahifasi va API marshrutlari production build'ga kirdi. Jonli Vercel/Telegram end-to-end reset sinovi bu yerden bajarilmadi.

## Sinov arizalarini tozalash va Super Admin o'chirish nazorati — 2026-11-25

- Foydalanuvchining aniq iltimosiga binoan Supabase `leads` jadvali tekshirildi: 3 ta sinov arizasi bor edi. Uchchalasi o'chirildi va qayta sanalganda 0 ta qoldi. Bog'langan `lead_status_history` yozuvlari FK `ON DELETE CASCADE` bilan o'chdi; `profiles` va avvalgi audit yozuvlari saqlandi.
- Super Admin CRM yo'li `/admin/superadmin/leads` dagi yopiq `Xavfli amallar` bo'limida barcha arizalarni tozalash boshqaruvi bor. Ishlatishdan oldin `BARCHA ARIZALARNI O'CHIRISH` iborasini qo'lda kiritish kerak; amal audit jurnaliga yoziladi.
- Bitta arizani o'chirish ham faqat Super Admin CRM yo'lida ko'rinadi: avval ariza tafsilotlarini ochish, so'ng alohida tasdiqlash oynasida tasdiqlash kerak. `ADMIN` roli API darajasida ham rad etiladi. Har bir o'chirish auditga yoziladi; bog'liq status tarixi cascade orqali ketadi.
- Vaqtinchalik parol oynasi ochilganda endi tasodifiy parol avtomatik yaratilmaydi. Yangi parolni alohida tugma bilan yaratish, so'ng aynan `Parolni Yangilash` tugmasini bosish kerak; X/Yopish/Bekor qilish tugmalari API'ga murojaat qilmaydi. Parol generatori `crypto.getRandomValues` ishlatadi.
- Freeze/reset API'lardagi noto'g'ri `auth.admin.signOut(userId, "global")` chaqiruvi olib tashlandi: bu metod user UUID emas, JWT talab qiladi. Muzlatilgan hisobning himoyalangan API so'rovlari profil statusi orqali rad etiladi. Resetdan keyin `must_change_password=true` bo'ladi va parolini yangilamaguncha boshqa API marshrutlari bloklanadi.
- Brauzerdagi token yordamchisi JWT uch segmentli ekanini tekshiradi; noto'g'ri yoki eskirgan token bo'lsa session refresh qiladi, refresh ham yaroqsiz bo'lsa lokal sessiyani tozalab, qayta kirish xabarini beradi. Bu muzlatish oynasidagi `invalid JWT` xatosini bartaraf etadi.
- Tekshiruv: `npm.cmd run build` muvaffaqiyatli; yangi Super Admin ariza o'chirish API'lari build marshrutlarida mavjud. `git diff --check` xatosiz.

## CRM jadvalining tor ekranlarga moslanishi — 2026-11-25

- Tor oynalarda CRM jadvali kengligi sabab ustunlar ekran chetidan kesilib qolmasligi uchun xl breakpoint'gacha jadval o'rniga mobil kartalar ko'rsatiladi. Kartalarda ism, kurs, ariza sanasi, bosiladigan telefon, status tanlash, izoh va tafsilot amallari bor.
- Keng ekranlarda mavjud to'liq jadval ko'rinishi saqlandi; u o'z konteynerida gorizontal suriladi.
- Admin asosiy kontentiga `min-w-0` va gorizontal overflow cheklovi qo'shildi, qidiruv/filter maydonlari mobil kengligiga mos va iPhone'da avtomatik zoom bo'lmaydigan kattalikda qilindi.
- Tekshiruv: production build bajarildi.
