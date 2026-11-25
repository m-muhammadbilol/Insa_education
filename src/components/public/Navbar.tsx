"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Globe, ChevronDown, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("UZ");

  const navLinks = [
    { name: "Bosh sahifa", href: "#hero" },
    { name: "Kurslar", href: "#courses" },
    { name: "Natijalar", href: "#results" },
    { name: "Biz haqimizda", href: "#why-insa" },
    { name: "Aloqa", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/assets/insa-mark-photo.png"
              alt="INSA Education Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-brand-900 group-hover:text-brand-700 transition-colors">
              INSA
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase -mt-1">
              Education
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-700 hover:text-brand-900 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Tilni tanlash"
            >
              <Globe className="h-3.5 w-3.5 text-brand-800" />
              <span>{currentLang}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={() => {
                    setCurrentLang("UZ");
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between ${
                    currentLang === "UZ"
                      ? "text-brand-900 bg-brand-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>O'zbekcha</span>
                  {currentLang === "UZ" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-900" />
                  )}
                </button>
                <div
                  className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-400 flex items-center justify-between cursor-not-allowed"
                  title="Tez kunda qo'shiladi"
                >
                  <span>Русский</span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-mono">
                    tez kunda
                  </span>
                </div>
                <div
                  className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-400 flex items-center justify-between cursor-not-allowed"
                  title="Coming soon"
                >
                  <span>English</span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-mono">
                    soon
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <a
            href="#lead-form"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800 active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4 text-purple-200" />
            <span>Kursga yozilish</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#lead-form"
            className="inline-flex min-h-11 items-center rounded-lg bg-brand-900 px-4 text-xs font-semibold text-white"
          >
            Yozilish
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-brand-900"
            aria-label={mobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-800 hover:text-brand-900 py-1 border-b border-slate-50"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Til: O'zbekcha (Asosiy)</span>
              <Link
                href="/admin"
                className="text-xs text-slate-400 hover:text-brand-900 underline font-medium"
              >
                Xodimlar kirishi
              </Link>
            </div>
            <a
              href="#lead-form"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 py-3 text-center text-sm font-semibold text-white shadow"
            >
              <Sparkles className="h-4 w-4" />
              Kursga yozilish
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
