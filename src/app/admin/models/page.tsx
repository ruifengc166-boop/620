"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminModels() {
  const [models, setModels] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => { adminFetch("/api/admin/models").then(r => r.json()).then(d => d.ok && setModels(d.models)).catch(() => {}); }, []);

  const updateModel = async (provider: string, updates: any) => {
    const r = await adminFetch("/api/admin/models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, ...updates }) });
    const d = await r.json();
    setMsg(d.msg || "更新成功"); setTimeout(() => setMsg(""), 3000);
    adminFetch("/api/admin/models").then(r=>r.json()).then(d=>d.ok&&setModels(d.models)).catch(()=>{});
  };

  const toggleActive = async (provider: string, is_active: boolean) => {
    const r = await adminFetch("/api/admin/models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, is_active }) });
    const d = await r.json();
    if (d.ok) setModels(models.map(m => m.provider === provider ? { ...m, is_active } : m));
    setMsg(d.msg || "更新成功"); setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">🤖 模型配置</h1>
      {msg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534]">{msg}</div>}

      <div className="space-y-4">
        {models.map(m => (
          <div key={m.provider} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold capitalize">{m.provider}</h2>
                <p className="text-xs text-[#64748b]">模型：{m.model_name} | 模式映射：{m.mode_mapping?.join(", ")}</p>
              </div>
              <button onClick={() => toggleActive(m.provider, !m.is_active)} className={"px-3 py-1.5 rounded-lg text-xs font-medium " + (m.is_active ? "bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]" : "bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]")}>{m.is_active ? "已启用" : "已禁用"}</button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#475569] mb-1">{m.provider === "tongyi" ? "通义千问" : m.provider === "deepseek" ? "DeepSeek" : m.provider === "kimi" ? "Kimi" : m.provider === "doubao" ? "豆包" : m.provider === "glm" ? "GLM" : "文心一言"} API Key</label>
                  <input className="form-input text-xs font-mono" type="password" placeholder={m.has_api_key ? `已配置：${m.masked_api_key}，留空不修改` : "输入 API Key"} id={"key_"+m.provider} />
                </div>
                <button onClick={() => { const el = document.getElementById("key_"+m.provider) as HTMLInputElement; if (el && el.value.trim()) updateModel(m.provider, { api_key: el.value.trim() }); else setMsg("未输入新 Key，已保留原配置"); }} className="btn-primary text-xs py-2 px-4 shrink-0">保存 Key</button>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Agent 写作风格 (systemPrompt)</label>
                <textarea className="form-input text-xs min-h-[60px] resize-y" defaultValue={m.system_prompt || ""} id={"prompt_"+m.provider} placeholder="输入系统提示词，定义AI的写作风格和角色定位" />
                <button onClick={() => { const el = document.getElementById("prompt_"+m.provider) as HTMLTextAreaElement; if (el) updateModel(m.provider, { system_prompt: el.value }); }} className="btn-primary text-xs py-1.5 px-3 mt-1">保存 Prompt</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#475569] mb-1">Temperature（创造力 0-2）</label>
                  <input className="form-input text-xs" type="number" step="0.1" min="0" max="2" defaultValue={m.temperature ?? 0.7} id={"temp_"+m.provider} />
                </div>
                <button onClick={() => { const el = document.getElementById("temp_"+m.provider) as HTMLInputElement; if (el) updateModel(m.provider, { temperature: parseFloat(el.value) }); }} className="btn-primary text-xs py-2 px-3 shrink-0 mt-5">保存温度</button>
              </div>
            </div>
            <p className="text-[0.55rem] text-[#94a3b8] mt-2">API Key 仅以脱敏形式展示，留空保存不会覆盖原 Key。</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#fffbeb] border border-[#fde68a] rounded-lg">
        <h3 className="font-semibold text-xs text-[#92400e] mb-1">📌 配置说明</h3>
        <ul className="text-[0.6rem] text-[#92400e] space-y-0.5">
          <li>• 通义千问：在 <a href="https://dashscope.aliyun.com" target="_blank" className="underline">阿里云 DashScope</a> 获取 API Key</li>
          <li>• DeepSeek：在 <a href="https://platform.deepseek.com" target="_blank" className="underline">DeepSeek 开放平台</a> 获取 API Key</li>
          <li>• Kimi：在 <a href="https://platform.moonshot.cn" target="_blank" className="underline">月之暗面开放平台</a> 获取 API Key</li>
          <li>• 配置 API Key 后，系统自动使用真实模型生成；未配置时使用模拟数据</li>
          <li>• 每个模型可映射到多个生成模式（如官方模式→通义千问、策划模式→DeepSeek）</li>
        </ul>
      </div>
      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
