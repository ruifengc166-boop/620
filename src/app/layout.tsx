import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "办会工坊 - 活动材料AI助手",
  description: "一站式活动材料AI工作流平台。写方案、主持词、新闻稿、总结，不再从零开始。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#1e293b] pb-20 md:pb-0">
        <AuthProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}

