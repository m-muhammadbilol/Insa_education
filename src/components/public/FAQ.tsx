import React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const faqs: FAQItem[] = [
    {
      question: "Darslar qayerda o'tiladi va qanday borish mumkin?",
      answer:
        "INSA Education o'quv markazi Toshkent shahrida Mirzo Ulug'bek metrosining yaqinida joylashgan. Metro bekati va avtobus bekatlaridan piyoda 3-5 daqiqada yetib kelish mumkin.",
    },
    {
      question: "Darsga yozilishdan oldin darajani tekshirib ko'rsa bo'ladimi?",
      answer:
        "Ha, albatta! Har bir o'quvchi uchun darajani aniqlovchi bepul test va metodist konsultatsiyasi tashkil etiladi. Shundan so'ng sizga eng mos darajadagi guruh taklif qilinadi.",
    },
    {
      question: "Guruhlarda nechta o'quvchi tahsil oladi?",
      answer:
        "Biz sifatni birinchi o'ringa qo'yamiz. Shu sababli o'quv guruhlarimiz kichik tarkibda shakllantiriladi, bu esa o'qituvchiga har bir talaba bilan individual shug'ullanish imkonini beradi.",
    },
    {
      question: "Mock imtihonlari har qancha vaqtda o'tkaziladi?",
      answer:
        "IELTS va CEFR o'quvchilari uchun har hafta to'liq formatdagi Mock sinovlari tashkil etiladi. Sinov natijalari o'qituvchi tomonidan chuqur tahlil qilinadi.",
    },
    {
      question: "Kurslarga qanday ro'yxatdan o'tish mumkin?",
      answer:
        "Saytimizdagi ariza formasini to'ldirishingiz yoki to'g'ridan-to'g'ri Telegram (@INSAadmin) orqali yozishingiz mumkin. Administratorimiz 15 daqiqa ichida siz bilan bog'lanib, barcha savollaringizga javob beradi.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 mb-3 border border-brand-100">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Savol-Javoblar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ko'p beriladigan savollar
          </h2>
          <p className="mt-3 text-base text-slate-600">
            O'qish jarayoni va ro'yxatdan o'tish bo'yicha eng muhim ma'lumotlar.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            return (
              <details
                key={idx}
                open={idx === 0}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <summary
                  className="flex min-h-14 cursor-pointer list-none items-center justify-between p-5 text-left marker:hidden hover:bg-slate-50/70 [&::-webkit-details-marker]:hidden"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180 group-open:text-brand-900"
                  />
                </summary>
                <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {faq.answer}
                </div>
              </details>
            );
          })}
        </div>

      </div>
    </section>
  );
}
