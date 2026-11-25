import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INSA Education — Zamonaviy Ta'lim Markazi | Toshkent",
  description:
    "INSA Education — Toshkent shahrida IELTS, CEFR, Milliy sertifikat, til va fan kurslari bo'yicha sifatli ta'lim beruvchi zamonaviy o'quv markazi. Mirzo Ulug'bek metrosi yaqinida.",
  icons: {
    icon: "/favicon.svg",
    apple: "/assets/insa-mark-photo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
