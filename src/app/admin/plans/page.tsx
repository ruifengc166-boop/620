"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

const planDefs = [
  { id: "free", name: "免费版", price: "0", color: "text-[#64748b]", border: "border-[#e2e8f0]", desc: "每日10次生成 · 单版本 · 基础风控" },
  { id: "pro", name: "个人专业版", price: "69", color: "text-[#1a56db]", border: "border-[#bfdbfe]", desc: "每日50次 · 多版本(限20次) · Word/PDF导出" },
  { id: "expert", name: "材料达人版", price: "299", color: "text-[#7c3aed]", border: "border-[#ddd6fe]", desc: "每日200次 · 多版本(限50次) · 多模型比选" },
];

export default function AdminPlans() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    adminFetch("/api/admin/users").then(r => r.json()).then(d => d.ok && setUsers(d.users)).catch(() => {});
  }, []);

  const counts: Record<string, number> = {};
  users.forEach(u => { counts[u.membership] = (counts[u.membership] || 0) + 1; });

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">💎 套餐管理</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {planDefs.map(p => (
          <div key={p.id} className={"card p-5 border-2 " + p.border}>
            <div className="text-xs text-[#64748b] mb-1">{p.id === "free" ? "当前" : "升级"}</div>
            <div className={"text-lg font-bold " + p.color}>{p.name}</div>
            <div className="text-2xl font-bold my-2">{p.price}<span className="text-sm font-normal text-[#64748b]">{p.id === "free" ? "" : "元/月"}</span></div>
            <p className="text-xs text-[#64748b] mb-3">{p.desc}</p>
            <div className="text-xs text-[#94a3b8]">使用人数: {counts[p.id] || 0}</div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h2 className="font-semibold text-sm mb-3">用户套餐分布</h2>
        <table className="w-full text-xs">
          <thead><tr className="border-b text-[#64748b]"><th className="text-left py-2">昵称</th><th className="text-left py-2">邮箱</th><th className="text-left py-2">套餐</th><th className="text-left py-2">点数</th></tr></thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-[#94a3b8]">暂无数据</td></tr>}
            {users.map((u: any) => (
              <tr key={u.id} className="border-b border-[#f1f5f9]">
                <td className="py-2">{u.nickname}</td>
                <td className="py-2 text-[#64748b]">{u.email}</td>
                <td className="py-2"><span className={"tag " + (u.membership === "free" ? "tag-gray" : u.membership === "pro" ? "tag-blue" : "tag-yellow")}>{u.membership}</span></td>
                <td className="py-2">{u.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}

