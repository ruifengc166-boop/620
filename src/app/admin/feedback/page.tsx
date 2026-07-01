"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

const ratingText: Record<string, string> = { good: "好用", ok: "一般", bad: "不好用" };

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/feedback")
      .then(r => r.json())
      .then(d => { if (d.ok) { setItems(d.feedback || []); setSummary(d.summary || null); } })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-[#64748b]">正在加载反馈...</div>;

  const topReasons = Object.entries(summary?.reasons || {}).sort((a: any, b: any) => b[1] - a[1]).slice(0, 8);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2">💬 生成反馈</h1>
        <p className="text-xs text-[#64748b]">查看用户对生成结果的“好用/一般/不好用”反馈，用于优化 Prompt 引擎。</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">总反馈</div><div className="text-2xl font-bold text-[#1a56db]">{summary?.total || 0}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">好用</div><div className="text-2xl font-bold text-[#059669]">{summary?.good || 0}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">一般</div><div className="text-2xl font-bold text-[#d97706]">{summary?.ok || 0}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">不好用</div><div className="text-2xl font-bold text-[#dc2626]">{summary?.bad || 0}</div></div>
      </div>

      <div className="card p-5 mb-5">
        <h2 className="font-semibold text-sm mb-3">高频问题</h2>
        {topReasons.length === 0 ? <p className="text-xs text-[#94a3b8]">暂无问题标签</p> : <div className="flex flex-wrap gap-2">{topReasons.map(([k, v]: any) => <span key={k} className="px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#b91c1c] text-xs">{k} × {v}</span>)}</div>}
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-sm mb-3">最近反馈</h2>
        {items.length === 0 ? <p className="text-xs text-[#94a3b8]">暂无用户反馈</p> : <div className="space-y-3">{items.map((f: any) => <div key={f.id} className="border border-[#e2e8f0] rounded-lg p-3 bg-[#f8fafc]"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-medium text-[#1e293b]">{f.material_type || "未知材料"} · {ratingText[f.rating] || f.rating}</div><div className="text-[0.6rem] text-[#94a3b8] mt-0.5">{f.user_email || f.user_id} · {f.created_at}</div></div><span className={"tag text-[0.55rem] " + (f.rating === "good" ? "tag-green" : f.rating === "bad" ? "tag-red" : "tag-yellow")}>{ratingText[f.rating] || f.rating}</span></div>{f.reasons?.length ? <div className="flex flex-wrap gap-1.5 mt-2">{f.reasons.map((r: string) => <span key={r} className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[0.6rem] text-[#64748b]">{r}</span>)}</div> : null}{f.comment ? <p className="text-xs text-[#475569] mt-2 whitespace-pre-wrap">{f.comment}</p> : null}</div>)}</div>}
      </div>

      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
