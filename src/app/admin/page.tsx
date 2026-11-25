"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { usernameToInternalEmail } from "@/lib/auth/username-mapping";
import { supabase, supabaseConfigured } from "@/lib/supabase/client";
import { profileFromRow } from "@/lib/supabase/mappers";
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setAuthError(null);

    if (!supabaseConfigured) {
      setAuthError(
        "Supabase sozlamalari hali kiritilmagan. Admin panelni ishga tushirish uchun Supabase URL va public key kerak."
      );
      setIsLoading(false);
      return;
    }

    try {
      const internalEmail = usernameToInternalEmail(data.username);

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: data.password,
      });
      if (signInError || !signInData.user) throw signInError || new Error("Kirish amalga oshmadi");

      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("uid", signInData.user.id)
        .maybeSingle();
      if (profileError || !profileRow) {
        throw new Error("Foydalanuvchi profili topilmadi.");
      }

      const profile = profileFromRow(profileRow);

      // 3. Check Account Status (Freeze Check)
      if (profile.status === "FROZEN") {
        await supabase.auth.signOut();
        setAuthError(
          "Hisobingiz vaqtincha muzlatilgan. Tizimdan foydalanish uchun bosh administratorga murojaat qiling."
        );
        setIsLoading(false);
        return;
      }

      // 4. Check Forced Password Change
      if (profile.mustChangePassword) {
        router.push("/admin/change-password");
        return;
      }

      // 5. Route based on role
      if (profile.role === "SUPER_ADMIN") {
        router.push("/admin/superadmin");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("[Login] Authentication error:", err);
      // Generic secure error message as specified by security requirements
      if (
        err.code === "invalid_credentials" ||
        err.code === "user_not_found" ||
        err.code === "invalid_grant"
      ) {
        setAuthError("Foydalanuvchi nomi yoki parol noto'g'ri kiritildi.");
      } else if (err.code === "user_banned") {
        setAuthError("Ushbu hisob tizimda faol emas (muzlatilgan).");
      } else if (err.code === "over_request_rate_limit" || err.code === "too_many_requests") {
        setAuthError("Urinishlar soni ko'payib ketdi. Iltimos, birozdan so'ng urinib ko'ring.");
      } else if (String(err.message || "").toLowerCase().includes("fetch")) {
        setAuthError(
          "Supabase serveriga ulanib bo'lmadi. Vercel'dagi Project URL va Publishable key bir xil Supabase loyihasidan ekanini tekshirib, deploy'ni qayta ishga tushiring. Bu parol xatosi bo'lmasligi mumkin."
        );
      } else {
        setAuthError(err.message || "Tizimga kirishda xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Back to Home Link */}
      <div className="mb-6 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-brand-900/5">
        
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="relative mx-auto h-14 w-14 rounded-2xl overflow-hidden shadow-md mb-3">
            <Image
              src="/assets/insa-mark-purple.svg"
              alt="INSA Education"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            INSA Education Portal
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Administrator va Super Administratorlar uchun yagona kirish nuqtasi
          </p>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="leading-relaxed font-medium">{authError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Foydalanuvchi nomi (Username)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="masalan: insa_admin"
                {...register("username")}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:border-brand-900 focus:ring-brand-100"
                }`}
              />
            </div>
            {errors.username && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Parol
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:border-brand-900 focus:ring-brand-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-900 py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-brand-900/10 hover:bg-brand-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-purple-200" />
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <span>Tizimga kirish</span>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
          Xavfsiz avtorizatsiya va seans nazorati ta'minlangan
        </div>
      </div>
    </div>
  );
}
