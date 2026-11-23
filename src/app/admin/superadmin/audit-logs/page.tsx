"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@/lib/firebase/client";
import { AuditLog } from "@/lib/types/audit";
import {
  FileText,
  Shield,
  Clock,
  RefreshCw,
  Loader2,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/superadmin/audit-logs?limit=100", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Audit jurnalini yuklab bo'lmadi");
      }

      setLogs(data.logs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE_ADMIN":
        return (
          <span className="bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded font-bold text-[10px]">
            CREATE_ADMIN
          </span>
        );
      case "FREEZE_ADMIN":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold text-[10px]">
            FREEZE_ADMIN
          </span>
        );
      case "UNFREEZE_ADMIN":
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]">
            UNFREEZE_ADMIN
          </span>
        );
      case "DELETE_ADMIN":
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded font-bold text-[10px]">
            DELETE_ADMIN
          </span>
        );
      case "RESET_PASSWORD":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold text-[10px]">
            RESET_PASSWORD
          </span>
        );
      case "UPDATE_LEAD_STATUS":
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold text-[10px]">
            UPDATE_LEAD_STATUS
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">
            {action}
          </span>
        );
    }
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchActor = log.actorUsername.toLowerCase().includes(term);
    const matchAction = log.action.toLowerCase().includes(term);
    const matchTarget = log.targetId.toLowerCase().includes(term);
    return matchActor || matchAction || matchTarget;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Tizim Audit Tarixi (Audit Logs)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Barcha xavfsizlik amallari, admin yaratish, muzlatish va o'zgarishlarning xavfsiz arxivi
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Yangilash</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Audit jurnali bo'yicha qidirish (admin nomi, amal turi, ID)..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
          />
        </div>

        {/* Audit Logs Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-900" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs text-rose-600">{error}</div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Audit jurnalida hech qanday yozuv topilmadi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Amal (Action)</th>
                    <th className="py-3.5 px-4">Bajaruvchi (Actor)</th>
                    <th className="py-3.5 px-4">Obyekt (Target)</th>
                    <th className="py-3.5 px-4">Qo'shimcha Ma'lumot</th>
                    <th className="py-3.5 px-4 text-right">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <strong className="text-slate-900">{log.actorUsername}</strong>{" "}
                        <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {log.targetType}: <span className="text-slate-900">{log.targetId.slice(0, 12)}...</span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                        {log.relevantMetadata ? (
                          <pre className="inline font-mono bg-slate-50 px-1.5 py-0.5 rounded text-[10px]">
                            {JSON.stringify(log.relevantMetadata)}
                          </pre>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString("uz-UZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
