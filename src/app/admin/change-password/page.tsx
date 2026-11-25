"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordInput } from "@/lib/validations/auth";
import { authenticatedFetch, getAccessToken, supabase } from "@/lib/supabase/client";
import { profileFromRow } from "@/lib/supabase/mappers";
import { UserProfile } from "@/lib/types/profile";
import { KeyRound, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let active = true;
    const loadProfile = async (uid: string | undefined) => {
      if (!uid) {
        router.push("/admin");
        return;
      }

      try {
        const { data: row, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("uid", uid)
          .maybeSingle();
        if (error) throw error;
        if (row) {
          const profile = profileFromRow(row);
          if (active) setCurrentUserProfile(profile);
          if (!profile.mustChangePassword) {
            // Already changed, route to appropriate dashboard
            router.push(profile.role === "SUPER_ADMIN" ? "/admin/superadmin" : "/admin/dashboard");
            return;
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsVerifying(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => loadProfile(data.session?.user.id));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session?.user.id);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Sessiya topilmadi. Qaytadan kiring.");
      }

      const res = await authenticatedFetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Parolni yangilashda xatolik yuz berdi");
      }

      setSuccess(true);
      setTimeout(() => {
        if (currentUserProfile?.role === "SUPER_ADMIN") {
          router.push("/admin/superadmin");
        } else {
          router.push("/admin/dashboard");
        }
      }, 1500);
    } catch (err: any) {
      setServerError(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-900" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-brand-900/5">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-3 border border-amber-200">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Parolni o'zgartirish talab qilinadi
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Hisobingiz xavfsizligi uchun vaqtinchalik parolni o'zingizning yangi shaxsiy parolingizga almashtiring.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center animate-in zoom-in-95">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
            <h4 className="font-bold text-emerald-900 text-sm">
              Parol muvaffaqiyatli yangilandi!
            </h4>
            <p className="text-xs text-emerald-700 mt-1">
              Boshqaruv paneliga yo'naltirilmoqdasiz...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Yangi Parol
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Kamida 8 belgi, katta harf va raqam"
                {...register("newPassword")}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.newPassword && (
                <p className="mt-1 text-xs text-rose-600">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Yangi Parolni Tasdiqlang
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Yangi parolni takrorlang"
                {...register("confirmPassword")}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-brand-800 disabled:opacity-60 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <span>Yangi parolni saqlash</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
