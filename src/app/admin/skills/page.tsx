"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

export default function AdminSkills() {
  const [examples, setExamples] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [newExample, setNewExample] = useState({ name: "", source_content: "" });
  const [viewDetail, setViewDetail] = useState<string | null>(null);
  const [autoSource, setAutoSource] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/skills").then(r => r.json()).then(d => {
      if (d.ok) setExamples(d.examples || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const addManual = async () => {
    if (!newExample.name || !newExample.source_content) { setMsg("请填写名称和内容"); setTimeout(() => setMsg(""), 2000); return; }
    const r = await adminFetch("/api/admin/skills", { method: "POST", body: JSON.stringify({ name: newExample.name, source_content: newExample.source_content }) });
    const d = await r.json();
    if (d.ok) { setExamples([...(d.example ? [d.example] : []), ...examples]); setNewExample({ name: "", source_content: "" }); }
    setMsg(d.msg || "已保存"); setTimeout(() => setMsg(""), 2000);
  };

  const autoGenerate = async () => {
    if (!autoSource) { setMsg("请粘贴范本内容"); setTimeout(() => setMsg(""), 2000); return; }
    const name = "范本-" + new Date().toLocaleDateString("zh-CN");
    const r = await adminFetch("/api/admin/skills", { method: "POST", body: JSON.stringify({ action: "auto_generate", name, source_content: autoSource }) });
    const d = await r.json();
    if (d.ok && d.example) { setExamples([d.example, ...examples]); setAutoSource(""); }
    setMsg(d.msg || "已生成"); setTimeout(() => setMsg(""), 2000);
  };

  const deleteExample = async (id: string) => {
    if (!window.confirm("确定删除该范本？")) return;
    await adminFetch("/api/admin/skills", { method: "DELETE", body: JSON.stringify({ id }) });
    setExamples(examples.filter(e => e.id !== id));
    setMsg("已删除"); setTimeout(() => setMsg(""), 2000);
  };

  const toggleActive = async (ex: any) => {
    const r = await adminFetch("/api/admin/skills", { method: "POST", body: JSON.stringify({ action: "update", id: ex.id, updates: { is_active: !ex.is_active } }) });
    const d = await r.json();
    if (d.ok) setExamples(examples.map(e => e.id === ex.id ? { ...e, is_active: !e.is_active } : e));
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">🧠 优秀范本学习</h1>
      <p className="text-xs text-[#64748b] mb-4">上传优秀材料范本，系统自动提取写作模式，生成可复用的技能Prompt。</p>
      {msg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Manual Input */}
        <div className="card p-4">
          <h2 className="font-semibold text-sm mb-3">📝 手动录入范本</h2>
          <div className="space-y-3">
            <div><label className="block text-xs font-medium text-[#475569] mb-1">名称</label>
              <input className="form-input text-xs" placeholder="如：某社区反诈宣传活动总结范本" value={newExample.name} onChange={e => setNewExample({...newExample, name: e.target.value})} /></div>
            <div><label className="block text-xs font-medium text-[#475569] mb-1">范本正文</label>
              <textarea className="form-input text-xs min-h-[120px] resize-y" placeholder="粘贴优秀材料全文..." value={newExample.source_content} onChange={e => setNewExample({...newExample, source_content: e.target.value})} /></div>
            <button onClick={addManual} className="btn-primary text-xs py-2 px-4">保存范本</button>
          </div>
        </div>

        {/* Auto Generate */}
        <div className="card p-4 border-[#1a56db]/30">
          <h2 className="font-semibold text-sm mb-3">🤖 自动归纳生成技能</h2>
          <div className="space-y-3">
            <div><label className="block text-xs font-medium text-[#475569] mb-1">粘贴优秀范本全文</label>
              <p className="text-[0.55rem] text-[#94a3b8] mb-1">系统自动分析范本的结构、风格和表达方式，提取可复用的写作模式</p>
              <textarea className="form-input text-xs min-h-[120px] resize-y" placeholder="将优秀材料全文粘贴在此，系统自动分析并生成技能Prompt..." value={autoSource} onChange={e => setAutoSource(e.target.value)} /></div>
            <button onClick={autoGenerate} className="btn-primary text-xs py-2 px-4 bg-[#7c3aed] hover:bg-[#6d28d9]">⚡ 自动归纳生成技能</button>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <h2 className="font-semibold text-sm mb-3">已保存的范本 / 技能（{examples.length}）</h2>
      {loading ? (
        <div className="card p-8 text-center text-xs text-[#94a3b8]">加载中...</div>
      ) : examples.length === 0 ? (
        <div className="card p-8 text-center text-xs text-[#94a3b8]">暂无范本，请通过上方方式添加</div>
      ) : (
        <div className="space-y-2">
          {examples.map(ex => (
            <div key={ex.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={"w-2 h-2 rounded-full " + (ex.is_active ? "bg-[#16a34a]" : "bg-[#d1d5db]")}></span>
                    <span className="font-semibold text-sm">{ex.name}</span>
                    <span className="text-[0.55rem] text-[#64748b]">{ex.category}</span>
                    {ex.source_type === "auto_extracted" && <span className="tag tag-yellow text-[0.5rem]">自动生成</span>}
                    <span className="text-[0.5rem] text-[#94a3b8]">使用{ex.usage_count || 0}次</span>
                  </div>
                  <p className="text-[0.6rem] text-[#64748b] mt-1 line-clamp-2">{ex.extracted_pattern?.slice(0, 200) || ex.source_content?.slice(0, 200)}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-3">
                  <button onClick={() => setViewDetail(viewDetail === ex.id ? null : ex.id)} className="btn-sm text-xs btn-secondary">{viewDetail === ex.id ? "收起" : "详情"}</button>
                  <button onClick={() => toggleActive(ex)} className={"btn-sm text-xs " + (ex.is_active ? "btn-secondary" : "btn-primary")}>{ex.is_active ? "启用" : "禁用"}</button>
                  <button onClick={() => deleteExample(ex.id)} className="btn-sm text-xs text-[#dc2626] hover:underline">删除</button>
                </div>
              </div>
              {viewDetail === ex.id && (
                <div className="mt-3 pt-3 border-t border-[#e2e8f0] space-y-2">
                  <div><span className="text-[0.6rem] font-medium text-[#475569]">来源内容：</span>
                    <p className="text-[0.6rem] text-[#64748b] mt-0.5 whitespace-pre-wrap">{ex.source_content}</p></div>
                  <div><span className="text-[0.6rem] font-medium text-[#475569]">提取的模式（Skill Prompt）：</span>
                    <pre className="text-[0.55rem] text-[#166534] bg-[#f0fdf4] p-2 rounded mt-0.5 whitespace-pre-wrap">{ex.extracted_pattern}</pre></div>
                  <div><span className="text-[0.6rem] font-medium text-[#475569]">systemPrompt 覆盖：</span>
                    <p className="text-[0.55rem] text-[#64748b]">{ex.system_prompt_override || "无"}</p></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}