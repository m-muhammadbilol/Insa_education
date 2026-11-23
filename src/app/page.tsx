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
    <div className="flex min-h-screen flex-col bg-white">
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
    </div>
  );
}
