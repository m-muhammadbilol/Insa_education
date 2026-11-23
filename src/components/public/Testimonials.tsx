import React from "react";
import { MessageSquareQuote, AlertCircle } from "lucide-react";

export default function Testimonials() {
  const demoTestimonials = [
    {
      id: 1,
      author: "Namuna Talaba",
      role: "IELTS kursi bitiruvchisi (Namuna)",
      quote:
        "O'qituvchilarning har bir darsdagi e'tibori va haftalik sinovlar imtihonga to'liq tayyor bo'lishimga yordam berdi.",
    },
    {
      id: 2,
      author: "Namuna Ota-ona",
      role: "O'quvchi onasi (Namuna)",
      quote:
        "Farzandimning dars qoldirmasdan qiziqish bilan qatnashi va markazdagi intizom bizni juda mamnun qildi.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 mb-3 border border-brand-100">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            <span>Fikr-mulohazalar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            O'quvchilar va Ota-onalar fikri
          </h2>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1 text-xs text-amber-800 border border-amber-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Ko'rgazmali namuna arxivi (Haqiqiy sharhlar integratsiya qilinmoqda)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {demoTestimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <p className="text-sm text-slate-600 italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-brand-900 font-semibold">{t.role}</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded">
                  DEMO
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
