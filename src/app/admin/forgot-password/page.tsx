"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, ShieldQuestion } from "lucide-react";

function ForgotPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState(params.get("username") || "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "So'rov yuborilmadi.");
      setMessage(data.message);
    } catch (error: any) {
      setMessage(error.message || "Internet bilan bog'lanib bo'lmadi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <Link href="/admin" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-900">
          <ArrowLeft className="h-4 w-4" /> Kirish sahifasiga qaytish
        </Link>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-brand-900"><ShieldQuestion /></div>
        <h1 className="text-xl font-black text-slate-900">Parolni tiklash so'rovi</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Username'ingizni kiriting. Super Admin so'rovni oladi va siz uchun vaqtinchalik parol o'rnatadi.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label htmlFor="reset-username" className="block text-xs font-bold uppercase text-slate-700">Username</label>
          <input id="reset-username" autoComplete="username" required minLength={3} maxLength={30} value={username} onChange={(event) => setUsername(event.target.value)} className="min-h-12 w-full rounded-xl border border-slate-200 px-4 text-base text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          <button disabled={pending} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 text-sm font-bold text-white disabled:opacity-60">
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda...</> : "Tiklash so'rovini yuborish"}
          </button>
        </form>
        {message && <div role="status" className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>}
        <p className="mt-5 text-xs leading-5 text-slate-500">Parol hech qachon Telegram bildirishnomasiga qo'shilmaydi. Bot sozlangan bo'lsa, Super Admin username'ingiz bilan so'rov xabarini oladi. Vaqtinchalik parolni Super Admin bilan xavfsiz, shaxsiy aloqa orqali oling.</p>
      </section>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-50" />}><ForgotPasswordForm /></Suspense>;
}
