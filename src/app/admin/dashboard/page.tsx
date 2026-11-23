"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { Lead } from "@/lib/types/lead";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import {
  Users,
  UserPlus,
  PhoneCall,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Loader2,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/admin/leads?limit=100", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Leadlarni yuklab bo'lmadi");
      }

      setLeads(data.leads || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Real Database Statistics Computed Directly
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "NEW").length;
  const contactedLeads = leads.filter((l) => l.status === "CONTACTED").length;
  const interestedLeads = leads.filter((l) => l.status === "INTERESTED").length;
  const enrolledLeads = leads.filter((l) => l.status === "ENROLLED").length;
  const notInterestedLeads = leads.filter((l) => l.status === "NOT_INTERESTED").length;

  const statCards = [
    {
      title: "Jami Arizalar",
      count: totalLeads,
      icon: Users,
      color: "text-slate-900",
      bg: "bg-white",
      border: "border-slate-200",
      pillBg: "bg-slate-100",
    },
    {
      title: "Yangi (Kutilayotgan)",
      count: newLeads,
      icon: UserPlus,
      color: "text-blue-700",
      bg: "bg-blue-50/50",
      border: "border-blue-200",
      pillBg: "bg-blue-100",
    },
    {
      title: "Bog'lanildi",
      count: contactedLeads,
      icon: PhoneCall,
      color: "text-amber-700",
      bg: "bg-amber-50/50",
      border: "border-amber-200",
      pillBg: "bg-amber-100",
    },
    {
      title: "Qiziqish Bildirdi",
      count: interestedLeads,
      icon: TrendingUp,
      color: "text-brand-900",
      bg: "bg-purple-50/50",
      border: "border-purple-200",
      pillBg: "bg-purple-100",
    },
    {
      title: "O'qishga Qabul Qilindi",
      count: enrolledLeads,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50/50",
      border: "border-emerald-200",
      pillBg: "bg-emerald-100",
    },
    {
      title: "Rad Etildi / Bekor",
      count: notInterestedLeads,
      icon: XCircle,
      color: "text-rose-700",
      bg: "bg-rose-50/50",
      border: "border-rose-200",
      pillBg: "bg-rose-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Boshqaruv Paneli
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Markazga kelib tushayotgan arizalar va talabalar oqimining real statistikasi
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-800 transition-colors self-start sm:self-auto"
          >
            <span>Leadlar CRM jadvaliga o'tish</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-900" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
            {error}
          </div>
        ) : (
          <>
            {/* Real Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {statCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border ${card.border} ${card.bg} p-6 shadow-sm transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {card.title}
                      </span>
                      <div className={`p-2 rounded-xl ${card.pillBg}`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        {card.count}
                      </span>
                      <span className="text-xs text-slate-500">ta ariza</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Leads Preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Eng so'nggi arizalar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Baza bo'yicha eng oxirgi kelib tushgan arizalar
                  </p>
                </div>
                <Link
                  href="/admin/leads"
                  className="text-xs font-bold text-brand-900 hover:underline"
                >
                  Barchasini ko'rish ({totalLeads})
                </Link>
              </div>

              {leads.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Hozircha hech qanday ariza kelib tushmagan.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-y border-slate-100">
                      <tr>
                        <th className="py-3 px-4">F.I.O</th>
                        <th className="py-3 px-4">Telefon</th>
                        <th className="py-3 px-4">Kurs</th>
                        <th className="py-3 px-4">Holat</th>
                        <th className="py-3 px-4">Vaqt</th>
                        <th className="py-3 px-4 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {lead.firstName} {lead.lastName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            <a
                              href={`tel:${lead.primaryPhone}`}
                              className="text-brand-900 font-semibold hover:underline"
                            >
                              {lead.primaryPhone}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {lead.courseInterest || "Ko'rsatilmagan"}
                          </td>
                          <td className="py-3.5 px-4">
                            <LeadStatusBadge status={lead.status} />
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(lead.createdAt).toLocaleDateString("uz-UZ")}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href="/admin/leads"
                              className="font-bold text-brand-900 hover:text-brand-700"
                            >
                              Ochish &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </AdminLayout>
  );
}
