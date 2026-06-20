"use client";
import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { activityTemplates, templateCategoryIcons } from "@/data/templates";
import { exportWord, exportMaterialPackage } from "@/lib/export";

export default function TemplateDetailWrapper() {
  return <Suspense fallback={<div className="container-app py-12 text-center text-[#64748b]">加载中...</div>}>
    <TemplateDetail />
  </Suspense>;
}

function TemplateDetail() {
  const sp = useSearchParams();
  const tid = sp.get("id") || "";
  const [step, setStep] = useState("info");
  const [form, setForm] = useState<Record<string, string>>({});
  const [savedMsg, setSavedMsg] = useState("");
  const tmpl = useMemo(() => activityTemplates.find(t => t.id === tid), [tid]);
  const materials = tmpl ? tmpl.materials : [];
  const [selected, setSelected] = useState(materials.slice(0, Math.min(6, materials.length)));

  if (!tmpl) return <div className="container-app py-12 text-center text-[#64748b]">未找到模板<Link href="/run-activity" className="text-[#1a56db] ml-2">返回</Link></div>;

  const toggleMat = (m: string) => setSelected((p: string[]) => p.includes(m) ? p.filter((x: string) => x !== m) : [...p, m]);
  const setF = (k: string, v: string) => setForm((p: Record<string, string>) => ({ ...p, [k]: v }));

  const steps = [
    { key: "info", label: "活动信息", num: 1 },
    { key: "materials", label: "选择材料", num: 2 },
    { key: "result", label: "生成结果", num: 3 },
  ];

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-4"><Link href="/run-activity" className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回</Link></div>
      <div className="flex items-center justify-center gap-2 mb-6 text-sm">
        {steps.map((s,i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " + (step===s.key?"bg-[#1a56db] text-white":"bg-[#e2e8f0] text-[#94a3b8]")}>{s.num}</div>
            <span className={"text-xs " + (step===s.key?"text-[#1a56db] font-medium":"text-[#94a3b8]")}>{s.label}</span>
            {i<2 && <span className="text-[#d1d5db] mx-1">&rarr;</span>}
          </div>
        ))}
      </div>

      {step === "info" && (
        <div className="max-w-3xl mx-auto">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">{templateCategoryIcons[tmpl.category]||"📋"}</div>
              <div><h1 className="text-xl font-bold">{tmpl.name}</h1><p className="text-sm text-[#64748b]">{tmpl.description}（{tmpl.materialCount}份材料）</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1.5">活动名称 *</label><input className="form-input" placeholder={"如：XX区"+tmpl.name} value={form.name||""} onChange={e=>setF("name",e.target.value)}/></div>
              <div><label className="block text-xs font-medium text-[#475569] mb-1.5">主办单位</label><input className="form-input" placeholder="主办单位" value={form.host||""} onChange={e=>setF("host",e.target.value)}/></div>
              <div><label className="block text-xs font-medium text-[#475569] mb-1.5">承办单位</label><input className="form-input" placeholder="承办单位" value={form.organizer||""} onChange={e=>setF("organizer",e.target.value)}/></div>
              <div><label className="block text-xs font-medium text-[#475569] mb-1.5">活动时间</label><input className="form-input" placeholder="如：2026年7月" value={form.time||""} onChange={e=>setF("time",e.target.value)}/></div>
              <div><label className="block text-xs font-medium text-[#475569] mb-1.5">活动地点</label><input className="form-input" placeholder="活动地点" value={form.location||""} onChange={e=>setF("location",e.target.value)}/></div>
              <div><label className="block text-xs font-medium text-[#475569] mb-1.5">参与对象</label><input className="form-input" placeholder="参与对象" value={form.participants||""} onChange={e=>setF("participants",e.target.value)}/></div>
              <div><label className="block text-xs font-medium text-[#475569] mb-1.5">预计人数</label><input className="form-input" placeholder="如：100人" value={form.attendance||""} onChange={e=>setF("attendance",e.target.value)}/></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-[#475569] mb-1.5">活动背景与目的</label><textarea className="form-input min-h-[80px] resize-y" placeholder="活动开展背景和主要目的" value={form.background||""} onChange={e=>setF("background",e.target.value)}/></div>
            </div>
            <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg mb-4 text-xs text-[#92400e]">请勿输入涉密、内部、隐私或商业秘密内容。</div>
            <button onClick={()=>setStep("materials")} className="btn-primary w-full justify-center py-3 text-base">下一步：选择材料</button>
          </div>
        </div>
      )}

      {step === "materials" && (
        <div className="max-w-3xl mx-auto">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">选择需要生成的材料（可多选）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {materials.map(m => {
                const checked = selected.includes(m);
                return (
                  <button key={m} onClick={()=>toggleMat(m)} className={"p-3 rounded-lg border text-sm text-left transition-all flex items-center gap-2 " + (checked?"border-[#059669] bg-[#f0fdf4] text-[#166534]":"border-[#e2e8f0] text-[#475569] hover:border-[#94a3b8]")}>
                    <span className={"w-5 h-5 rounded border flex items-center justify-center text-xs " + (checked?"bg-[#059669] text-white border-[#059669]":"border-[#d1d5db]")}>{checked?"✓":""}</span>{m}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-[#64748b] mb-4">已选 {selected.length}/{materials.length} 份材料</div>
            <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg mb-4 text-xs text-[#166534]">本工具仅生成材料初稿。政策依据、数据、姓名、职务等信息必须由用户自行核实。</div>
            <div className="flex gap-3">
              <button onClick={()=>setStep("info")} className="btn-secondary">上一步</button>
              <button onClick={()=>setStep("result")} className="btn-primary flex-1 justify-center py-3 text-base" disabled={selected.length===0}>✨ 生成 {selected.length} 份材料</button>
            </div>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="max-w-4xl mx-auto">
          {savedMsg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-sm text-[#166534] text-center">{savedMsg}</div>}
          <div className="mb-4 p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e]">以下内容为AI生成初稿，仅供修改参考。发布前请人工审核。</div>
          <div className="space-y-4">
            {selected.map((mat,i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{mat}</h3>
                  <div className="flex gap-1.5">
                    <button className="btn-sm text-xs btn-secondary" onClick={()=>{navigator.clipboard.writeText(form.name+mat+"初稿…"); alert("已复制");}}>复制</button>
                    <Link href={"/quick-write/task?id="+(mat==="活动方案"?"activity_plan":mat==="主持词"?"host_script":mat==="新闻稿"?"news_release":mat==="活动总结"?"activity_summary":mat==="公众号推文"?"official_account":mat==="邀请函"?"invitation":mat==="活动通知"?"activity_notice":"activity_plan")} className="btn-sm text-xs btn-secondary">深度编辑</Link>
                  </div>
                </div>
                <div className="text-xs text-[#64748b] leading-relaxed">
                  <p className="mb-2">【{mat}】基于 {tmpl.name} 活动信息生成</p>
                  <p className="italic text-[#94a3b8]">（此处为材料框架内容。点击"深度编辑"可进入对应任务页精确填写信息后重新生成。）</p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex gap-2">
                  <button className="btn-sm text-xs btn-secondary" onClick={()=>{if(window.confirm("请确认该材料不包含涉密、未公开、个人隐私、商业秘密或未经授权内容。")) { setSavedMsg("已保存到「我的材料」"); setTimeout(()=>setSavedMsg(""), 3000); };}}>💾 保存</button>
              <button className="btn-sm text-xs btn-secondary" onClick={() => exportWord(mat, "【"+mat+"】\n"+(form.background||""))}>📤 Word</button>
                  <button className="btn-sm text-xs btn-secondary" onClick={()=>window.print()}>📤 导出PDF</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center space-y-2">
            <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]"><strong>导出提示：</strong>导出内容仍需人工审核。</div>
            <button className="btn-secondary text-sm" onClick={()=>exportMaterialPackage(form.name+tmpl.name+"材料包", selected.map(m=>({name:m,content:"【"+m+"】\\n\\n基于"+tmpl.name+"生成\\n\\n"+(form.background||"")+"\\n\\n【待补充】"})))}>📤 导出整套文档</button>
          <Link href="/run-activity" className="btn-secondary text-sm">返回模板列表</Link>

          </div>
        </div>
      )}
    </div>
  );
}

