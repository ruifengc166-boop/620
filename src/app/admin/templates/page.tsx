"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Tmpl {
  id: string; name: string; category: string; priority_level: string;
  description: string; output_materials: string[]; is_active: boolean;
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Tmpl[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [newTpl, setNewTpl] = useState<Partial<Tmpl>>({});

  useEffect(() => {
    adminFetch("/api/admin/templates").then(r => r.json()).then(d => d.ok && setTemplates(d.templates)).catch(() => {});
  }, []);

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
    const tpl: Tmpl = { id: Date.now().toString(36), name: newTpl.name, category: newTpl.category || "其他", priority_level: "P2", description: newTpl.description || "", output_materials: [], is_active: true };
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

  const categories = ["党政机关活动","社区活动","招商产业活动","文旅品牌活动","大赛征集活动","新闻传播活动"];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">[模板] 模板管理</h1>
      {msg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">{msg}</div>}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold text-sm mb-3">[+] 添加模板</h2>
        <div className="flex flex-wrap gap-2">
          <input className="form-input text-xs flex-1 min-w-[200px]" placeholder="模板名称" value={newTpl.name || ""} onChange={e => setNewTpl({...newTpl, name: e.target.value})} />
          <select className="form-select text-xs" value={newTpl.category || ""} onChange={e => setNewTpl({...newTpl, category: e.target.value})}>
            <option value="">选择分类</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-[#475569] mb-1">名称</label><input className="form-input text-xs" value={tpl.name} onChange={e => {const t = {...tpl,name:e.target.value}; setTemplates(templates.map(x=>x.id===t.id?t:x))}} /></div>
                  <div><label className="block text-xs font-medium text-[#475569] mb-1">分类</label><select className="form-select text-xs" value={tpl.category} onChange={e => {const t = {...tpl,category:e.target.value}; setTemplates(templates.map(x=>x.id===t.id?t:x))}}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1">描述</label><textarea className="form-input text-xs min-h-[50px]" value={tpl.description} onChange={e => {const t = {...tpl,description:e.target.value}; setTemplates(templates.map(x=>x.id===t.id?t:x))}} /></div>
                  <div><label className="block text-xs font-medium text-[#475569] mb-1">优先级</label><select className="form-select text-xs" value={tpl.priority_level} onChange={e => {const t = {...tpl,priority_level:e.target.value}; setTemplates(templates.map(x=>x.id===t.id?t:x))}}><option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option></select></div>
                  <div><label className="block text-xs font-medium text-[#475569] mb-1">活动</label>
                    <div className="flex gap-1 mb-1">
                      <input className="form-input text-xs flex-1" placeholder="材料" id={"m_"+tpl.id} onKeyDown={e => {if(e.key==="Enter"){const el=document.getElementById("m_"+tpl.id)as HTMLInputElement;if(el&&el.value.trim()){const t={...tpl,output_materials:[...tpl.output_materials,el.value.trim()]};setTemplates(templates.map(x=>x.id===t.id?t:x));el.value=""}}}}/>
                    </div>
                    <div className="flex flex-wrap gap-1">{tpl.output_materials.map((m,i) => <span key={i} className="tag tag-gray text-[0.55rem]">{m} <button onClick={() => {const t={...tpl,output_materials:tpl.output_materials.filter((_,j)=>j!==i)};setTemplates(templates.map(x=>x.id===t.id?t:x))}} className="ml-0.5 text-[#dc2626]">x</button></span>)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveTmpl(tpl)} className="btn-primary text-xs py-2 px-4">保存</button>
                  <button onClick={() => setEditId(null)} className="btn-secondary text-xs py-2 px-4">取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={"w-2 h-2 rounded-full " + (tpl.is_active ? "bg-[#16a34a]" : "bg-[#d1d5db]")}></span>
                    <span className="font-semibold text-sm">{tpl.name}</span>
                    <span className={"tag text-[0.55rem] " + (tpl.priority_level === "P0" ? "tag-blue" : tpl.priority_level === "P1" ? "tag-yellow" : "tag-gray")}>{tpl.priority_level}</span>
                    <span className="text-[0.55rem] text-[#64748b]">{tpl.category}</span>
                  </div>
                  <p className="text-[0.65rem] text-[#64748b] mt-0.5">{tpl.description}</p>
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
