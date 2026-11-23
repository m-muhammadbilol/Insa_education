import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, MapPin, Heart, Shield } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-14 pb-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/assets/insa-badge.svg"
                  alt="INSA Education Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-brand-900">
                  INSA
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase -mt-1">
                  Education
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              Toshkent shahrida IELTS, CEFR, Milliy sertifikat, til va fan kurslari bo'yicha sifatli, tizimli va ishonchli ta'lim markazi.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://t.me/INSAadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-brand-900 hover:text-brand-900 hover:bg-brand-50 transition-all"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/insa_education"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-brand-900 hover:text-brand-900 hover:bg-brand-50 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Bo'limlar
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#hero" className="hover:text-brand-900 transition-colors">
                  Bosh sahifa
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-brand-900 transition-colors">
                  Barcha kurslar
                </a>
              </li>
              <li>
                <a href="#why-insa" className="hover:text-brand-900 transition-colors">
                  Biz haqimizda
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-brand-900 transition-colors">
                  O'quvchilar natijalari
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-900 transition-colors">
                  Aloqa va manzil
                </a>
              </li>
            </ul>
          </div>

          {/* Courses links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Kurslar
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#courses" className="hover:text-brand-900 transition-colors">
                  IELTS Intensive
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-brand-900 transition-colors">
                  CEFR Multi-level
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-brand-900 transition-colors">
                  Milliy Sertifikat
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-brand-900 transition-colors">
                  Til kurslari
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-brand-900 transition-colors">
                  Fan kurslari
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Manzil & Portal
            </h4>
            <div className="space-y-3 text-xs text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-900 shrink-0 mt-0.5" />
                <span>Mirzo Ulug'bek metrosi yaqinida, Toshkent</span>
              </p>
              <p className="text-slate-500">
                Telegram: <span className="font-semibold text-slate-800">@INSAadmin</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-900 hover:underline"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Xodimlar & Admin kabineti</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} INSA Education. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 cursor-pointer">
              Maxfiylik siyosati
            </span>
            <span className="hover:text-slate-700 cursor-pointer">
              Foydalanish shartlari
            </span>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              v1.0 Demo
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
