"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!email || !password) { setErr("请填写账号和密码"); return; }
    try {
      const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const d = await r.json();
      if (d.ok && d.user.membership_level === "admin") {
        localStorage.setItem("banhui_admin", "1");
        localStorage.setItem("banhui_session", JSON.stringify({ userId: d.user.id, nickname: d.user.nickname, email: d.user.email, token: "admin-"+Date.now(), membership_level: "admin", points_balance: 99999 }));
        router.push("/admin");
      } else setErr("管理员账号或密码错误");
    } catch { setErr("登录失败"); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1a56db] flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">B</div>
          <h1 className="text-xl font-bold text-white">管理后台</h1>
          <p className="text-sm text-[#94a3b8] mt-1">办会助理 · 管理员登录</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-xl p-6 space-y-4 border border-[#334155]">
          {err && <div className="p-3 bg-[#7f1d1d]/50 border border-[#991b1b] rounded-lg text-xs text-[#fca5a5]">{err}</div>}
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">管理员账号</label>
            <input className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#1a56db]" type="email" placeholder="admin@banhui.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">密码</label>
            <input className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#1a56db]" type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-2.5 bg-[#1a56db] hover:bg-[#1e40af] text-white text-sm font-medium rounded-lg transition-colors">登录管理后台</button>
          <a href="/" className="block text-center text-xs text-[#475569] hover:text-[#94a3b8]">&larr; 返回前台</a>
        </form>
      </div>
    </div>
  );
}
