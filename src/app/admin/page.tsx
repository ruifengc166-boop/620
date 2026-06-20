"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    adminFetch("/api/admin/stats").then(r => r.json()).then(d => d.ok && setStats(d.stats)).catch(() => {});
    adminFetch("/api/admin/users").then(r => r.json()).then(d => d.ok && setUsers(d.users)).catch(() => {});
    adminFetch("/api/admin/models").then(r => r.json()).then(d => d.ok && setModels(d.models)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">📊 管理概览</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ label: "注册用户", val: stats?.total_users||0, color: "text-[#1a56db]" },
          { label: "生成次数", val: stats?.total_generations||0, color: "text-[#059669]" },
          { label: "已保存材料", val: stats?.total_materials||0, color: "text-[#d97706]" },
          { label: "活跃模型", val: stats?.active_models||0, color: "text-[#7c3aed]" },
        ].map(s => (
          <div key={s.label} className="card p-4 md:p-5">
            <div className="text-xs text-[#64748b] mb-1">{s.label}</div>
            <div className={"text-2xl md:text-3xl font-bold " + s.color}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-3">最近注册用户</h2>
          {users.length === 0 ? <p className="text-xs text-[#94a3b8]">暂无用户</p> : (
            <div className="space-y-2">{users.slice(-5).reverse().map((u: any) => (
              <div key={u.id} className="flex items-center justify-between py-1.5 border-b border-[#f1f5f9] last:border-0">
                <div><div className="text-sm font-medium">{u.nickname}</div><div className="text-[0.6rem] text-[#94a3b8]">{u.email}</div></div>
                <span className="tag tag-blue text-[0.55rem]">{u.membership}</span>
              </div>
            ))}</div>
          )}
        </div>

        {/* Model Config */}
        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-3">模型配置状态</h2>
          <div className="space-y-2">
            {models.map((m: any) => (
              <div key={m.provider} className="flex items-center justify-between py-1.5 border-b border-[#f1f5f9] last:border-0">
                <div><div className="text-sm font-medium capitalize">{m.provider}</div><div className="text-[0.55rem] text-[#94a3b8]">{m.model_name}</div></div>
                <span className={"tag " + (m.is_active ? "tag-green" : "tag-gray") + " text-[0.55rem]"}>
                  {m.is_active ? "已启用" : "已禁用"}
                  {m.api_key ? " 🔑" : " ⚠️"}
                </span>
              </div>
            ))}
          </div>
          <Link href="/admin/models" className="block mt-4 text-xs text-[#1a56db] hover:underline text-center">管理模型配置 →</Link>
        </div>
      </div>
      <p className="mt-8 text-xs text-[#94a3b8] text-center">正在使用 JSON 文件数据库，数据存储在 /data/db.json</p>
    </div>
  );
}

