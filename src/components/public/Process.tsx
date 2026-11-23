import React from "react";
import { ClipboardCheck, Route, BookOpenCheck, Trophy, ArrowRight } from "lucide-react";

export default function Process() {
  const steps = [
    {
      step: "01",
      icon: ClipboardCheck,
      title: "Bepul Daraja Aniqlash",
      description:
        "O'quv markazimizga tashrif buyurib yoki onlayn tarzda maxsus test topshirasiz. Biz sizning joriy bilim darajangiz va bo'shliqlaringizni aniqlaymiz.",
    },
    {
      step: "02",
      icon: Route,
      title: "Shaxsiy O'quv Rejasi",
      description:
        "Maqsadingiz va imtihon topshirish muddatiga ko'ra sizga mos guruh va haftalik o'quv traektoriyasi shakllantiriladi.",
    },
    {
      step: "03",
      icon: BookOpenCheck,
      title: "Intensiv Mashg'ulotlar",
      description:
        "Interaktiv darslar, uy vazifalari tahlili, so'zlashuv amaliyoti va haftalik Mock imtihonlari orqali natijangizni bosqichma-bosqich o'stirasiz.",
    },
    {
      step: "04",
      icon: Trophy,
      title: "Muvaffaqiyatli Natija",
      description:
        "Rasmiy imtihonda yuqori ball va sertifikatni qo'lga kiritib, nufuzli oliygohlarga kirish yoki ish faoliyatingizda yangi pog'onaga chiqasiz.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 mb-3 border border-brand-100">
            <span>O'qish bosqichlari</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ta'lim jarayoni qanday kechadi?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Birinchi kundanoq aniq tizim va bosqichli reja asosida harakatlanasiz.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-brand-200 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-900/30">
                      {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-900">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
