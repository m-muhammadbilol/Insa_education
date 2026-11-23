import React from "react";
import { Compass, Users, Clock, Award, Shield, Check, MapPin, Sparkles } from "lucide-react";

export default function WhyInsa() {
  const advantages = [
    {
      icon: MapPin,
      title: "Qulay Transport & Metro",
      description:
        "Toshkent shahrida Mirzo Ulug'bek metrosining qo'l yetarli masofasida joylashgan. Shaharning istalgan nuqtasidan qatnash uchun nihoyatda qulay.",
    },
    {
      icon: Users,
      title: "Kichik O'quv Guruhlari",
      description:
        "O'quvchilar soni cheklangan guruhlarda har bir talaba bilan o'qituvchining yakkama-yakka ishlashi va darsdagi faol ishtiroki ta'minlanadi.",
    },
    {
      icon: Compass,
      title: "Tizimli O'quv Rejasi",
      description:
        "Tashqi imtihon standartlariga to'liq javob beruvchi, xalqaro darsliklar va zamonaviy qo'llanmalar asosida tuzilgan oylik va haftalik dastur.",
    },
    {
      icon: Clock,
      title: "Muntazam Mock Sinovlari",
      description:
        "Haqiqiy imtihon atmosferasida o'tkaziladigan haftalik sinovlar orqali o'quvchi o'z o'sish dinamikasini aniq ko'rib boradi.",
    },
    {
      icon: Shield,
      title: "Akademik Mas'uliyat",
      description:
        "Dars qoldirishlar va uy vazifalarining bajarilishi qat'iy nazorat qilinadi. Ota-onalar bilan muntazam aloqa va hisobot o'rnatiladi.",
    },
    {
      icon: Sparkles,
      title: "Zamonaviy Jihozlangan Xonalar",
      description:
        "Yorug', keng va sifatli o'quv texnikalari bilan ta'minlangan qulay xonalarda dars olish samaradorlikni oshiradi.",
    },
  ];

  return (
    <section id="why-insa" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 mb-3 border border-brand-100">
            <span>Afzalliklarimiz</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nega aynan INSA Education?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Biz shunchaki dars o'tmaymiz — aniq natijaga yo'naltirilgan, har bir o'quvchining shaxsiy imkoniyatlarini ochuvchi o'quv muhitini yaratamiz.
          </p>
        </div>

        {/* 6 Advantages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-100 bg-white p-7 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Location Spotlight banner */}
        <div className="mt-14 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/70 via-white to-purple-50/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-white">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900">
                Mirzo Ulug'bek metrosiga yaqin joylashuv
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Markazimizga transport orqali kelish qulay, metro bekati piyoda 3-5 daqiqalik masofada.
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="shrink-0 rounded-xl bg-brand-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-800 transition-colors"
          >
            Xaritada ko'rish
          </a>
        </div>

      </div>
    </section>
  );
}
