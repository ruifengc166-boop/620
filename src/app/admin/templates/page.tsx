"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Tmpl {
  id: string; name: string; category: string; priority_level: string;
  description: string; output_materials: string[]; is_active: boolean;
  marketplace_title?: string; marketplace_subtitle?: string;
  selling_points?: string[]; suitable_for?: string[]; scenario_tags?: string[];
  core_materials?: string[]; delivery_value?: string; sample_preview?: string;
  cover_icon?: string; price_label?: string; sort_order?: number; is_featured?: boolean;
}

const emptyList = (v?: string[]) => Array.isArray(v) ? v : [];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Tmpl[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [newTpl, setNewTpl] = useState<Partial<Tmpl>>({});

  useEffect(() => {
    adminFetch("/api/admin/templates").then(r => r.json()).then(d => d.ok && setTemplates(d.templates)).catch(() => {});
  }, []);

  const patchTemplate = (id: string, updates: Partial<Tmpl>) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addListItem = (tpl: Tmpl, key: keyof Tmpl, inputId: string) => {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    const value = el?.value.trim();
    if (!value) return;
    const current = emptyList(tpl[key] as string[] | undefined);
    patchTemplate(tpl.id, { [key]: [...current, value] } as Partial<Tmpl>);
    if (el) el.value = "";
  };

  const removeListItem = (tpl: Tmpl, key: keyof Tmpl, index: number) => {
    const current = emptyList(tpl[key] as string[] | undefined);
    patchTemplate(tpl.id, { [key]: current.filter((_, i) => i !== index) } as Partial<Tmpl>);
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const tpl = templates.find(t => t.id === id);
    if (tpl) {
      await adminFetch("/api/admin/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...tpl, is_active }) });
      setTemplates(templates.map(t => t.id === id ? { ...t, is_active } : t));
      setMsg("已更新"); setTimeout(() => setMsg(""), 2000);
    }
  };

  const saveTmpl = async (tpl: Tmpl) => {
    await adminFetch("/api/admin/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tpl) });
    setTemplates(templates.map(t => t.id === tpl.id ? tpl : t));
    setEditId(null); setMsg("已保存"); setTimeout(() => setMsg(""), 2000);
  };

  const addTemplate = async () => {
    if (!newTpl.name) return;
    const tpl: Tmpl = {
      id: Date.now().toString(36), name: newTpl.name, category: newTpl.category || "其他",
      priority_level: "P2", description: newTpl.description || "", output_materials: [], is_active: true,
      marketplace_title: newTpl.name + "材料包", marketplace_subtitle: newTpl.description || "一次填写活动信息，生成整套材料包",
      selling_points: [], suitable_for: [], scenario_tags: [], core_materials: [], delivery_value: "", sample_preview: "",
      cover_icon: "📦", price_label: "", sort_order: 100, is_featured: false,
    };
    await adminFetch("/api/admin/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tpl) });
    setTemplates([...templates, tpl]);
    setNewTpl({}); setMsg("已添加"); setTimeout(() => setMsg(""), 2000);
  };

  const deleteTemplate = async (id: string) => {
    if (!window.confirm("确定删除该模板？")) return;
    await adminFetch("/api/admin/templates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTemplates(templates.filter(t => t.id !== id));
    setMsg("已删除"); setTimeout(() => setMsg(""), 2000);
  };

  const categories = ["党政机关活动","社区活动","招商产业活动","文旅品牌活动","大赛征集活动","新闻传播活动","其他"];

  const renderTagEditor = (tpl: Tmpl, key: keyof Tmpl, label: string, placeholder: string) => {
    const inputId = `${String(key)}_${tpl.id}`;
    const values = emptyList(tpl[key] as string[] | undefined);
    return (
      <div>
        <label className="block text-xs font-medium text-[#475569] mb-1">{label}</label>
        <div className="flex gap-1 mb-1">
          <input className="form-input text-xs flex-1" placeholder={placeholder} id={inputId} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addListItem(tpl, key, inputId); } }} />
          <button type="button" onClick={() => addListItem(tpl, key, inputId)} className="btn-secondary text-xs py-1 px-2">添加</button>
        </div>
        <div className="flex flex-wrap gap-1">{values.map((m, i) => <span key={i} className="tag tag-gray text-[0.55rem]">{m} <button onClick={() => removeListItem(tpl, key, i)} className="ml-0.5 text-[#dc2626]">x</button></span>)}</div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">📐 模板管理</h1>
      {msg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">{msg}</div>}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold text-sm mb-3">➕ 添加模板</h2>
        <div className="flex flex-wrap gap-2">
          <input className="form-input text-xs flex-1 min-w-[200px]" placeholder="模板名称" value={newTpl.name || ""} onChange={e => setNewTpl({...newTpl, name: e.target.value})} />
          <select className="form-select text-xs" value={newTpl.category || ""} onChange={e => setNewTpl({...newTpl, category: e.target.value})}>
            <option value="">选择分类</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="form-input text-xs flex-1 min-w-[200px]" placeholder="描述" value={newTpl.description || ""} onChange={e => setNewTpl({...newTpl, description: e.target.value})} />
          <button onClick={addTemplate} className="btn-primary text-xs py-2 px-4">添加</button>
        </div>
      </div>
      <div className="space-y-2">
        {templates.length === 0 && <div className="card p-8 text-center text-xs text-[#94a3b8]">暂无模板数据</div>}
        {templates.map(tpl => (
          <div key={tpl.id} className="card p-4">
            {editId === tpl.id ? (
              <div className="space-y-5">
                <section>
                  <h2 className="font-semibold text-sm mb-3">基础信息</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">名称</label><input className="form-input text-xs" value={tpl.name} onChange={e => patchTemplate(tpl.id, { name: e.target.value })} /></div>
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">分类</label><select className="form-select text-xs" value={tpl.category} onChange={e => patchTemplate(tpl.id, { category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1">描述</label><textarea className="form-input text-xs min-h-[50px]" value={tpl.description} onChange={e => patchTemplate(tpl.id, { description: e.target.value })} /></div>
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">优先级</label><select className="form-select text-xs" value={tpl.priority_level} onChange={e => patchTemplate(tpl.id, { priority_level: e.target.value })}><option value="P0">P0 深度</option><option value="P1">P1 常用</option><option value="P2">P2 轻量</option></select></div>
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">排序</label><input className="form-input text-xs" type="number" value={tpl.sort_order ?? 100} onChange={e => patchTemplate(tpl.id, { sort_order: Number(e.target.value) })} /></div>
                  </div>
                </section>

                <section>
                  <h2 className="font-semibold text-sm mb-3">模板广场展示内容</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">广场标题</label><input className="form-input text-xs" value={tpl.marketplace_title || ""} onChange={e => patchTemplate(tpl.id, { marketplace_title: e.target.value })} /></div>
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">卡片图标</label><input className="form-input text-xs" value={tpl.cover_icon || ""} placeholder="如：📦" onChange={e => patchTemplate(tpl.id, { cover_icon: e.target.value })} /></div>
                    <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1">一句话卖点</label><textarea className="form-input text-xs min-h-[50px]" value={tpl.marketplace_subtitle || ""} onChange={e => patchTemplate(tpl.id, { marketplace_subtitle: e.target.value })} /></div>
                    <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1">交付价值</label><textarea className="form-input text-xs min-h-[60px]" value={tpl.delivery_value || ""} onChange={e => patchTemplate(tpl.id, { delivery_value: e.target.value })} /></div>
                    <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1">样例预览</label><textarea className="form-input text-xs min-h-[70px]" value={tpl.sample_preview || ""} onChange={e => patchTemplate(tpl.id, { sample_preview: e.target.value })} /></div>
                    <div><label className="block text-xs font-medium text-[#475569] mb-1">价格/点数标签</label><input className="form-input text-xs" value={tpl.price_label || ""} placeholder="如：10份材料 / 30点" onChange={e => patchTemplate(tpl.id, { price_label: e.target.value })} /></div>
                    <label className="flex items-center gap-2 text-xs text-[#475569] mt-5"><input type="checkbox" checked={!!tpl.is_featured} onChange={e => patchTemplate(tpl.id, { is_featured: e.target.checked })} /> 模板广场推荐</label>
                    {renderTagEditor(tpl, "selling_points", "卖点标签", "如：覆盖会前会中会后")}
                    {renderTagEditor(tpl, "suitable_for", "适合对象", "如：街道办")}
                    {renderTagEditor(tpl, "scenario_tags", "适用场景", "如：政策宣讲")}
                    {renderTagEditor(tpl, "core_materials", "核心材料", "如：活动方案")}
                  </div>
                </section>

                <section>
                  <h2 className="font-semibold text-sm mb-3">生成配置</h2>
                  {renderTagEditor(tpl, "output_materials", "输出材料清单", "如：新闻稿")}
                </section>

                <div className="flex gap-2">
                  <button onClick={() => saveTmpl(tpl)} className="btn-primary text-xs py-2 px-4">保存</button>
                  <button onClick={() => setEditId(null)} className="btn-secondary text-xs py-2 px-4">取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={"w-2 h-2 rounded-full " + (tpl.is_active ? "bg-[#16a34a]" : "bg-[#d1d5db]")}></span>
                    <span className="font-semibold text-sm">{tpl.marketplace_title || tpl.name}</span>
                    <span className={"tag text-[0.55rem] " + (tpl.priority_level === "P0" ? "tag-blue" : tpl.priority_level === "P1" ? "tag-yellow" : "tag-gray")}>{tpl.priority_level}</span>
                    {tpl.is_featured && <span className="tag tag-yellow text-[0.55rem]">推荐</span>}
                    <span className="text-[0.55rem] text-[#64748b]">{tpl.category}</span>
                  </div>
                  <p className="text-[0.65rem] text-[#64748b] mt-0.5">{tpl.marketplace_subtitle || tpl.description}</p>
                  <p className="text-[0.55rem] text-[#94a3b8] mt-0.5">{tpl.output_materials?.join(" | ") || ""}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-3">
                  <button onClick={() => setEditId(tpl.id)} className="btn-sm text-xs btn-secondary">编辑</button>
                  <button onClick={() => toggleActive(tpl.id, !tpl.is_active)} className={"btn-sm text-xs " + (tpl.is_active ? "btn-secondary" : "btn-primary")}>{tpl.is_active ? "禁用" : "启用"}</button>
                  <button onClick={() => deleteTemplate(tpl.id)} className="btn-sm text-xs text-[#dc2626] hover:underline">删除</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
