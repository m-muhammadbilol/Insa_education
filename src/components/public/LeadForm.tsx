"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadInput, cleanPhoneNumber } from "@/lib/validations/lead";
import { CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck, PhoneCall } from "lucide-react";

interface LeadFormProps {
  initialCourse?: string;
}

export default function LeadForm({ initialCourse }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      primaryPhone: "+998 ",
      secondaryPhone: "",
      courseInterest: initialCourse || "IELTS",
      consent: false,
    },
  });

  const onSubmit = async (data: LeadInput) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(
          resData.message || "Arizani yuborishda xatolik yuz berdi. Qayta urinib ko'ring."
        );
      }

      setServerSuccess(resData.message);
      reset({
        firstName: "",
        lastName: "",
        primaryPhone: "+998 ",
        secondaryPhone: "",
        courseInterest: initialCourse || "IELTS",
        consent: false,
      });
    } catch (err: any) {
      setServerError(err.message || "Tarmoq xatosi. Iltimos aloqani tekshiring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="lead-form" className="relative w-full rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-brand-900/5">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-900 mb-2">
          <PhoneCall className="h-3.5 w-3.5 text-brand-700" />
          <span>Bepul konsultatsiya va darajani aniqlash</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Kursga qabul uchun ariza qoldiring
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Ma'lumotlaringizni qoldiring, administratorimiz 15 daqiqa ichida siz bilan bog'lanadi.
        </p>
      </div>

      {serverSuccess ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h4 className="text-lg font-bold text-emerald-900">
            Arizangiz qabul qilindi!
          </h4>
          <p className="mt-1.5 text-sm text-emerald-700 leading-relaxed">
            {serverSuccess}
          </p>
          <button
            onClick={() => setServerSuccess(null)}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Yana boshqa ariza yuborish
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Ismingiz <span className="text-rose-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                autoCapitalize="words"
                placeholder="Masalan: Sardor"
                {...register("firstName")}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:border-brand-900 focus:ring-brand-100"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-rose-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Familiyangiz <span className="text-rose-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                autoCapitalize="words"
                placeholder="Masalan: Aliyev"
                {...register("lastName")}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.lastName
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:border-brand-900 focus:ring-brand-100"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-rose-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="primaryPhone"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Asosiy telefon raqam <span className="text-rose-500">*</span>
              </label>
              <input
                id="primaryPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="next"
                placeholder="+998 90 123 45 67"
                {...register("primaryPhone")}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.primaryPhone
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:border-brand-900 focus:ring-brand-100"
                }`}
              />
              {errors.primaryPhone && (
                <p className="mt-1 text-xs text-rose-600">{errors.primaryPhone.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="secondaryPhone"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Qo'shimcha raqam <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
              </label>
              <input
                id="secondaryPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                enterKeyHint="done"
                placeholder="+998 99 765 43 21"
                {...register("secondaryPhone")}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
              />
              {errors.secondaryPhone && (
                <p className="mt-1 text-xs text-rose-600">{errors.secondaryPhone.message}</p>
              )}
            </div>
          </div>

          {/* Course Choice */}
          <div>
            <label
              htmlFor="courseInterest"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Qiziqtirgan kurs
            </label>
            <select
              id="courseInterest"
              {...register("courseInterest")}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            >
              <option value="IELTS">IELTS (Intensive & Standard)</option>
              <option value="CEFR">CEFR / Multi-level (B1, B2, C1)</option>
              <option value="Milliy sertifikat">Milliy Sertifikat (Ona tili / Matematika / Tarix)</option>
              <option value="Til kurslari">General English & Til kurslari</option>
              <option value="Fan kurslari">Aniq va tabiiy fanlar (Matematika, Fizika)</option>
            </select>
          </div>

          {/* Privacy Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("consent")}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-900 focus:ring-brand-900"
              />
              <span className="text-xs text-slate-600 leading-snug">
                Shaxsiy ma'lumotlarim ta'lim markazi xodimlari tomonidan qayta ishlanishiga va aloqaga chiqilishiga rozilik bildiraman.
              </span>
            </label>
            {errors.consent && (
              <p className="mt-1 text-xs text-rose-600">{errors.consent.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-brand-900/10 hover:bg-brand-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-purple-200" />
                <span>Yuborilmoqda...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-purple-200" />
                <span>Arizani tasdiqlash</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Ma'lumotlaringiz xavfsiz va uchinchi shaxslarga berilmaydi</span>
          </div>
        </form>
      )}
    </div>
  );
}
