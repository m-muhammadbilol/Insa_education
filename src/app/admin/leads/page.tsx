"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { authenticatedFetch, getAccessToken, supabase } from "@/lib/supabase/client";
import { Lead, LeadStatus } from "@/lib/types/lead";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import {
  Search,
  Filter,
  Phone,
  PhoneCall,
  FileEdit,
  Eye,
  RefreshCw,
  Loader2,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  Sparkles,
  Trash2,
  ShieldAlert,
} from "lucide-react";

export default function AdminLeadsPage() {
  const pathname = usePathname();
  const isSuperAdminLeadsPage = pathname === "/admin/superadmin/leads";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreLeads, setHasMoreLeads] = useState(false);
  const [nextOffset, setNextOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Selected lead for Notes Modal
  const [editingNotesLead, setEditingNotesLead] = useState<Lead | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Selected lead for Details Modal
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeletePhrase, setBulkDeletePhrase] = useState("");
  const [deletingAllLeads, setDeletingAllLeads] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return;
      const { data } = await supabase.from("profiles").select("role").eq("uid", session.user.id).maybeSingle();
      if (active) setIsSuperAdmin(data?.role === "SUPER_ADMIN");
    })();
    return () => { active = false; };
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      setLeads([]);
      setHasMoreLeads(false);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      const url =
        statusFilter === "ALL"
          ? "/api/admin/leads?limit=100&offset=0"
          : `/api/admin/leads?status=${statusFilter}&limit=100&offset=0`;
      const res = await authenticatedFetch(url);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Leadlarni yuklashda xatolik yuz berdi");
      }

      const firstBatch = data.leads || [];
      setLeads(firstBatch);
      setHasMoreLeads(Boolean(data.hasMore));
      setNextOffset(firstBatch.length);
      setPage(1);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreLeads = async () => {
    if (loadingMore || !hasMoreLeads) return;

    try {
      setLoadingMore(true);
      setError(null);
      const url = new URL("/api/admin/leads", window.location.origin);
      url.searchParams.set("limit", "100");
      url.searchParams.set("offset", String(nextOffset));
      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);

      const res = await authenticatedFetch(url);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Keyingi arizalarni yuklab bo'lmadi");
      }

      const batch = data.leads || [];
      setLeads((current) => [...current, ...batch]);
      setNextOffset((offset) => offset + batch.length);
      setHasMoreLeads(Boolean(data.hasMore));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );

      const res = await authenticatedFetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Holatni yangilashda xatolik");
      }
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
      fetchLeads(); // rollback
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesLead) return;

    try {
      setSavingNotes(true);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      const res = await authenticatedFetch(`/api/admin/leads/${editingNotesLead.id}/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ notes: notesValue }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Izohni saqlashda xatolik");
      }

      // Update state
      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingNotesLead.id ? { ...l, internalNotes: notesValue } : l
        )
      );

      setEditingNotesLead(null);
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      setDeletingLead(true);
      const response = await authenticatedFetch(`/api/superadmin/leads/${leadToDelete.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Arizani o'chirib bo'lmadi.");
      setLeads((current) => current.filter((lead) => lead.id !== leadToDelete.id));
      setViewingLead(null);
      setDeleteMessage("Ariza o'chirildi.");
      setLeadToDelete(null);
    } catch (error: any) {
      setDeleteMessage(error.message || "Arizani o'chirib bo'lmadi.");
    } finally {
      setDeletingLead(false);
    }
  };

  const handleDeleteAllLeads = async () => {
    if (bulkDeletePhrase !== "BARCHA ARIZALARNI O'CHIRISH") return;
    try {
      setDeletingAllLeads(true);
      const response = await authenticatedFetch("/api/superadmin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmPhrase: bulkDeletePhrase }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Arizalarni tozalab bo'lmadi.");
      setLeads([]);
      setHasMoreLeads(false);
      setNextOffset(0);
      setPage(1);
      setBulkDeleteOpen(false);
      setBulkDeletePhrase("");
      setDeleteMessage(`${payload.deleted} ta ariza o'chirildi.`);
    } catch (error: any) {
      setDeleteMessage(error.message || "Arizalarni tozalab bo'lmadi.");
    } finally {
      setDeletingAllLeads(false);
    }
  };

  // Client filtering by search term (name, phone, course)
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const matchName = fullName.includes(term);
    const matchPhone =
      lead.primaryPhone.includes(term) ||
      (lead.secondaryPhone && lead.secondaryPhone.includes(term));
    const matchCourse =
      lead.courseInterest && lead.courseInterest.toLowerCase().includes(term);
    return matchName || matchPhone || matchCourse;
  });

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        {deleteMessage && (
          <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <span>{deleteMessage}</span>
            <button type="button" onClick={() => setDeleteMessage(null)} className="shrink-0 rounded-md px-2 py-1 text-xs font-bold text-slate-500">Yopish</button>
          </div>
        )}
        
        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Leadlar Boshqaruvi (CRM)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Barcha qabul qilingan arizalarni saralash, telefon qilish va holatlarini o'zgartirish
            </p>
          </div>

          <button
            onClick={fetchLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Yangilash</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Ism, familiya, telefon raqami yoki kurs bo'yicha qidirish..."
              className="w-full min-w-0 rounded-xl border border-slate-200 py-2.5 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="sm:col-span-4 relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-base sm:text-sm font-semibold text-slate-800 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="ALL">Barcha holatlar (Jami)</option>
              <option value="NEW">Yangi (NEW)</option>
              <option value="CONTACTED">Bog'lanildi (CONTACTED)</option>
              <option value="INTERESTED">Qiziqmoqda (INTERESTED)</option>
              <option value="ENROLLED">Qabul qilindi (ENROLLED)</option>
              <option value="NOT_INTERESTED">Rad etildi (NOT_INTERESTED)</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-900" />
            </div>
          ) : error && leads.length === 0 ? (
            <div className="p-6 text-center text-xs text-rose-600">{error}</div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              {hasMoreLeads
                ? "Yuklangan arizalarda topilmadi. Pastdagi tugma orqali qolgan arizalarni yuklang."
                : "Qidiruv yoki filtr bo'yicha hech qanday ariza topilmadi."}
            </div>
          ) : (
            <div className="hidden max-w-full overflow-x-auto xl:block">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Talaba F.I.O</th>
                    <th className="py-3.5 px-4">Asosiy Raqam</th>
                    <th className="py-3.5 px-4">Qo'shimcha Raqam</th>
                    <th className="py-3.5 px-4">Kurs</th>
                    <th className="py-3.5 px-4">Holati</th>
                    <th className="py-3.5 px-4">Sana</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-purple-50/20 transition-colors"
                    >
                      {/* Name & Notes flag */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {lead.firstName} {lead.lastName}
                        </div>
                        {lead.internalNotes && (
                          <span className="inline-block mt-0.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded italic truncate max-w-xs">
                            "{lead.internalNotes}"
                          </span>
                        )}
                      </td>

                      {/* Primary Phone with Clickable tel: */}
                      <td className="py-3.5 px-4 font-mono">
                        <a
                          href={`tel:${lead.primaryPhone}`}
                          className="inline-flex items-center gap-1.5 font-bold text-brand-900 hover:text-brand-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg transition-colors"
                          title="Telefon qilish"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{lead.primaryPhone}</span>
                        </a>
                      </td>

                      {/* Secondary Phone */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {lead.secondaryPhone ? (
                          <a
                            href={`tel:${lead.secondaryPhone}`}
                            className="hover:underline text-slate-700"
                          >
                            {lead.secondaryPhone}
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {lead.courseInterest || "Belgilanmagan"}
                        </span>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(
                              lead.id,
                              e.target.value as LeadStatus
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-900"
                        >
                          <option value="NEW">Yangi (NEW)</option>
                          <option value="CONTACTED">Bog'lanildi (CONTACTED)</option>
                          <option value="INTERESTED">Qiziqmoqda (INTERESTED)</option>
                          <option value="ENROLLED">Yozildi (ENROLLED)</option>
                          <option value="NOT_INTERESTED">Rad etildi (NOT_INTERESTED)</option>
                        </select>
                      </td>

                      {/* Submission Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString("uz-UZ", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Notes Button */}
                          <button
                            onClick={() => {
                              setEditingNotesLead(lead);
                              setNotesValue(lead.internalNotes || "");
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-900 hover:bg-slate-100"
                            title="Izoh yozish"
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>

                          {/* View Details Button */}
                          <button
                            onClick={() => setViewingLead(lead)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-900 hover:bg-slate-100"
                            title="To'liq tafsilotlar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredLeads.length > 0 && (
            <div className="grid min-w-0 grid-cols-1 gap-3 p-3 xl:hidden">
              {paginatedLeads.map((lead) => (
                <article key={lead.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-sm font-extrabold text-slate-900">{lead.firstName} {lead.lastName}</h2>
                      <p className="mt-1 break-words text-xs font-semibold text-brand-900">{lead.courseInterest || "Kurs belgilanmagan"}</p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      {new Date(lead.createdAt).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" })}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs">
                    <a href={`tel:${lead.primaryPhone}`} className="flex min-h-10 min-w-0 items-center gap-2 break-all rounded-lg bg-purple-50 px-3 font-bold text-brand-900">
                      <Phone className="h-4 w-4 shrink-0" /> {lead.primaryPhone}
                    </a>
                    {lead.secondaryPhone && (
                      <a href={`tel:${lead.secondaryPhone}`} className="block min-h-10 break-all rounded-lg bg-slate-50 px-3 py-3 font-medium text-slate-700">
                        Qo'shimcha: {lead.secondaryPhone}
                      </a>
                    )}
                  </div>

                  <label className="mt-3 block text-[10px] font-bold uppercase tracking-wide text-slate-500" htmlFor={`lead-status-${lead.id}`}>Ariza holati</label>
                  <select
                    id={`lead-status-${lead.id}`}
                    value={lead.status}
                    onChange={(event) => handleStatusChange(lead.id, event.target.value as LeadStatus)}
                    className="mt-1 min-h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="NEW">Yangi (NEW)</option>
                    <option value="CONTACTED">Bog'lanildi (CONTACTED)</option>
                    <option value="INTERESTED">Qiziqmoqda (INTERESTED)</option>
                    <option value="ENROLLED">Yozildi (ENROLLED)</option>
                    <option value="NOT_INTERESTED">Rad etildi (NOT_INTERESTED)</option>
                  </select>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <button type="button" onClick={() => { setEditingNotesLead(lead); setNotesValue(lead.internalNotes || ""); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700">
                      <FileEdit className="h-4 w-4" /> Izoh
                    </button>
                    <button type="button" onClick={() => setViewingLead(lead)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700">
                      <Eye className="h-4 w-4" /> Batafsil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {error && leads.length > 0 && (
            <div role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Pagination Controls */}
          {(filteredLeads.length > pageSize || hasMoreLeads) && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">
                Ko'rsatilmoqda: <strong>{leads.length}</strong> ta ariza
                {hasMoreLeads && <span> · yana arizalar bor</span>}
                {filteredLeads.length > pageSize && <> · Sahifa: {page} / {totalPages}</>}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {filteredLeads.length > pageSize && (
                  <>
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Oldingi
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Keyingi
                    </button>
                  </>
                )}
                {hasMoreLeads && (
                  <button
                    onClick={loadMoreLeads}
                    disabled={loadingMore}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loadingMore ? "Yuklanmoqda..." : "Yana 100 ta ariza"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {isSuperAdminLeadsPage && isSuperAdmin && (
          <details className="rounded-2xl border border-rose-200 bg-rose-50/40">
            <summary className="cursor-pointer select-none px-4 py-4 text-sm font-bold text-rose-900">Xavfli amallar — arizalarni tozalash</summary>
            <div className="border-t border-rose-100 px-4 py-4">
              <p className="max-w-2xl text-xs leading-5 text-slate-600">Bu amal barcha arizalarni va ularga bog'langan status tarixini butunlay o'chiradi. Faqat sinov ma'lumotlarini tozalash kerak bo'lganda ishlating.</p>
              <button type="button" onClick={() => { setBulkDeletePhrase(""); setBulkDeleteOpen(true); }} className="mt-4 min-h-11 rounded-xl border-2 border-rose-300 bg-white px-4 text-xs font-bold text-rose-800 hover:bg-rose-100">Barcha arizalarni tozalash…</button>
            </div>
          </details>
        )}

        {/* Modal: Edit Internal Notes */}
        {editingNotesLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">
                  Leadga Ichki Izoh Qo'shish
                </h3>
                <button
                  onClick={() => setEditingNotesLead(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-4">
                <p className="text-xs text-slate-500 mb-2">
                  Talaba:{" "}
                  <strong>
                    {editingNotesLead.firstName} {editingNotesLead.lastName}
                  </strong>{" "}
                  ({editingNotesLead.primaryPhone})
                </p>
                <textarea
                  rows={4}
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Mijoz bilan suhbat natijasi, darajasi, kelish vaqti yoki alohida istaklarini yozing..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 focus:border-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEditingNotesLead(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-50"
                >
                  {savingNotes && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Saqlash</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: View Full Lead Details */}
        {viewingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">
                  Lead Tafsilotlari (ID: {viewingLead.id.slice(0, 8)}...)
                </h3>
                <button
                  onClick={() => setViewingLead(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">To'liq ismi:</span>
                  <span className="font-bold text-slate-900">
                    {viewingLead.firstName} {viewingLead.lastName}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Asosiy telefon:</span>
                  <a
                    href={`tel:${viewingLead.primaryPhone}`}
                    className="font-bold text-brand-900 hover:underline"
                  >
                    {viewingLead.primaryPhone}
                  </a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Qo'shimcha telefon:</span>
                  <span className="font-mono text-slate-700">
                    {viewingLead.secondaryPhone || "Mavjud emas"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Tanlangan kurs:</span>
                  <span className="font-semibold text-slate-800">
                    {viewingLead.courseInterest || "Ko'rsatilmagan"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Holati:</span>
                  <LeadStatusBadge status={viewingLead.status} />
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">Arizani qoldirgan sana:</span>
                  <span className="font-mono text-slate-700">
                    {new Date(viewingLead.createdAt).toLocaleString("uz-UZ")}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">Ichki izohlar:</span>
                  <div className="rounded-xl bg-slate-50 p-3 text-slate-700 border border-slate-100 min-h-16">
                    {viewingLead.internalNotes || "Hozircha hech qanday izoh yozilmagan."}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={`tel:${viewingLead.primaryPhone}`}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Qo'ng'iroq qilish</span>
                </a>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  {isSuperAdminLeadsPage && isSuperAdmin && (
                    <button type="button" onClick={() => { setLeadToDelete(viewingLead); setViewingLead(null); }} className="min-h-11 rounded-xl border border-rose-200 bg-white px-4 text-xs font-bold text-rose-700 hover:bg-rose-50">
                      Arizani o'chirish…
                    </button>
                  )}
                  <button type="button" onClick={() => setViewingLead(null)} className="min-h-11 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50">Yopish</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {leadToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-lead-title">
            <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-5 shadow-2xl sm:p-6">
              <div className="flex items-center gap-3 text-rose-700"><ShieldAlert className="h-6 w-6" /><h3 id="delete-lead-title" className="text-base font-black">Arizani o'chirish</h3></div>
              <p className="mt-4 text-sm leading-6 text-slate-700"><strong>{leadToDelete.firstName} {leadToDelete.lastName}</strong> arizasi butunlay o'chadi. Bu amalni qaytarib bo'lmaydi.</p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button type="button" disabled={deletingLead} onClick={() => setLeadToDelete(null)} className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">Bekor qilish</button>
                <button type="button" disabled={deletingLead} onClick={handleDeleteLead} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-bold text-white disabled:opacity-60">{deletingLead && <Loader2 className="h-4 w-4 animate-spin" />}Ha, o'chirish</button>
              </div>
            </div>
          </div>
        )}

        {bulkDeleteOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-all-leads-title">
            <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-rose-200 bg-white p-5 shadow-2xl sm:p-6">
              <div className="flex items-center gap-3 text-rose-700"><ShieldAlert className="h-6 w-6" /><h3 id="delete-all-leads-title" className="text-base font-black">Barcha arizalarni o'chirish</h3></div>
              <p className="mt-4 text-sm leading-6 text-slate-700">Barcha arizalar va ularning status tarixi qaytarib bo'lmaydigan tarzda o'chadi. Tasdiqlash uchun quyidagi iborani aynan yozing:</p>
              <code className="mt-3 block rounded-lg bg-rose-50 p-3 text-xs font-bold text-rose-900">BARCHA ARIZALARNI O'CHIRISH</code>
              <input autoComplete="off" value={bulkDeletePhrase} onChange={(event) => setBulkDeletePhrase(event.target.value)} aria-label="Tasdiqlash iborasi" className="mt-3 min-h-12 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900" />
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button type="button" disabled={deletingAllLeads} onClick={() => { setBulkDeleteOpen(false); setBulkDeletePhrase(""); }} className="min-h-12 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">Bekor qilish</button>
                <button type="button" disabled={deletingAllLeads || bulkDeletePhrase !== "BARCHA ARIZALARNI O'CHIRISH"} onClick={handleDeleteAllLeads} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-bold text-white disabled:opacity-40">{deletingAllLeads && <Loader2 className="h-4 w-4 animate-spin" />}Hammasini o'chirish</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
