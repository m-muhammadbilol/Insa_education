"use client";

import React, { useState } from "react";
import { BookOpen, Award, CheckCircle2, Globe, Calculator, ArrowRight, Sparkles } from "lucide-react";

interface CourseItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  features: string[];
  level: string;
  icon: any;
}

export const courseList: CourseItem[] = [
  {
    id: "ielts",
    title: "IELTS Intensive & Standard",
    category: "Xalqaro imtihonlar",
    badge: "Eng talabgir",
    description:
      "IELTS imtihonining barcha 4 ta bo'limi (Listening, Reading, Writing, Speaking) bo'yicha maxsus strategiyalar va muntazam haftalik Mock imtihonlari.",
    features: [
      "Haftalik bepul Mock imtihonlari va chuqur tahlil",
      "Writing task 1 va task 2 shaxsiy feedback",
      "Speaking bo'yicha kundalik amaliy mashg'ulotlar",
      "Kichik guruhlarda darslar",
    ],
    level: "Intermediate dan 7.5+ gacha",
    icon: Award,
  },
  {
    id: "cefr",
    title: "CEFR / Multi-level",
    category: "Davlat attestatsiyasi",
    badge: "Rasmiy sertifikat",
    description:
      "Milliy baholash tizimi (DTM / Bilimni baholash agentligi) CEFR imtihoniga tayyorlov. B1, B2 va C1 darajalarini qisqa vaqtda qo'lga kiritish uchun.",
    features: [
      "Milliy test formati bo'yicha to'liq tayyorgarlik",
      "Grammatika va so'z boyligini tizimli oshirish",
      "Haqiqiy test savollari asosida mashqlar",
      "O'qituvchilar va abituriyentlar uchun maxsus guruhlar",
    ],
    level: "B1, B2, C1",
    icon: Globe,
  },
  {
    id: "milliy-sertifikat",
    title: "Milliy Sertifikat",
    category: "Oliy ta'limga kirish",
    badge: "100% Imtiyoz",
    description:
      "Ona tili va adabiyot, matematika, tarix hamda boshqa fanlar bo'yicha maksimal ball olishga mo'ljallangan ixtisoslashtirilgan o'quv kursi.",
    features: [
      "Davlat imtihonlarida maksimal ball olish metodikasi",
      "Mavzulashtirilgan testlar va murakkab masalalar yechimi",
      "Nazariya va amaliyotning uzviy uyg'unligi",
      "Ekspert repetitorlar bilan doimiy nazorat",
    ],
    level: "Barcha abituriyentlar uchun",
    icon: BookOpen,
  },
  {
    id: "til-kurslari",
    title: "Til Kurslari (General English)",
    category: "Umumiy ta'lim",
    badge: "Noldan boshlab",
    description:
      "Ingliz tili, rus tili va so'zlashuv mahoratini oshirish uchun noldan boshlab ravon muloqot darajasigacha bo'lgan bosqichma-bosqich dasturlar.",
    features: [
      "Interaktiv metodika va speaking klublar",
      "To'g'ri talaffuz va eshitib tushunish ko'nikmalari",
      "Zamonaviy darsliklar va multimedia resurslari",
      "Do'stona va rag'batlantiruvchi o'quv muhiti",
    ],
    level: "Beginner dan Advanced gacha",
    icon: Globe,
  },
  {
    id: "fan-kurslari",
    title: "Fan Kurslari (Aniq va Tabiiy fanlar)",
    category: "Maktab & Litsey",
    badge: "Chuqurlashtirilgan",
    description:
      "Matematika, fizika va boshqa fundamental fanlar bo'yicha maktab, litsey hamda xalqaro universitetlarga kirish uchun mustahkam poydevor.",
    features: [
      "Mantiqiy fikrlash va masalalar yechish mahorati",
      "Individual yondashuv va bo'shliqlarni to'ldirish",
      "Olimpiada va ixtisoslashtirilgan maktablarga tayyorlov",
      "Muntazam test sinovlari",
    ],
    level: "5-11 sinflar va abituriyentlar",
    icon: Calculator,
  },
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  return (
    <section id="courses" className="py-16 sm:py-24 bg-slate-50/60 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/70 px-3.5 py-1 text-xs font-bold text-brand-900 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>O'quv yo'nalishlari</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Maqsadingizga mos kursni tanlang
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Har bir kurs o'quvchining boshlang'ich darajasiga moslashtirilgan zamonaviy o'quv rejasi va doimiy tahlil tizimi bilan olib boriladi.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {courseList.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <div>
                  {/* Top Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-brand-900 border border-purple-100">
                      {course.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-brand-900 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {course.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                    {course.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Daraja:</span>
                    <span className="font-semibold text-slate-800">{course.level}</span>
                  </div>

                  <a
                    href="#lead-form"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-brand-900 hover:text-white py-2.5 px-4 text-xs font-bold text-slate-800 transition-colors"
                  >
                    <span>Ushbu kursga yozilish</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Transparency Note */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 text-center text-xs text-slate-500 max-w-2xl mx-auto shadow-sm">
          💡 <strong>Eslatma:</strong> Kurs narxi va davomiyligi o'quvchining dastlabki diagnostika darajasi hamda guruh turiga (standart yoki intensiv) qarab belgilanadi. Aniq ma'lumot uchun bepul sinov darsiga yoziling.
        </div>

      </div>
    </section>
  );
}
