"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

export default function AdminSystemPage() {
  const [data, setData] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/system")
      .then(r => r.json())
      .then(d => { if (d.ok) setData(d); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const postAction = async (body: any) => {
    setBusy(true); setMsg("");
    try {
      const r = await adminFetch("/api/admin/system", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      setMsg(d.msg || (d.ok ? "操作成功" : "操作失败"));
      load();
    } catch { setMsg("操作失败，请检查登录状态"); }
    finally { setBusy(false); setTimeout(() => setMsg(""), 3500); }
  };

  if (loading) return <div className="text-sm text-[#64748b]">正在加载系统状态...</div>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2">🛠 系统运维</h1>
          <p className="text-xs text-[#64748b] leading-relaxed max-w-3xl">公测前用于控制生成开关、查看运行时文件状态和手动备份关键数据。这里仅管理员可访问。</p>
        </div>
      </div>

      {msg && <div className="mb-4 p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg text-xs text-[#1d4ed8]">{msg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="card p-5">
          <div className="text-xs text-[#64748b] mb-1">普通用户生成状态</div>
          <div className={"text-lg font-bold " + (data?.generation_paused ? "text-[#dc2626]" : "text-[#059669]")}>{data?.generation_paused ? "已暂停" : "正常开放"}</div>
          <p className="text-[0.65rem] text-[#94a3b8] mt-2">暂停后，管理员仍可测试生成，普通用户会收到维护提示。</p>
          <button disabled={busy} onClick={() => postAction({ action: "set_generation_paused", paused: !data?.generation_paused })} className={(data?.generation_paused ? "btn-primary" : "btn-secondary") + " text-xs mt-4 py-2 px-3 disabled:opacity-60"}>{data?.generation_paused ? "恢复生成" : "一键暂停生成"}</button>
        </div>

        <div className="card p-5">
          <div className="text-xs text-[#64748b] mb-1">关键数据备份</div>
          <div className="text-lg font-bold text-[#1a56db]">手动快照</div>
          <p className="text-[0.65rem] text-[#94a3b8] mt-2">备份 db.json、prompt-engine.private.json、feedback.json 到 /data/backups。</p>
          <button disabled={busy} onClick={() => postAction({ action: "backup" })} className="btn-primary text-xs mt-4 py-2 px-3 disabled:opacity-60">立即备份</button>
        </div>

        <div className="card p-5">
          <div className="text-xs text-[#64748b] mb-1">公测提醒</div>
          <div className="text-lg font-bold text-[#7c3aed]">受控放量</div>
          <p className="text-[0.65rem] text-[#94a3b8] mt-2">建议先用小红书/公众号导入 50-100 个真实用户，观察生成成本和反馈。</p>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <h2 className="font-semibold text-sm mb-3">运行时文件状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[{key:"db",label:"用户/生成数据库"},{key:"prompt",label:"私有 Prompt 引擎"},{key:"feedback",label:"用户反馈"}].map(item => {
            const f = data?.files?.[item.key] || {};
            return <div key={item.key} className="rounded-lg border border-[#e2e8f0] p-3 bg-[#f8fafc]"><div className="font-medium text-sm text-[#1e293b]">{item.label}</div><div className="text-[0.65rem] text-[#64748b] mt-1">状态：{f.exists ? "存在" : "暂未生成"}</div><div className="text-[0.65rem] text-[#64748b]">大小：{f.size || 0} bytes</div><div className="text-[0.6rem] text-[#94a3b8] break-all">更新：{f.updated_at || "-"}</div></div>;
          })}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-sm mb-3">最近备份</h2>
        {!data?.backups?.length ? <p className="text-xs text-[#94a3b8]">暂无备份</p> : <div className="space-y-2">{data.backups.map((b: any) => <div key={b.name} className="flex items-center justify-between border-b border-[#f1f5f9] pb-2 text-xs"><span className="font-mono text-[#475569]">{b.name}</span><span className="text-[#94a3b8]">{b.size} bytes · {b.updated_at}</span></div>)}</div>}
      </div>

      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
