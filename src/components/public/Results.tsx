import React from "react";
import { Award, CheckCircle, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export default function Results() {
  // Demonstration sample cards, strictly labeled as Demo content as required
  const demoResults = [
    {
      id: 1,
      name: "Namuna O'quvchi 1",
      course: "IELTS Intensive",
      badge: "Namuna: 7.5 Ball",
      details: "Listening: 8.0 • Reading: 8.0 • Writing: 7.0 • Speaking: 7.0",
      description: "Haqiqiy sertifikatlar biznes ma'lumotlari tasdiqlangandan so'ng joylashtiriladi.",
    },
    {
      id: 2,
      name: "Namuna O'quvchi 2",
      course: "CEFR Multi-level",
      badge: "Namuna: B2 Daraja",
      details: "Davlat granti va oylik ustama olish imkoniyati",
      description: "Rasmiy baholash agentligi sertifikati namunasi.",
    },
    {
      id: 3,
      name: "Namuna O'quvchi 3",
      course: "Milliy Sertifikat",
      badge: "Namuna: A+ Daraja",
      details: "Ona tili va adabiyot fani bo'yicha 100% imtiyoz",
      description: "Abituriyentlar uchun imtiyozli ball ta'minlash namunasi.",
    },
  ];

  return (
    <section id="results" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 mb-3 border border-brand-100">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Natijalar formati</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            O'quvchilar natijalari ko'rgazmasi
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Ushbu bo'limda ta'lim markazining rasmiy sertifikatlari va tasdiqlangan o'quvchi natijalari joylashtiriladi.
          </p>

          {/* Mandatory Demo Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Namoyish rejimi:</strong> Quyidagi kartalar ko'rgazmali namuna sifatida keltirilgan. Haqiqiy o'quvchi natijalari markaz ma'muriyati tomonidan kiritiladi.
            </span>
          </div>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {demoResults.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 uppercase">
                    Demo Namuna
                  </span>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-brand-900 border border-purple-100">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white font-bold text-sm">
                    INSA
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                    <p className="text-xs text-brand-900 font-semibold">{item.course}</p>
                  </div>
                </div>

                <div className="my-4 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-700 border border-slate-100">
                  {item.details}
                </div>

                <p className="text-xs text-slate-500 italic">
                  "{item.description}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>INSA Education</span>
                <span>Toshkent</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner to join */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600 mb-4">
            Siz ham o'z orzuingizdagi sertifikatni qo'lga kiritishni xohlaysizmi?
          </p>
          <a
            href="#lead-form"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-800 transition-colors"
          >
            <span>Diagnostik testga yozilish</span>
          </a>
        </div>

      </div>
    </section>
  );
}
