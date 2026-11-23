import React from "react";
import { LeadStatus } from "@/lib/types/lead";

interface StatusBadgeProps {
  status: LeadStatus;
}

export default function LeadStatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          Yangi (NEW)
        </span>
      );
    case "CONTACTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          Bog'lanildi (CONTACTED)
        </span>
      );
    case "INTERESTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-brand-900 border border-purple-200">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-700" />
          Qiziqmoqda (INTERESTED)
        </span>
      );
    case "ENROLLED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Yozildi (ENROLLED)
        </span>
      );
    case "NOT_INTERESTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Rad etildi (NOT_INTERESTED)
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          {status}
        </span>
      );
  }
}
