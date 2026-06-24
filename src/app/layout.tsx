import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "办会助理 - 活动材料AI助手免费内测版",
  description: "办会助理是给活动组织者使用的AI材料助手。当前为免费内测体验版本，可生成活动方案、通知、主持词、新闻稿、推文和总结初稿，暂不提供在线交易和支付服务。",
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
