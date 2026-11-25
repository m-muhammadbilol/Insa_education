"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { authenticatedFetch, supabase } from "@/lib/supabase/client";
import { profileFromRow } from "@/lib/supabase/mappers";
import { ArrowLeft, CheckCircle2, Loader2, UserRound } from "lucide-react";

export default function SuperAdminProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("uid", session.user.id)
        .maybeSingle();

      if (profileError || !data) {
        if (active) setError("Profil ma'lumotini yuklab bo'lmadi.");
      } else {
        const profile = profileFromRow(data);
        if (profile.role !== "SUPER_ADMIN") {
          router.replace("/admin/dashboard");
          return;
        }
        if (active) setUsername(profile.username);
      }
      if (active) setLoading(false);
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, [router]);

  const saveUsername = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await authenticatedFetch("/api/superadmin/profile/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Username'ni o'zgartirib bo'lmadi.");
      }

      setUsername(data.username);
      setCurrentPassword("");
      setMessage(data.message);
      await supabase.auth.refreshSession();
    } catch (saveError: any) {
      setError(
        saveError.message === "Failed to fetch"
          ? "Serverga ulanib bo'lmadi. Internetni va Vercel deploy holatini tekshiring."
          : saveError.message || "Username'ni o'zgartirishda xatolik yuz berdi."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl space-y-5">
        <Link
          href="/admin/superadmin"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Super Admin paneliga qaytish
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-brand-900">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Super Admin profili</h1>
              <p className="text-sm text-slate-500">Username'ni xavfsiz yangilang.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-32 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-brand-900" />
            </div>
          ) : (
            <form onSubmit={saveUsername} className="space-y-4">
              {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
              {message && (
                <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {message}
                </p>
              )}

              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-bold text-slate-700">
                  Yangi username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  minLength={3}
                  maxLength={30}
                  pattern="[A-Za-z0-9_.-]+"
                  required
                  className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:text-sm"
                />
                <p className="mt-1.5 text-xs text-slate-500">3–30 belgi: harflar, sonlar, nuqta, chiziqcha yoki _.</p>
              </div>

              <div>
                <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-bold text-slate-700">
                  Hozirgi parol bilan tasdiqlang
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                  className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={saving || loading}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-4 text-sm font-bold text-white hover:bg-brand-800 disabled:opacity-60 sm:w-auto sm:min-w-48"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saqlanmoqda..." : "Username'ni saqlash"}
              </button>
            </form>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
