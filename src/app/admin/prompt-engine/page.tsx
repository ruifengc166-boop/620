"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

const MATERIAL_KEYS = ["通用", "活动方案", "主持词", "新闻稿", "公众号推文", "活动通知", "活动总结", "领导致辞初稿", "活动流程表", "任务分工表", "工作简报", "邀请函", "会议纪要", "政策解读稿", "问答手册"];
const SCENARIO_KEYS = ["general", "waka", "camp", "salon", "training", "community", "park", "university", "policy", "party"];
const STYLE_KEYS = ["official", "concise", "promotion", "highlight", "creative"];

type PromptMap = Record<string, string>;

type PromptConfig = {
  version: string;
  enabled: boolean;
  system_prompt: string;
  material_prompts: PromptMap;
  scenario_prompts: PromptMap;
  style_prompts: PromptMap;
  review_prompt: string;
  constraints_prompt: string;
  output_contract: string;
  notes?: string;
  updated_at?: string;
};

function emptyConfig(): PromptConfig {
  return {
    version: "runtime-private-v1",
    enabled: true,
    system_prompt: "",
    material_prompts: {},
    scenario_prompts: {},
    style_prompts: {},
    review_prompt: "",
    constraints_prompt: "",
    output_contract: "",
    notes: "",
  };
}

