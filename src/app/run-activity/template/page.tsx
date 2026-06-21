"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { activityTemplates as fallbackTemplates, templateCategoryIcons } from "@/data/templates";
import { exportWord, exportMaterialPackage } from "@/lib/export";

type TemplateItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  materialCount?: number;
  materials?: string[];
  output_materials?: string[];
  marketplace_title?: string;
  marketplace_subtitle?: string;
};

function normalizeFallback(t: any): TemplateItem {
  const materials = t.materials || t.output_materials || [];
  return { ...t, materials, output_materials: materials, materialCount: t.materialCount || materials.length };
}

export default function TemplateDetailWrapper() {
  return <Suspense fallback={<div className="container-app py-12 text-center text-[#64748b]">加载中...</div>}><TemplateDetail /></Suspense>;
}

function TemplateDetail() {
  const sp = useSearchParams();
  const tid = sp.get("id") || "";
  const source = sp.get("source") || "";
  const [step, setStep] = useState("info");
  const [form, setForm] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState("");
  const [templates, setTemplates] = useState<TemplateItem[]>(fallbackTemplates.map(normalizeFallback));
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterials, setGeneratedMaterials] = useState<Record<string, string>>({});
  const [generateError, setGenerateError] = useState("");

  useEffect(() => {
    fetch("/api/templates")
      .then(r => r.json())
      .then(d => { if (d.ok && Array.isArray(d.templates)) setTemplates(d.templates); })
      .catch(() => {})
      .finally(() => setLoadingTemplates(false));
  }, []);

  const tmpl = useMemo(() => templates.find(t => t.id === tid), [templates, tid]);
  const materials = useMemo(() => tmpl ? (tmpl.output_materials || tmpl.materials || []) : [], [tmpl]);

  useEffect(() => {
    if (tmpl) setSelected(materials.slice(0, Math.min(6, materials.length)));
  }, [tmpl?.id]);

  if (loadingTemplates) return <div className="container-app py-12 text-center text-[#64748b]">加载模板中...</div>;
  if (!tmpl) return <div className="container-app py-12 text-center text-[#64748b]">未找到模板<Link href={source === "marketplace" ? "/templates" : "/run-activity"} className="text-[#1a56db] ml-2">返回</Link></div>;

  const toggleMat = (m: string) => setSelected((p: string[]) => p.includes(m) ? p.filter((x: string) => x !== m) : [...p, m]);
  const setF = (k: string, v: string) => setForm((p: Record<string, string>) => ({ ...p, [k]: v }));
  const materialToTaskType: Record<string, string> = {
    "活动方案":"活动方案","会议方案":"活动方案","招商活动方案":"活动方案","开幕方案":"活动方案","签约方案":"活动方案","培训方案":"活动方案","推介方案":"活动方案","发布方案":"活动方案","大会方案":"活动方案","工作方案":"活动方案",
    "主持词":"主持词",
    "领导致辞初稿":"领导致辞初稿","领导讲话初稿":"领导致辞初稿","书记讲话初稿":"领导致辞初稿","领导开班讲话":"领导致辞初稿",
    "新闻稿":"新闻稿","媒体通稿":"新闻稿","新闻通稿":"新闻稿",
    "公众号推文":"公众号推文",
    "居民通知":"活动通知","活动通知":"活动通知","会议通知":"活动通知","培训通知":"活动通知",
    "企业邀请函":"邀请函","嘉宾邀请函":"邀请函","媒体邀请函":"邀请函",
    "活动总结":"活动总结","培训总结":"活动总结",
    "工作简报":"工作简报",
    "任务分解表":"任务分工表","任务分工表":"任务分工表","志愿者分工表":"任务分工表",
    "流程表":"活动流程表","签约流程表":"活动流程表","会议议程":"活动流程表","学习议程":"活动流程表","课程安排表":"活动流程表",
    "政策解读稿":"政策解读稿","企业/群众问答手册":"企业/群众问答手册","问答手册":"问答手册",
    "会议纪要":"会议纪要","项目洽谈纪要":"会议纪要","问题协调纪要":"会议纪要",
    "台账材料":"台账材料","问题台账":"台账材料","自查整改台账":"台账材料",
    "照片说明":"照片说明","宣传单页文案":"宣传单页文案","现场物料文案":"现场物料文案","现场文案":"现场物料文案",
  };

  const buildInput = () => ({
    activity_name: form.name, host_unit: form.host, organizer_unit: form.organizer,
    activity_time: form.time, activity_location: form.location,
    participants: form.participants, attendance_count: form.attendance,
    activity_background: form.background, activity_type: tmpl.name,
    template_name: tmpl.name, template_category: tmpl.category,
  });

  const handleGeneratePackage = async () => {
    const requiredActivityFields: [string, string][] = [["name", "活动名称"], ["time", "活动时间"], ["location", "活动地点"], ["background", "活动背景与目的"]];
    for (const [key, label] of requiredActivityFields) {
      if (!String(form[key] || "").trim()) { setGenerateError(`请先填写${label}`); setStep("info"); return; }
    }
    if (selected.length === 0) { setGenerateError("请至少选择一份材料"); return; }
    setIsGenerating(true); setGenerateError(""); setStep("generating");
    const session = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("banhui_session") || "null") : null;
    const next: Record<string, string> = {};
    for (const mat of selected) {
      try {
        const taskType = materialToTaskType[mat] || mat;
        const res = await fetch("/api/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "official", task_type: taskType, cards: ["official"], input: { ...buildInput(), package_material_name: mat, package_generation: "yes" }, user_id: session?.userId || null }),
        });
        const data = await res.json();
        next[mat] = data.ok && data.results?.[0]?.content ? data.results[0].content : "【" + mat + "】生成失败：" + (data.msg || "请稍后重试");
      } catch { next[mat] = "【" + mat + "】生成失败：网络错误"; }
    }
    setGeneratedMaterials(next); setIsGenerating(false); setStep("result");
  };

  const steps = [{ key: "info", label: "活动信息", num: 1 }, { key: "materials", label: "选择材料", num: 2 }, { key: "generating", label: "生成中", num: 3 }, { key: "result", label: "生成结果", num: 4 }];
  const backHref = source === "marketplace" ? "/templates" : "/run-activity";

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-4"><Link href={backHref} className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回</Link></div>
      <div className="flex items-center justify-center gap-2 mb-6 text-sm">
        {steps.map((s,i) => <div key={s.key} className="flex items-center gap-2"><div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " + (step===s.key?"bg-[#1a56db] text-white":"bg-[#e2e8f0] text-[#94a3b8]")}>{s.num}</div><span className={"text-xs " + (step===s.key?"text-[#1a56db] font-medium":"text-[#94a3b8]")}>{s.label}</span>{i<3 && <span className="text-[#d1d5db] mx-1">&rarr;</span>}</div>)}
      </div>

      {step === "info" && <div className="max-w-3xl mx-auto"><div className="card p-6">
        <div className="flex items-center gap-3 mb-6"><div className="text-3xl">{templateCategoryIcons[tmpl.category]||"📋"}</div><div><h1 className="text-xl font-bold">{tmpl.marketplace_title || tmpl.name}</h1><p className="text-sm text-[#64748b]">{tmpl.marketplace_subtitle || tmpl.description}（{tmpl.materialCount || materials.length}份材料）</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1.5">活动名称 *</label><input className="form-input" placeholder={"如：XX区"+tmpl.name} value={form.name||""} onChange={e=>setF("name",e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-[#475569] mb-1.5">主办单位</label><input className="form-input" placeholder="主办单位" value={form.host||""} onChange={e=>setF("host",e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-[#475569] mb-1.5">承办单位</label><input className="form-input" placeholder="承办单位" value={form.organizer||""} onChange={e=>setF("organizer",e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-[#475569] mb-1.5">活动时间 *</label><input className="form-input" placeholder="如：2026年7月" value={form.time||""} onChange={e=>setF("time",e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-[#475569] mb-1.5">活动地点 *</label><input className="form-input" placeholder="活动地点" value={form.location||""} onChange={e=>setF("location",e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-[#475569] mb-1.5">参与对象</label><input className="form-input" placeholder="参与对象" value={form.participants||""} onChange={e=>setF("participants",e.target.value)}/></div>
          <div><label className="block text-xs font-medium text-[#475569] mb-1.5">预计人数</label><input className="form-input" placeholder="如：100人" value={form.attendance||""} onChange={e=>setF("attendance",e.target.value)}/></div>
          <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1.5">活动背景与目的 *</label><textarea className="form-input min-h-[80px] resize-y" placeholder="活动开展背景和主要目的" value={form.background||""} onChange={e=>setF("background",e.target.value)}/></div>
        </div>
        <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg mb-4 text-xs text-[#92400e]">请勿输入涉密、内部、隐私或商业秘密内容。</div>
        {generateError && <div className="mb-4 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-xs text-[#dc2626]">{generateError}</div>}
        <button onClick={()=>setStep("materials")} className="btn-primary w-full justify-center py-3 text-base">下一步：选择材料</button>
      </div></div>}

      {step === "materials" && <div className="max-w-3xl mx-auto"><div className="card p-6">
        <h2 className="font-semibold mb-4">选择需要生成的材料（可多选）</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">{materials.map(m => { const checked = selected.includes(m); return <button key={m} onClick={()=>toggleMat(m)} className={"p-3 rounded-lg border text-sm text-left transition-all flex items-center gap-2 " + (checked?"border-[#059669] bg-[#f0fdf4] text-[#166534]":"border-[#e2e8f0] text-[#475569] hover:border-[#94a3b8]")}><span className={"w-5 h-5 rounded border flex items-center justify-center text-xs " + (checked?"bg-[#059669] text-white border-[#059669]":"border-[#d1d5db]")}>{checked?"✓":""}</span>{m}</button> })}</div>
        <div className="text-xs text-[#64748b] mb-4">已选 {selected.length}/{materials.length} 份材料</div>
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg mb-4 text-xs text-[#166534]">本工具仅生成材料初稿。政策依据、数据、姓名、职务等信息必须由用户自行核实。</div>
        <div className="flex gap-3"><button onClick={()=>setStep("info")} className="btn-secondary">上一步</button><button onClick={handleGeneratePackage} className="btn-primary flex-1 justify-center py-3 text-base" disabled={selected.length===0||isGenerating}>{isGenerating ? "正在生成..." : `✨ 生成 ${selected.length} 份材料`}</button></div>
      </div></div>}

      {step === "generating" && <div className="max-w-md mx-auto card p-8 text-center"><div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#dbeafe] border-t-[#1a56db] animate-spin" /><h2 className="text-lg font-semibold mb-2">正在生成活动材料包</h2><p className="text-sm text-[#64748b]">正在生成 {selected.length} 份材料，请不要关闭页面。</p></div>}

      {step === "result" && <div className="max-w-4xl mx-auto">
        {savedMsg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-sm text-[#166534] text-center">{savedMsg}</div>}
        <div className="mb-4 p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e]">以下内容为AI生成初稿，仅供修改参考。发布前请人工审核。</div>
        <div className="space-y-4">{selected.map((mat,i) => <div key={i} className="card p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm">{mat}</h3><div className="flex gap-1.5"><button className="btn-sm text-xs btn-secondary" onClick={()=>{navigator.clipboard.writeText(generatedMaterials[mat] || form.name+mat+"初稿"); alert("已复制");}}>复制</button><button className="btn-sm text-xs btn-secondary" onClick={() => exportWord(mat, generatedMaterials[mat] || "【"+mat+"】\n"+(form.background||""))}>📤 Word</button></div></div><div className="text-xs text-[#64748b] leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto slim-scrollbar">{generatedMaterials[mat] || <span className="text-[#dc2626]">未生成内容，请返回重新生成。</span>}</div></div>)}</div>
        <div className="mt-6 text-center space-y-2"><div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]"><strong>导出提示：</strong>导出内容仍需人工审核。</div><button className="btn-secondary text-sm" onClick={()=>exportMaterialPackage(form.name+tmpl.name+"材料包", selected.map(m=>({name:m,content:generatedMaterials[m]||("【"+m+"】\n\n基于"+tmpl.name+"生成\n\n"+(form.background||"")+"\n\n【待补充】")})))}>📤 导出整套文档</button><div><Link href={backHref} className="btn-secondary text-sm">返回模板列表</Link></div></div>
      </div>}
    </div>
  );
}
