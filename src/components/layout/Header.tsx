"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [usage, setUsage] = useState<{today:number;daily_limit:number;remaining:number}|null>(null);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/account/usage", { credentials: "include" })
        .then(r=>r.json())
        .then(d=>d.ok&&setUsage(d))
        .catch(()=>{});
    } else {
      setUsage(null);
    }
  }, [isAuthenticated]);

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/beta", label: "免费公测" },
    { href: "/quick-write", label: "快速写材料" },
    { href: "/run-activity", label: "办一场活动" },
    { href: "/templates", label: "材料包库" },
    { href: "/contact", label: "机构试用" },
    { href: "/my-materials", label: "我的材料" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0]">
      <div className="container-app">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl md:text-2xl font-bold text-[#1a56db]">办会助理</span>
            <span className="hidden sm:inline text-xs text-[#64748b] ml-1">| 免费内测版</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-3 py-2 text-sm text-[#475569] hover:text-[#1a56db] hover:bg-[#f1f5f9] rounded-lg transition-colors">{item.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? <div className="relative hidden sm:block"><button onClick={()=>setUserMenu(!userMenu)} className="inline-flex items-center gap-1.5 btn-primary text-sm py-2 px-4"><span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[0.6rem] font-bold">{user?.nickname?.[0]||"U"}</span>{user?.nickname}{usage ? <span className={"text-[0.55rem] ml-1 "+(usage.remaining<5?"text-[#fca5a5]":"text-[#93c5fd]")}>{usage.remaining}</span> : null} <span className="text-[0.5rem] opacity-70">&#9660;</span></button>{userMenu && <><div className="fixed inset-0 z-40" onClick={()=>setUserMenu(false)}></div><div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white border border-[#e2e8f0] rounded-lg shadow-lg py-1"><Link href="/account" className="block px-4 py-2 text-sm text-[#475569] hover:bg-[#f1f5f9]" onClick={()=>setUserMenu(false)}>我的账户</Link><button onClick={()=>{logout();setUserMenu(false);}} className="block w-full text-left px-4 py-2 text-sm text-[#dc2626] hover:bg-[#fef2f2]">退出登录</button></div></>}</div> : <Link href="/login" className="hidden sm:inline-flex btn-primary text-sm py-2 px-4">登录/注册</Link>}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-[#e2e8f0] pt-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block px-3 py-2.5 text-sm text-[#475569] hover:bg-[#f1f5f9] rounded-lg" onClick={() => setMenuOpen(false)}>{item.label}</Link>
            ))}
            {isAuthenticated ? <><Link href="/account" className="block px-3 py-2.5 text-sm text-[#1a56db] font-medium hover:bg-[#f1f5f9] rounded-lg" onClick={() => setMenuOpen(false)}>我的账户</Link><button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2.5 text-sm text-[#64748b] hover:bg-[#f1f5f9] rounded-lg">退出</button></> : <Link href="/login" className="block px-3 py-2.5 text-sm text-[#1a56db] font-medium hover:bg-[#f1f5f9] rounded-lg" onClick={() => setMenuOpen(false)}>登录/注册</Link>}
          </div>
        )}
      </div>
    </header>
  );
}
