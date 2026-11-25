"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { authenticatedFetch, getAccessToken, supabase } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types/profile";
import {
  UserPlus,
  Shield,
  ShieldAlert,
  KeyRound,
  Trash2,
  RefreshCw,
  Loader2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Admin Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createSuccessData, setCreateSuccessData] = useState<{
    username: string;
    temporaryPassword: string;
  } | null>(null);

  // Freeze Modal State
  const [freezeModalData, setFreezeModalData] = useState<{
    admin: UserProfile;
    action: "FREEZE" | "UNFREEZE";
  } | null>(null);
  const [freezing, setFreezing] = useState(false);

  // Reset Password Modal State
  const [resetModalAdmin, setResetModalAdmin] = useState<UserProfile | null>(null);
  const [resetTemporaryPassword, setResetTemporaryPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccessPassword, setResetSuccessPassword] = useState<string | null>(null);

  // Delete Admin Modal State
  const [deleteModalAdmin, setDeleteModalAdmin] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copied helper
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");
      const { data: sessionData } = await supabase.auth.getSession();
      setCurrentUserId(sessionData.session?.user.id ?? null);

      const res = await authenticatedFetch("/api/superadmin/admins", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    const randomValues = new Uint32Array(12);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < randomValues.length; i++) {
      pass += chars.charAt(randomValues[i] % chars.length);
    }
    return pass;
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      alert("Foydalanuvchi nomi va parol kiritilishi shart");
      return;
    }

    try {
      setCreating(true);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      const res = await authenticatedFetch("/api/superadmin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          temporaryPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Admin yaratishda xatolik yuz berdi");
      }

      setCreateSuccessData({
        username: newUsername.trim(),
        temporaryPassword: newPassword.trim(),
      });
      fetchAdmins();
    } catch (err: any) {
      const message = String(err.message || "").toLowerCase().includes("fetch")
        ? "Serverga ulanib bo'lmadi. Vercel deploy holatini va internetni tekshiring."
        : err.message;
      alert(`Xatolik: ${message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmFreeze = async () => {
    if (!freezeModalData) return;

    try {
      setFreezing(true);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      const res = await authenticatedFetch(
        `/api/superadmin/admins/${freezeModalData.admin.uid}/freeze`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ action: freezeModalData.action }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Amalni bajarishda xatolik");
      }

      setFreezeModalData(null);
      fetchAdmins();
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
    } finally {
      setFreezing(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!resetModalAdmin || !resetTemporaryPassword.trim()) return;

    try {
      setResetting(true);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      const res = await authenticatedFetch(
        `/api/superadmin/admins/${resetModalAdmin.uid}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            temporaryPassword: resetTemporaryPassword.trim(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Parolni yangilashda xatolik");
      }

      setResetSuccessPassword(resetTemporaryPassword.trim());
      fetchAdmins();
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalAdmin) return;

    try {
      setDeleting(true);
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Sessiya topilmadi. Iltimos, qaytadan kiring.");

      const res = await authenticatedFetch(
        `/api/superadmin/admins/${deleteModalAdmin.uid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "O'chirishda xatolik yuz berdi");
      }

      setDeleteModalAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Administratorlarni Boshqarish (CRUD)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Xodimlar hisobini yaratish, vaqtinchalik parol berish va muzlatish
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdmins}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Yangilash</span>
            </button>

            <button
              onClick={() => {
                setNewUsername("");
                setNewPassword(generateRandomPassword());
                setCreateSuccessData(null);
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-800 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Yangi Admin Yaratish</span>
            </button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-900" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs text-rose-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Foydalanuvchi nomi</th>
                    <th className="py-3.5 px-4">Roli</th>
                    <th className="py-3.5 px-4">Holati</th>
                    <th className="py-3.5 px-4">Parol Holati</th>
                    <th className="py-3.5 px-4">Yaratilgan sana</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((adm) => {
                    const isSelf = currentUserId === adm.uid;
                    const isSuper = adm.role === "SUPER_ADMIN";
                    const isFrozen = adm.status === "FROZEN";

                    return (
                      <tr
                        key={adm.uid}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isFrozen ? "bg-rose-50/20" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {adm.username}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">
                            UID: {adm.uid.slice(0, 10)}...
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              isSuper
                                ? "bg-purple-100 text-purple-900 border border-purple-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {adm.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isFrozen ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                              Muzlatilgan (FROZEN)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              Faol (ACTIVE)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {adm.mustChangePassword ? (
                            <span className="inline-block text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Majburiy almashtirish
                            </span>
                          ) : (
                            <span className="inline-block text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              O'zgartirilgan
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {new Date(adm.createdAt).toLocaleDateString("uz-UZ", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reset Password */}
                            {!isSuper && (
                              <button
                                type="button"
                                onClick={() => {
                                  setResetModalAdmin(adm);
                                  setResetTemporaryPassword("");
                                  setResetSuccessPassword(null);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-900 hover:bg-purple-50"
                                title="Vaqtinchalik parol berish"
                              >
                                <KeyRound className="h-4 w-4" />
                              </button>
                            )}

                            {/* Freeze / Unfreeze Action */}
                            {!isSuper && (
                              <button
                                type="button"
                                onClick={() =>
                                  setFreezeModalData({
                                    admin: adm,
                                    action: isFrozen ? "UNFREEZE" : "FREEZE",
                                  })
                                }
                                className={`p-1.5 rounded-lg ${
                                  isFrozen
                                    ? "text-emerald-600 hover:bg-emerald-50"
                                    : "text-amber-600 hover:bg-amber-50"
                                }`}
                                title={isFrozen ? "Faollashtirish" : "Muzlatish"}
                              >
                                {isFrozen ? (
                                  <Unlock className="h-4 w-4" />
                                ) : (
                                  <Lock className="h-4 w-4" />
                                )}
                              </button>
                            )}

                            {/* Delete Action */}
                            {!isSuper && (
                              <button
                                onClick={() => setDeleteModalAdmin(adm)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Hisobni o'chirish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal 1: Create New Admin */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-purple-900" />
                  <span>Yangi Administrator Yaratish</span>
                </h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {createSuccessData ? (
                <div className="py-6 space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-1" />
                    <h4 className="font-bold text-emerald-900 text-sm">
                      Admin muvaffaqiyatli yaratildi!
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Ushbu vaqtinchalik ma'lumotlarni adminga yetkazing. Birinchi kirishda yangi shaxsiy parol talab qilinadi.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Username:</span>
                      <strong className="text-slate-900">{createSuccessData.username}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Vaqtinchalik Parol:</span>
                      <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-purple-900 font-bold">
                        {createSuccessData.temporaryPassword}
                      </code>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Username: ${createSuccessData.username}\nVaqtinchalik Parol: ${createSuccessData.temporaryPassword}\nKirish: /admin`
                      )
                    }
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Nusxa olindi!" : "Ma'lumotlarni nusxalash"}</span>
                  </button>

                  <button
                    onClick={() => setCreateModalOpen(false)}
                    className="w-full rounded-xl bg-purple-900 py-2.5 text-xs font-bold text-white hover:bg-purple-800"
                  >
                    Tugatish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateAdmin} className="py-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Foydalanuvchi nomi (Username)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="masalan: alisher_admin"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Vaqtinchalik Parol
                      </label>
                      <button
                        type="button"
                        onClick={() => setNewPassword(generateRandomPassword())}
                        className="text-[11px] text-purple-900 font-semibold hover:underline"
                      >
                        Avtomatik generatsiya
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="min-h-11 w-full rounded-xl border border-slate-200 p-2.5 pr-12 text-sm font-mono text-slate-900 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((visible) => !visible)}
                        aria-label={showNewPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                        className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center text-slate-500"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500">Kamida 8 belgi. Birinchi kirishda admin parolini almashtiradi.</p>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                    ℹ️ Yangi adminga <code>mustChangePassword = true</code> o'rnatiladi va birinchi kirishda majburiy yangi parol so'raladi.
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCreateModalOpen(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex items-center gap-1.5 rounded-xl bg-purple-900 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800 disabled:opacity-50"
                    >
                      {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Admin Yaratish</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal 2: Freeze / Unfreeze Confirmation */}
        {freezeModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    freezeModalData.action === "FREEZE"
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {freezeModalData.action === "FREEZE"
                      ? "Admin Hisobini Muzlatish"
                      : "Admin Hisobini Qayta Faollashtirish"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Admin: <strong>{freezeModalData.admin.username}</strong>
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed mb-6">
                {freezeModalData.action === "FREEZE" ? (
                  <p>
                    Ushbu admin muzlatilgach himoyalangan API'lar undan foydalanishga darhol ruxsat bermaydi. Qayta kirish uchun hisobni faollashtirish kerak. Tasdiqlaysizmi?
                  </p>
                ) : (
                  <p>
                    Ushbu admin hisobi faollashtiriladi va u qaytadan o'z paroli bilan tizimga kirish imkoniyatiga ega bo'ladi.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setFreezeModalData(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleConfirmFreeze}
                  disabled={freezing}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white disabled:opacity-50 ${
                    freezeModalData.action === "FREEZE"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {freezing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{freezeModalData.action === "FREEZE" ? "Muzlatish" : "Faollashtirish"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Reset Password Confirmation */}
        {resetModalAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-purple-900" />
                  <span>Vaqtinchalik Parolni Yangilash</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setResetModalAdmin(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {resetSuccessPassword ? (
                <div className="py-6 space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-1" />
                    <h4 className="font-bold text-emerald-900 text-sm">
                      Yangi vaqtinchalik parol o'rnatildi!
                    </h4>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs flex justify-between items-center">
                    <span className="text-slate-500">Yangi parol:</span>
                    <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-purple-900 font-bold">
                      {resetSuccessPassword}
                    </code>
                  </div>

                  <button
                  type="button"
                    onClick={() => setResetModalAdmin(null)}
                    className="w-full rounded-xl bg-purple-900 py-2.5 text-xs font-bold text-white hover:bg-purple-800"
                  >
                    Yopish
                  </button>
                </div>
              ) : (
                <div className="py-4 space-y-4">
                  <p className="text-xs text-slate-600">
                    Admin <strong>{resetModalAdmin.username}</strong> uchun vaqtinchalik parol o'rnatiladi. Parolni faqat quyidagi tugma orqali tasdiqlasangiz saqlanadi; oynani yopish hisobga ta'sir qilmaydi.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Yangi Vaqtinchalik Parol
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      value={resetTemporaryPassword}
                      onChange={(e) => setResetTemporaryPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-900 focus:border-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
                    />
                    <button
                      type="button"
                      onClick={() => setResetTemporaryPassword(generateRandomPassword())}
                      className="mt-2 min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Xavfsiz tasodifiy parol yaratish
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setResetModalAdmin(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmResetPassword}
                      disabled={resetting || resetTemporaryPassword.trim().length < 8}
                      className="flex items-center gap-1.5 rounded-xl bg-purple-900 px-4 py-2 text-xs font-bold text-white hover:bg-purple-800 disabled:opacity-50"
                    >
                      {resetting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Parolni Yangilash</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal 4: Delete Confirmation */}
        {deleteModalAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Administratorni Butunlay O'chirish
                  </h3>
                  <p className="text-xs text-slate-500">
                    Admin: <strong>{deleteModalAdmin.username}</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Ushbu amal qaytarib bo'lmaydi. Administrator hisobi Supabase Auth va profillar jadvalidan butunlay o'chiriladi hamda audit jurnalida qayd etiladi.
              </p>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => setDeleteModalAdmin(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>O'chirishni tasdiqlash</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
