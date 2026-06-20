"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { taskDefinitions, commonFormFields, generationModeOptions, cardStyleOptions, activityTypeOptions } from "@/data/tasks";
import { demoAntiFraud, generateRiskCheckResult, type GenerationResult, type RiskCheckInfo } from "@/data/demoData";
import { useAuth } from "@/context/AuthContext";
import SessionMaterials from "@/components/quick-write/SessionMaterials";
import { saveMaterial } from "@/lib/storage";
import { exportWord, exportPDF, exportExcel } from "@/lib/export";

export default function TaskFormInner() {
  const sp = useSearchParams();
  const taskId = sp.get("id") || "activity_plan";
  const [step, setStep] = useState("fill");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedMode, setSelectedMode] = useState("official");
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["official", "concise", "promotion", "highlight", "creative"]);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showRiskCheck, setShowRiskCheck] = useState<GenerationResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskCheckInfo | null>(null);
  const [savedMsg, setSavedMsg] = useState("");
  const [usage, setUsage] = useState<{remaining:number;daily_limit:number}|null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [fusionMode, setFusionMode] = useState(false);
  const [fusionSelections, setFusionSelections] = useState<Set<string>>(new Set());
  const [fusionResult, setFusionResult] = useState<GenerationResult | null>(null);
  const [savedMaterials, setSavedMaterials] = useState<GenerationResult[]>([]);

  const task = useMemo(() => taskDefinitions.find(t => t.id === taskId), [taskId]);

  // Fetch usage if user is logged in
  const { user } = useAuth();
    useEffect(() => {
    if (user && user.email) {
      fetch(`/api/account/usage?email=${user.email}`).then(r=>r.json()).then(d=>d.ok&&setUsage(d)).catch(()=>{});
    }
  }, [user?.email]);
  if (!task) return <div className="container-app py-12 text-center text-[#64748b]">未找到该任务<Link href="/quick-write" className="text-[#1a56db] ml-2">返回</Link></div>;

  const commonFields = [
  ...task.commonFields.map((k: string) => commonFormFields[k]).filter(Boolean),
  commonFormFields.org_name,
  commonFormFields.org_region_type,
  commonFormFields.org_characteristics,
].filter(Boolean);
  const allFields = task.specificFields || [];

  const setField = (n: string, v: string) => setFormData((p: Record<string, string>) => ({ ...p, [n]: v }));
  const toggleStyle = (s: string) => setSelectedStyles((p: string[]) => p.includes(s) ? p.filter((x: string) => x !== s) : [...p, s]);

  const handleGenerate = async () => {
    if (usage && (usage?.remaining ?? 0) <= 0) { setShowQuotaModal(true); return; }
    try {
      const session = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("banhui_session") || "null") : null;
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode, task_type: task.name, cards: selectedStyles, input: formData, user_id: session?.userId || null }),
      });
      const data = await res.json();
      if (data.ok && data.results) { setResults(data.results); setStep("result"); return; }
    } catch (e) { /* fallback to demo below */ }
    const gen: GenerationResult[] = [
      { id: "v1", title: task.name + "（正式稳妥版）", style: "official", styleLabel: "正式稳妥版", content: demoAntiFraud[0].content.replace("XX社区反诈宣传活动方案", (formData.activity_name || "") + task.name), summary: "完整结构，表达规范，适合正式场合", riskLevel: "low" },
      { id: "v2", title: task.name + "（简洁实用版）", style: "concise", styleLabel: "简洁实用版", content: "## " + task.name + "（简洁版）\n\n一、时间：" + (formData.activity_time || "待定") + "\n二、地点：" + (formData.activity_location || "待定") + "\n三、参与对象：" + (formData.participants || "待定") + "\n\n【待补充】", summary: "重点突出", riskLevel: "low" },
      { id: "v3", title: task.name + "（宣传传播版）", style: "promotion", styleLabel: "宣传传播版", content: "## " + task.name + "\n\n" + (formData.activity_background || "为贯彻工作部署") + "，" + (formData.activity_purpose || "特制定方案。") + "\n\n", summary: "有传播感", riskLevel: "medium" },
      { id: "v4", title: task.name + "（亮点提炼版）", style: "highlight", styleLabel: "亮点提炼版", content: "## " + task.name + "\n\n" + (formData.key_content || "突出主题"), summary: "聚焦亮点", riskLevel: "low" },
      { id: "v5", title: task.name + "（创意策划版）", style: "creative", styleLabel: "创意策划版", content: "## " + task.name + "\n\n" + (formData.activity_name || "创新方式"), summary: "角度新颖", riskLevel: "medium" },
    ];
    setResults(gen);
    setStep("result");
  };
  const handleSave = (id: string) => { 
    const r = results.find(x => x.id === id);
    if (r) {
      saveMaterial({ id: Date.now().toString(), title: r.title, materialType: task.name, content: r.content, riskLevel: r.riskLevel, savedAt: new Date().toISOString() });
      setSavedMsg("已保存到「我的材料」！");
      setTimeout(() => setSavedMsg(""), 3000);
    }
  };
  const handleRisk = (r: GenerationResult) => { setShowRiskCheck(r); setRiskResult(generateRiskCheckResult(r.content)); };
  const copyText = (t: string) => { navigator.clipboard.writeText(t); alert("已复制到剪贴板"); };

  if (step === "fill") {
    return (
      <div className="container-app py-6 animate-fade-in">
        <div className="mb-4"><Link href="/quick-write" className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回</Link></div>
        <div className="flex items-center justify-center gap-2 mb-6 text-sm">
          {["填写信息", "选择结果"].map((l, i) => (
            <div key={l} className="flex items-center gap-2">
              <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " + (step === ["fill", "result"][i] ? "bg-[#1a56db] text-white" : "bg-[#e2e8f0] text-[#94a3b8]")}>{i + 1}</div>
              <span className={"text-xs " + (step === ["fill", "result"][i] ? "text-[#1a56db] font-medium" : "text-[#94a3b8]")}>{l}</span>
              {i === 0 && <span className="text-[#d1d5db] mx-1">&rarr;</span>}
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">{task.icon}</div>
              <div><h1 className="text-xl font-bold">{task.name}</h1><p className="text-sm text-[#64748b]">{task.outputDescription}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {commonFields.map((f: any) => (
                <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-[#475569] mb-1.5">{f.label}</label>
                  {f.type === "textarea" ? <textarea className="form-input min-h-[70px] resize-y" placeholder={f.placeholder} value={formData[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} />
                    : f.type === "select" ? <select className="form-select" value={formData[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)}><option value="">请选择</option>{(f.options || activityTypeOptions).map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                      : <input className="form-input" placeholder={f.placeholder} value={formData[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} />
                  }
                </div>
              ))}
            </div>
            {allFields.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-[#1e293b] mb-3 pb-2 border-b border-[#e2e8f0]">{task.name}专属信息</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {allFields.map((f: any) => (
                    <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-[#475569] mb-1.5">{f.label}{f.required && <span className="text-[#dc2626] ml-0.5">*</span>}</label>
                      {f.type === "textarea" ? <textarea className="form-input min-h-[70px] resize-y" placeholder={f.placeholder} value={formData[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} />
                        : f.type === "select" ? <select className="form-select" value={formData[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)}><option value="">请选择</option>{f.options?.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                          : <input className="form-input" type={f.type === "number" ? "number" : "text"} placeholder={f.placeholder} value={formData[f.name] || ""} onChange={(e) => setField(f.name, e.target.value)} />
                      }
                      {f.hint && <p className="text-[0.6rem] text-[#94a3b8] mt-1">{f.hint}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg mb-4 text-xs text-[#92400e]">请勿输入涉密、内部、隐私或商业秘密内容。</div>
            <h3 className="text-sm font-semibold text-[#1e293b] mb-3">生成模式</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
              {generationModeOptions.map((m: any) => (
                <button key={m.value} onClick={() => setSelectedMode(m.value)} className={"p-3 rounded-lg text-center border text-xs transition-all " + (selectedMode === m.value ? "border-[#3b82f6] bg-[#eff6ff] text-[#1e40af]" : "border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8]")}>
                  <div className="font-medium mb-0.5">{m.label}</div><div className="text-[0.55rem] opacity-70">{m.description}</div>
                </button>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-[#1e293b] mb-3">版本风格（可多选）</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {cardStyleOptions.map((s: any) => (
                <button key={s.value} onClick={() => toggleStyle(s.value)} className={"px-4 py-2 rounded-lg border text-xs font-medium transition-all " + (selectedStyles.includes(s.value) ? "border-[#059669] bg-[#f0fdf4] text-[#166534]" : "border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8]")}>
                  {selectedStyles.includes(s.value) ? "✓ " : ""}{s.label}
                </button>
              ))}
            </div>
            <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg mb-6 text-xs text-[#166534]">本工具仅生成材料初稿。政策依据、数据、姓名、职务等信息必须由用户自行核实。</div>
            <SessionMaterials formData={formData} onClear={() => { setFormData({}); setSavedMsg("素材已清空"); setTimeout(()=>setSavedMsg(""), 2000); }} />
            {usage && <div className={"text-xs text-center mb-2 "+((usage?.remaining ?? 0)<3?"text-[#dc2626]":"text-[#64748b]")}>今日剩余{(usage?.remaining ?? 0)}次生成次数{(usage?.remaining ?? 0)<3?"⚠️":""}</div>}
            <button onClick={handleGenerate} className="btn-primary w-full justify-center py-3 text-base">✨ 生成{selectedStyles.length}个版本</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/quick-write" className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回</Link>
        <button onClick={() => { setStep("fill"); setResults([]); setSelectedCard(null); }} className="text-sm text-[#1a56db] hover:text-[#1e40af]">修改信息</button>
      </div>
      {(savedMsg) && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-sm text-[#166534] text-center">{savedMsg}</div>}
      <div className="mb-4 p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e]">以下内容为AI生成初稿，仅供修改参考。发布前请人工审核。</div>
      {/* Fusion mode toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => { setFusionMode(!fusionMode); setFusionSelections(new Set()); setFusionResult(null); }} className={"text-xs px-3 py-1.5 rounded-lg font-medium transition-all " + (fusionMode ? "bg-[#1a56db] text-white" : "bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#94a3b8]")}>
            {fusionMode ? "取消融合" : "🔄 版本融合"}
          </button>
          {fusionMode && fusionSelections.size >= 2 && (
            <button onClick={() => {
              const selected = results.filter(r => fusionSelections.has(r.id));
              const fusedContent = selected.map(r => r.content).join("\n\n--- 以下为融合内容 ---\n\n");
              const fused: GenerationResult = {
                id: "fused", title: task.name + "（融合优化版）", style: "official", styleLabel: "融合优化版",
                content: "## " + task.name + "（融合优化版）\n\n融合以下版本特点：\n" + selected.map(r => "- " + r.styleLabel).join("\n") + "\n\n### 综合版本\n" + fusedContent.slice(0, 2000) + "\n\n【待核实】融合版本的信息请以实际活动情况为准。",
                summary: "综合多个版本优点，保留正式表达和重点亮点", riskLevel: "medium"
              };
              setFusionResult(fused);
            }} className="btn-primary text-xs py-1.5 px-3">✨ 融合优化（已选{fusionSelections.size}张）</button>
          )}
        </div>
      </div>
      {fusionResult && (
        <div className="card p-5 mb-4 border-2 border-[#8b5cf6] bg-[#faf5ff]">
          <div className="flex items-center justify-between mb-3">
            <span className="tag tag-blue">{fusionResult.styleLabel}</span>
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#fffbeb] text-[#92400e]">
              <span className="risk-dot medium"></span>中风险
            </span>
          </div>
          <h3 className="font-semibold text-sm mb-2">{fusionResult.title}</h3>
          <p className="text-xs text-[#64748b] mb-3">{fusionResult.summary}</p>
          <div className="max-h-[300px] overflow-y-auto slim-scrollbar text-xs text-[#475569] whitespace-pre-wrap leading-relaxed mb-3">{fusionResult.content}</div>
          <div className="flex gap-1.5">
            <button className="btn-sm text-xs btn-primary" onClick={() => { navigator.clipboard.writeText(fusionResult.content); alert("已复制"); }}>复制融合版</button>
            <button className="btn-sm text-xs btn-secondary" onClick={() => setFusionResult(null)}>关闭</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((r: GenerationResult) => (
          <div key={r.id} className={"card p-5 border-2 transition-all " + (selectedCard === r.id ? "border-[#3b82f6] card-active" : "border-transparent hover:border-[#e2e8f0]")}>
            <div className="flex items-start justify-between mb-3">
              <span className={"tag " + (r.style === "official" ? "tag-blue" : r.style === "concise" ? "tag-gray" : r.style === "promotion" ? "tag-yellow" : "tag-green")}>{r.styleLabel}</span>
              <span className={"flex items-center gap-1 text-xs px-2 py-0.5 rounded-full " + (r.riskLevel === "low" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#fffbeb] text-[#92400e]")}>
                <span className={"risk-dot " + r.riskLevel}></span>{r.riskLevel === "low" ? "低风险" : "中风险"}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{r.title}</h3>
            <p className="text-xs text-[#64748b] mb-3 line-clamp-2">{r.summary}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button onClick={() => setSelectedCard(selectedCard === r.id ? null : r.id)} className={"btn-sm text-xs " + (selectedCard === r.id ? "btn-primary" : "btn-secondary")}>{selectedCard === r.id ? "收起" : "预览"}</button>
              <button onClick={() => { if(window.confirm("请确认材料不包含涉密、未公开、隐私或商业秘密内容。")) { handleSave(r.id); } }} className="btn-sm text-xs btn-primary">采用并保存</button>
              <button onClick={() => handleRisk(r)} className="btn-sm text-xs btn-secondary">风险检查</button>
              <button onClick={() => exportWord(r.title, r.content)} className="btn-sm text-xs btn-secondary">导出</button>
            </div>
            {fusionMode && (
              <label className="flex items-center gap-2 text-xs text-[#475569] cursor-pointer select-none mt-1">
                <input type="checkbox" checked={fusionSelections.has(r.id)} onChange={() => {
                  const next = new Set(fusionSelections);
                  if (next.has(r.id)) next.delete(r.id); else next.add(r.id);
                  setFusionSelections(next);
                }} className="w-4 h-4" />
                选择此版本参与融合
              </label>
            )}
            {selectedCard === r.id && (
              <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                <div className="max-h-[400px] overflow-y-auto slim-scrollbar text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">{r.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showQuotaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowQuotaModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center" onClick={e=>e.stopPropagation()}>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-[#1e293b] mb-2">今日生成次数已用尽</h2>
            <p className="text-sm text-[#64748b] mb-4">您的{usage?.daily_limit||10}次免费生成已经用完。升级到专业版或者明天再来吧。</p>
            <div className="flex flex-col gap-2">
              <a href="/account" className="btn-primary text-sm py-2.5 justify-center">查看套餐</a>
              <button onClick={()=>setShowQuotaModal(false)} className="text-sm text-[#64748b] hover:text-[#1e293b] py-2">关闭</button>
            </div>
          </div>
        </div>
      )}
      {showRiskCheck && riskResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowRiskCheck(null); setRiskResult(null); }}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto slim-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold">🛡️ 风险检查报告</h2><button onClick={() => { setShowRiskCheck(null); setRiskResult(null); }} className="text-[#94a3b8] hover:text-[#475569]">✕</button></div>
              <div className={"p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2 " + (riskResult.riskLevel === "high" ? "risk-high" : riskResult.riskLevel === "medium" ? "risk-medium" : "risk-low")}>
                <span className={"risk-dot " + riskResult.riskLevel}></span>风险等级：{riskResult.riskLevel === "high" ? "高风险" : riskResult.riskLevel === "medium" ? "中风险" : "低风险"}
              </div>
              {riskResult.risks.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-sm">检测到的问题（{riskResult.risks.length}项）</h3>
                  {riskResult.risks.map((r: any, i: number) => (
                    <div key={i} className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg text-xs">
                      <div className="flex items-center gap-1 mb-1"><span className="tag tag-red">{r.type}</span>{r.requiresHumanReview && <span className="tag tag-yellow">需人工核实</span>}</div>
                      <p className="text-[#991b1b] mb-1">{r.reason}</p>
                      <p className="text-[#64748b]">{r.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
              {riskResult.pendingVerification.length > 0 && (
                <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg mb-4">
                  <h3 className="font-semibold text-xs mb-2 text-[#92400e]">待核实信息</h3>
                  <ul className="space-y-1">{riskResult.pendingVerification.map((item: string, i: number) => <li key={i} className="text-xs text-[#92400e] flex items-start gap-1"><span>•</span>{item}</li>)}</ul>
                </div>
              )}
              <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg mb-4 text-xs text-[#166534]"><strong>修改建议：</strong>根据检测结果修改后建议再次检查。</div>
              <button onClick={() => { setShowRiskCheck(null); setRiskResult(null); }} className="btn-primary w-full justify-center">关闭报告</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">
        <strong>导出提示：</strong>导出内容仍需人工审核。涉及政策、数据、职务、金额等信息请核实后使用。
      </div>
    </div>
  );
}