function TextArea({ label, value, onChange, rows = 5, help }: { label: string; value: string; onChange: (v: string) => void; rows?: number; help?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#475569] mb-1">{label}</label>
      {help ? <p className="text-[0.6rem] text-[#94a3b8] mb-1">{help}</p> : null}
      <textarea className="form-input text-xs font-mono resize-y" rows={rows} value={value || ""} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function PromptEngineAdminPage() {
  const [config, setConfig] = useState<PromptConfig>(emptyConfig());
  const [meta, setMeta] = useState<any>(null);
  const [activeMaterial, setActiveMaterial] = useState("活动方案");
  const [activeScenario, setActiveScenario] = useState("general");
  const [activeStyle, setActiveStyle] = useState("official");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/prompt-engine")
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setConfig({ ...emptyConfig(), ...d.config });
          setMeta(d.meta);
        }
      })
      .catch(() => setMsg("读取 Prompt 引擎配置失败"))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    material: Object.values(config.material_prompts || {}).filter(Boolean).length,
    scenario: Object.values(config.scenario_prompts || {}).filter(Boolean).length,
    style: Object.values(config.style_prompts || {}).filter(Boolean).length,
  }), [config]);

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const r = await adminFetch("/api/admin/prompt-engine", { method: "POST", body: JSON.stringify(config) });
      const d = await r.json();
      if (d.ok) {
        setConfig({ ...emptyConfig(), ...d.config });
        setMeta(d.meta);
        setMsg("保存成功，新的 Prompt 将用于后续生成");
      } else setMsg(d.msg || "保存失败");
    } catch {
      setMsg("保存失败，请检查网络或登录状态");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  const updateMaterial = (key: string, value: string) => setConfig(c => ({ ...c, material_prompts: { ...(c.material_prompts || {}), [key]: value } }));
  const updateScenario = (key: string, value: string) => setConfig(c => ({ ...c, scenario_prompts: { ...(c.scenario_prompts || {}), [key]: value } }));
  const updateStyle = (key: string, value: string) => setConfig(c => ({ ...c, style_prompts: { ...(c.style_prompts || {}), [key]: value } }));

  if (loading) return <div className="text-sm text-[#64748b]">正在加载 Prompt 引擎配置...</div>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-2">🧠 Prompt 引擎</h1>
          <p className="text-xs text-[#64748b] leading-relaxed max-w-3xl">这是管理员专用的私有 Prompt 管理模块。Prompt 内容保存在服务器运行时文件中，不提交到 GitHub 仓库；前台用户无法访问此页面和接口。</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary text-xs px-4 py-2 disabled:opacity-60">{saving ? "保存中..." : "保存全部"}</button>
      </div>

      {msg && <div className="mb-4 p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg text-xs text-[#1d4ed8]">{msg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">状态</div><div className="font-semibold text-sm mt-1">{config.enabled ? "已启用" : "已停用"}</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">文种 Prompt</div><div className="font-semibold text-sm mt-1">{counts.material} 个</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">场景 Prompt</div><div className="font-semibold text-sm mt-1">{counts.scenario} 个</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">风格 Prompt</div><div className="font-semibold text-sm mt-1">{counts.style} 个</div></div>
        <div className="card p-4"><div className="text-[0.6rem] text-[#64748b]">更新时间</div><div className="font-semibold text-[0.65rem] mt-1">{meta?.updated_at || config.updated_at || "未保存"}</div></div>
      </div>

      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">总控 Prompt</h2>
          <label className="flex items-center gap-2 text-xs text-[#475569]"><input type="checkbox" checked={config.enabled} onChange={e => setConfig(c => ({ ...c, enabled: e.target.checked }))} />启用私有 Prompt 引擎</label>
        </div>
        <div className="space-y-4">
          <TextArea label="全局 system_prompt" value={config.system_prompt} onChange={v => setConfig(c => ({ ...c, system_prompt: v }))} rows={6} help="定义办会助理的底层角色、写作原则和不能做什么。" />
          <TextArea label="审校 Prompt" value={config.review_prompt} onChange={v => setConfig(c => ({ ...c, review_prompt: v }))} rows={4} help="用于要求模型生成前自检结构、事实、风格和风险。" />
          <TextArea label="硬性约束 Prompt" value={config.constraints_prompt} onChange={v => setConfig(c => ({ ...c, constraints_prompt: v }))} rows={4} help="用于规定不得编造、待核实标注、涉密隐私风险等。" />
          <TextArea label="输出格式 Prompt" value={config.output_contract} onChange={v => setConfig(c => ({ ...c, output_contract: v }))} rows={4} help="规定最终输出结构，例如正文初稿、使用前建议补充、风险与待核实项。" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-3">文种 Prompt</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {MATERIAL_KEYS.map(k => <button key={k} onClick={() => setActiveMaterial(k)} className={`px-2 py-1 rounded text-[0.65rem] border ${activeMaterial === k ? "bg-[#eff6ff] border-[#93c5fd] text-[#1d4ed8]" : "border-[#e2e8f0] text-[#64748b]"}`}>{k}</button>)}
          </div>
          <TextArea label={activeMaterial} value={config.material_prompts?.[activeMaterial] || ""} onChange={v => updateMaterial(activeMaterial, v)} rows={12} help="定义该文种的标准结构、写作要求、禁用表达和质量标准。" />
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-3">场景 Prompt</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {SCENARIO_KEYS.map(k => <button key={k} onClick={() => setActiveScenario(k)} className={`px-2 py-1 rounded text-[0.65rem] border ${activeScenario === k ? "bg-[#eff6ff] border-[#93c5fd] text-[#1d4ed8]" : "border-[#e2e8f0] text-[#64748b]"}`}>{k}</button>)}
          </div>
          <TextArea label={activeScenario} value={config.scenario_prompts?.[activeScenario] || ""} onChange={v => updateScenario(activeScenario, v)} rows={12} help="定义瓦卡奖、创作营、沙龙、培训、社区、园区等场景的目标、流程、措辞和风险。" />
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-3">风格 Prompt</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {STYLE_KEYS.map(k => <button key={k} onClick={() => setActiveStyle(k)} className={`px-2 py-1 rounded text-[0.65rem] border ${activeStyle === k ? "bg-[#eff6ff] border-[#93c5fd] text-[#1d4ed8]" : "border-[#e2e8f0] text-[#64748b]"}`}>{k}</button>)}
          </div>
          <TextArea label={activeStyle} value={config.style_prompts?.[activeStyle] || ""} onChange={v => updateStyle(activeStyle, v)} rows={12} help="定义正式、简洁、宣传、亮点、创意等风格的句式、语气、标题和边界。" />
        </div>
      </div>

      <div className="mt-5 card p-5">
        <TextArea label="内部备注" value={config.notes || ""} onChange={v => setConfig(c => ({ ...c, notes: v }))} rows={3} help="可记录本轮 Prompt 版本目标、测试结论、待优化问题。" />
      </div>

      <div className="mt-5 p-4 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e] leading-relaxed">
        <p className="font-semibold mb-1">使用提醒</p>
        <p>这里能看到完整 Prompt，仅管理员可访问。请不要把核心 Prompt 粘贴到公开页面、前台接口返回值或公开仓库。当前实现使用服务器运行时文件保存，正式商用后建议迁移到数据库或密钥管理系统。</p>
      </div>

      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
