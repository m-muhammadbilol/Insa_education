"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { UserProfile } from "@/lib/types/profile";
import {
  ShieldCheck,
  Users,
  Lock,
  FileText,
  AlertTriangle,
  ArrowRight,
  Loader2,
  KeyRound,
  Shield,
  Activity,
} from "lucide-react";

export default function SuperAdminOverviewPage() {
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/superadmin/admins", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Adminlar ro'yxatini yuklab bo'lmadi");
      }

      setAdmins(data.admins || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeAdmins = admins.filter((a) => a.status === "ACTIVE").length;
  const frozenAdmins = admins.filter((a) => a.status === "FROZEN").length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Banner with Clear Visual Distinction for Super Admin */}
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-900 via-brand-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-bold text-purple-200 border border-white/20 mb-3">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Super Administrator Xavfsizlik Portali</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Tizim Boshqaruv & Audit Markazi
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
                Barcha administratorlar hisoblari, xavfsizlik holati, sessiyalarni bekor qilish va audit yozuvlarini nazorat qiling.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 self-start sm:self-auto">
              <Link
                href="/admin/superadmin/admins"
                className="rounded-xl bg-white text-purple-900 px-4 py-2.5 text-xs font-bold shadow-md hover:bg-purple-50 transition-colors"
              >
                Adminlarni Boshqarish
              </Link>
              <Link
                href="/admin/superadmin/audit-logs"
                className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold border border-white/20 transition-colors"
              >
                Audit Tarixi
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-900" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            {error}
          </div>
        ) : (
          <>
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Jami Administratorlar
                  </span>
                  <Users className="h-5 w-5 text-brand-900" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {admins.length}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tizimda ro'yxatdan o'tgan barcha hisoblar
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm">
                <div className="flex items-center justify-between text-emerald-800 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Faol (ACTIVE)
                  </span>
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-900">
                  {activeAdmins}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Tizimga kirish huquqiga ega hisoblar
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm">
                <div className="flex items-center justify-between text-rose-800 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Muzlatilgan (FROZEN)
                  </span>
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="text-3xl font-black text-rose-900">
                  {frozenAdmins}
                </div>
                <p className="text-[11px] text-rose-700 mt-1">
                  Sessiyalari to'xtatilgan va bloklangan hisoblar
                </p>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/superadmin/admins"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-900 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand-900 transition-colors">
                  Administratorlarni Boshqarish &rarr;
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Yangi admin yaratish, vaqtinchalik parol berish, muzlatish yoki o'chirish.
                </p>
              </Link>

              <Link
                href="/admin/superadmin/audit-logs"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-900 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand-900 transition-colors">
                  Tizim Audit Jurnali &rarr;
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Barcha xavfsizlik hodisalari, muzlatishlar va admin amallari tarixini ko'rish.
                </p>
              </Link>

              <Link
                href="/admin/superadmin/leads"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-900 hover:shadow-md transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-brand-900 group-hover:bg-brand-900 group-hover:text-white transition-colors mb-4">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand-900 transition-colors">
                  Leadlar Nazorati &rarr;
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Super Admin huquqi bilan umumiy lead bazasini nazorat qilish va ko'rish.
                </p>
              </Link>
            </div>
          </>
        )}

      </div>
    </AdminLayout>
  );
}
