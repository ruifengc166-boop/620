"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

export default function AdminWechatBindingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    adminFetch("/api/admin/wechat-bindings")
      .then(r => r.json())
      .then(d => { if (d.ok) { setRows(d.rows || []); setSummary(d.summary || null); } })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-[#64748b]">正在加载公众号绑定数据...</div>;

  const filtered = rows.filter(r => filter === "all" ? true : filter === "bound" ? r.bound : filter === "pending" ? r.latest_status === "pending" : !r.bound && r.latest_status !== "pending");

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2">📮 公众号绑定用户</h1>
        <p className="text-xs text-[#64748b]">查看网站账号与公众号 openid 的绑定状态，用于公测用户运营和额度排查。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">普通用户</div><div className="text-2xl font-bold text-[#1a56db]">{summary?.total_users || 0}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">已绑定</div><div className="text-2xl font-bold text-[#059669]">{summary?.bound_users || 0}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">待回复绑定码</div><div className="text-2xl font-bold text-[#d97706]">{summary?.pending_codes || 0}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">绑定记录</div><div className="text-2xl font-bold text-[#7c3aed]">{summary?.binding_records || 0}</div></div>
      </div>

      <div className="card p-5 mb-5">
        <div className="flex flex-wrap gap-2">
          {[{k:"all",v:"全部"},{k:"bound",v:"已绑定"},{k:"pending",v:"待回复"},{k:"none",v:"未绑定"}].map(f => <button key={f.k} onClick={() => setFilter(f.k)} className={"px-3 py-1.5 rounded-lg border text-xs " + (filter === f.k ? "bg-[#eff6ff] border-[#93c5fd] text-[#1d4ed8]" : "bg-white border-[#e2e8f0] text-[#64748b]")}>{f.v}</button>)}
        </div>
      </div>

      <div className="card p-5 overflow-x-auto">
        {filtered.length === 0 ? <p className="text-xs text-[#94a3b8]">暂无数据</p> : <table className="min-w-full text-xs">
          <thead><tr className="text-left text-[#64748b] border-b border-[#e2e8f0]"><th className="py-2 pr-4">用户</th><th className="py-2 pr-4">状态</th><th className="py-2 pr-4">openid</th><th className="py-2 pr-4">额度</th><th className="py-2 pr-4">绑定/生成时间</th><th className="py-2 pr-4">绑定码</th></tr></thead>
          <tbody>{filtered.map((r: any) => <tr key={r.user_id} className="border-b border-[#f1f5f9] last:border-0"><td className="py-3 pr-4"><div className="font-medium text-[#1e293b]">{r.nickname || "未命名"}</div><div className="text-[0.6rem] text-[#94a3b8]">{r.email}</div></td><td className="py-3 pr-4"><span className={"tag text-[0.55rem] " + (r.bound ? "tag-green" : r.latest_status === "pending" ? "tag-yellow" : "tag-gray")}>{r.bound ? "已绑定" : r.latest_status === "pending" ? "待回复" : "未绑定"}</span></td><td className="py-3 pr-4 text-[#64748b] font-mono">{r.openid_tail ? "***" + r.openid_tail : "-"}</td><td className="py-3 pr-4 text-[#475569]">{r.points_balance} 点<br/><span className="text-[0.55rem] text-[#94a3b8]">{r.membership_level}</span></td><td className="py-3 pr-4 text-[#64748b]">{r.wechat_bound_at || r.latest_created_at || "-"}</td><td className="py-3 pr-4 text-[#64748b] font-mono">{r.latest_code || "-"}<br/>{r.latest_expires_at ? <span className="text-[0.55rem] text-[#94a3b8]">过期：{r.latest_expires_at}</span> : null}</td></tr>)}</tbody>
        </table>}
      </div>

      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
