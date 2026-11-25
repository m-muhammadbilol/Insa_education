"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, supabase } from "@/lib/supabase/client";
import { profileFromRow } from "@/lib/supabase/mappers";
import { UserProfile } from "@/lib/types/profile";
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  FileText,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Loader2,
  ShieldAlert,
  KeyRound,
  User,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
          const prof = profileFromRow(row);
          if (prof.status === "FROZEN") {
            await supabase.auth.signOut();
            router.push("/admin");
            return;
          }
          if (prof.mustChangePassword) {
            router.push("/admin/change-password");
            return;
          }
          if (active) setProfile(prof);
        } else {
          router.push("/admin");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-900" />
      </div>
    );
  }

  const isSuperAdmin = profile?.role === "SUPER_ADMIN";

  const navItems = [
    {
      name: "Asosiy Ko'rsatkichlar",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard",
    },
    {
      name: "Leadlar Ro'yxati (CRM)",
      href: "/admin/leads",
      icon: Users,
      active: pathname === "/admin/leads",
    },
    {
      name: "Parolni o'zgartirish",
      href: "/admin/change-password",
      icon: KeyRound,
      active: pathname === "/admin/change-password",
    },
  ];

  const superAdminNavItems = isSuperAdmin
    ? [
        {
          name: "Super Admin Boshqaruv",
          href: "/admin/superadmin",
          icon: Shield,
          active: pathname === "/admin/superadmin",
        },
        {
          name: "Adminlarni Boshqarish",
          href: "/admin/superadmin/admins",
          icon: Users,
          active: pathname === "/admin/superadmin/admins",
        },
        {
          name: "Profil va username",
          href: "/admin/superadmin/profile",
          icon: User,
          active: pathname === "/admin/superadmin/profile",
        },
        {
          name: "Tizim Audit Tarixi",
          href: "/admin/superadmin/audit-logs",
          icon: FileText,
          active: pathname === "/admin/superadmin/audit-logs",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200 bg-white">
        
        {/* Brand header */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100">
          <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-sm">
            <Image
              src="/assets/insa-mark-purple.svg"
              alt="INSA Education"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-brand-900 leading-tight">INSA CRM</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {profile?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin Panel"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operatsion CRM
            </span>
            <div className="mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                      item.active
                        ? "bg-brand-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Super Admin Nazorati
              </span>
              <div className="mt-2 space-y-1">
                {superAdminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                        item.active
                          ? "bg-purple-900 text-white shadow-sm"
                          : "text-slate-700 hover:bg-purple-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User footer profile & logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {profile?.username}
              </h4>
              <span className="inline-block text-[10px] font-semibold text-brand-900 bg-brand-50 px-1.5 py-0.5 rounded">
                {profile?.role}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              title="Chiqish"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-200 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span>Asosiy saytni ochish</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg overflow-hidden">
            <Image
              src="/assets/insa-mark-purple.svg"
              alt="INSA CRM"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm text-brand-900">INSA CRM</span>
        </div>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-slate-600 hover:text-slate-900"
          aria-label={mobileNavOpen ? "Menyuni yopish" : "Menyuni ochish"}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`block rounded-lg px-3 py-2 text-xs font-bold ${
                  item.active ? "bg-brand-900 text-white" : "text-slate-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isSuperAdmin &&
              superAdminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-xs font-bold ${
                    item.active ? "bg-purple-900 text-white" : "text-purple-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
          </div>
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className="flex min-h-11 items-center justify-between rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700"
          >
            <span>Asosiy saytga o'tish</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              {profile?.username} ({profile?.role})
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-rose-600 flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              Chiqish
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
