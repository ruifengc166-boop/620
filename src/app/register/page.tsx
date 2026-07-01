"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const { register, login, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) { router.push("/account"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!nickname || !email || !password) { setErr("请填写所有字段"); return; }
    if (password !== confirm) { setErr("两次密码不一致"); return; }
    const res = await register(nickname, email, password);
    if (res.ok) {
      await login(email, password);
      setMsg("注册成功，正在进入新手引导"); setTimeout(() => router.push("/onboarding"), 500);
    } else setErr(res.msg);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e293b]">注册</h1>
          <p className="text-sm text-[#64748b] mt-1">创建您的办会助理账号</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {err && <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-xs text-[#991b1b]">{err}</div>}
          {msg && <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">{msg}</div>}
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">昵称</label>
            <input className="form-input" placeholder="您的昵称" value={nickname} onChange={e => setNickname(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">邮箱</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">密码</label>
            <input className="form-input" type="password" placeholder="至少8位" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1.5">确认密码</label>
            <input className="form-input" type="password" placeholder="再次输入密码" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-2.5 text-sm">注册</button>
          <p className="text-center text-xs text-[#64748b]">
            已有账号？<Link href="/login" className="text-[#1a56db] hover:underline">登录</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
