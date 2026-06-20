
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) { router.push("/account"); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!email || !password) { setErr("请填写邮箱和密码"); return; }
    const res = login(email, password);
    if (res.ok) { setMsg("登录成功"); setTimeout(() => router.push("/account"), 500); }
    else setErr(res.msg);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e293b]">登录</h1>
          <p className="text-sm text-[#64748b] mt-1">欢迎回到办会工坊</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {err && <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-xs text-[#991b1b]">{err}</div>}
          {msg && <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">{msg}</div>}
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">邮箱</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">密码</label>
            <input className="form-input" type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">登录</button>
          <p className="text-center text-xs text-[#64748b]">
            还没有账号？<Link href="/register" className="text-[#1a56db] hover:underline">注册</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

