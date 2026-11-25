"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Bosh sahifa", href: "#hero" },
    { name: "Kurslar", href: "#courses" },
    { name: "Natijalar", href: "#results" },
    { name: "Biz haqimizda", href: "#why-insa" },
    { name: "Aloqa", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/assets/insa-mark-purple.svg"
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
          {/* Primary CTA */}
          <a
            href="#lead-form"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-800"
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
