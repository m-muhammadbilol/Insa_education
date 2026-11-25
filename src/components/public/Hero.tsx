import React from "react";
import Image from "next/image";
import LeadForm from "./LeadForm";
import { MapPin, Award, CheckCircle, GraduationCap, ArrowRight, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle decorative purple glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Metro Location Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-900 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
              <MapPin className="h-3.5 w-3.5 text-brand-700" />
              <span>Mirzo Ulug'bek metrosi yaqinida • Toshkent</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Xalqaro imtihonlar va fanlarda{" "}
              <span className="text-brand-900 underline decoration-brand-200 decoration-wavy decoration-2">
                kafolatlangan bilim
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              <strong>INSA Education</strong> — IELTS, CEFR, Milliy sertifikat hamda chuqurlashtirilgan til va fan kurslarida tizimli yondashuv bilan maqsadlaringizga olib chiquvchi zamonaviy o'quv markazi.
            </p>

            {/* Key Advantages list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Kichik guruhlar va individual e'tibor</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Muntazam bepul Mock imtihonlari</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Qulay lokatsiya va zamonaviy xonalar</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Har haftalik o'zlashtirish tahlili</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-brand-300 hover:bg-brand-50/50 transition-all"
              >
                <BookOpen className="h-4 w-4 text-brand-800" />
                <span>Kurslarni ko'rish</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </a>

              <a
                href="https://t.me/INSAadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900 hover:text-brand-700 transition-colors"
              >
                <span>Telegram orqali savol berish (@INSAadmin)</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Application status */}
            <div className="pt-2 text-xs text-emerald-700 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Onlayn ariza qabul qilish ochiq</span>
            </div>
          </div>

          {/* Right Column: High-Converting Inline Lead Form */}
          <div className="lg:col-span-5">
            <LeadForm />
          </div>

        </div>
      </div>
    </section>
  );
}
