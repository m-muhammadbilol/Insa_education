import React from "react";
import { MapPin, Send, Phone, Clock, ArrowUpRight, Navigation } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 border border-brand-100">
              <MapPin className="h-3.5 w-3.5" />
              <span>Biz bilan aloqa</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Savollaringiz bormi? <br className="hidden sm:inline" />
              Biz sizga yordam berishdan mamnunmiz
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Markazimizga bevosita tashrif buyuring yoki Telegram orqali mutaxassislarimiz bilan bog'laning.
            </p>

            {/* Contact details cards */}
            <div className="space-y-4 pt-2">
              
              {/* Location Card */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-900">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Manzilimiz</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mo'ljal: Mirzo Ulug'bek metro hududi, Toshkent
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Aniq ko'cha manzilini Telegram orqali tasdiqlang.
                  </span>
                </div>
              </div>

              {/* Telegram Card */}
              <a
                href="https://t.me/INSAadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Telegram Admin</h4>
                    <p className="text-xs text-sky-600 font-medium">@INSAadmin</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
              </a>

              {/* Instagram Card */}
              <a
                href="https://instagram.com/insa_education"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                    <InstagramIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Instagram Profil</h4>
                    <p className="text-xs text-pink-600 font-medium">@insa_education</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-pink-600 transition-colors" />
              </a>

              {/* Working Hours */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-900">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ish vaqti</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dushanba — Shanba: 09:00 dan 20:00 gacha
                  </p>
                  <span className="text-[11px] text-slate-400">Yakshanba: Dam olish kuni</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Clear location guidance */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-brand-900/5 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-900">
                  <Navigation className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-900">Manzil bo'yicha mo'ljal</p>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">Mirzo Ulug'bek metro hududi</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Saytda aniq ko'cha va uy raqami ko'rsatilmagan. Yo'lga chiqishdan oldin Telegram orqali aniq manzilni so'rang.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href="https://t.me/INSAadmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800"
                >
                  <Send className="h-4 w-4" />
                  <span>Aniq manzilni so'rash</span>
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=INSA+Education+Mirzo+Ulugbek+Tashkent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Google Maps'da qidirish</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
