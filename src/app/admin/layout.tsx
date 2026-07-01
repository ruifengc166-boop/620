"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") { setLoading(false); return; }
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.ok && d.user?.role === "admin") {
          setAuthed(true);
        } else {
          localStorage.removeItem("banhui_admin");
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [pathname, router]);

  if (loading) return <div className="min-h-screen bg-[#0f172a]" />;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!authed) return null;

  const nav = [
    { href: "/admin", label: "📊 概览" },
    { href: "/admin/content", label: "📝 内容管理" },
    { href: "/admin/users", label: "👥 用户管理" },
    { href: "/admin/templates", label: "📐 模板管理" },
    { href: "/admin/models", label: "🤖 模型配置" },
    { href: "/admin/prompt-engine", label: "🧠 Prompt引擎" },
    { href: "/admin/feedback", label: "💬 生成反馈" },
    { href: "/admin/system", label: "🛠 系统运维" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="flex">
        <aside className="hidden md:block w-56 bg-white border-r border-[#e2e8f0] min-h-screen p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#1a56db] flex items-center justify-center text-white font-bold text-sm">B</div>
            <div><div className="font-semibold text-sm">管理后台</div><div className="text-[0.6rem] text-[#94a3b8]">办会助理</div></div>
          </div>
          <nav className="space-y-1">
            {nav.map(n => <Link key={n.href} href={n.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${pathname === n.href ? "bg-[#eff6ff] text-[#1a56db] font-medium" : "text-[#475569] hover:bg-[#f1f5f9]"}`}>{n.label}</Link>)}
            <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); localStorage.removeItem("banhui_admin"); localStorage.removeItem("banhui_session"); window.location.href = "/admin/login"; }} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#dc2626] hover:bg-[#fef2f2] mt-4">🚪 退出</button>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 pb-20">{children}</main>
      </div>
    </div>
  );
}
