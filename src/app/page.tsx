import React from "react";
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Courses from "@/components/public/Courses";
import WhyInsa from "@/components/public/WhyInsa";
import Results from "@/components/public/Results";
import Process from "@/components/public/Process";
import Testimonials from "@/components/public/Testimonials";
import FAQ from "@/components/public/FAQ";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Courses />
        <WhyInsa />
        <Results />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-[0_-4px_12px_rgba(15,23,42,0.06)] md:hidden">
        <a
          href="#lead-form"
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-900 px-4 text-sm font-bold text-white shadow-sm active:scale-[0.99]"
        >
          Bepul maslahatga yozilish
        </a>
      </div>
    </div>
  );
}
