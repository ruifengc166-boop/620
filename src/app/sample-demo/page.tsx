"use client";
import { useState } from "react";
import { getSampleData } from "@/data/demoData";

const samples = [
  { id: "anti-fraud", name: "社区反诈宣传活动", desc: "展示活动方案、主持词、新闻稿等全套材料", icon: "🛡" },
  { id: "policy", name: "街道政策宣讲会", desc: "展示方案、主持词、通知、政策解读稿等全套材料", icon: "🏛" },
  { id: "investment", name: "园区招商推介会", desc: "展示招商方案、推介稿、邀请函等全套材料", icon: "💼" },
];

export default function SampleDemoPage() {
  const [activeSample, setActiveSample] = useState("anti-fraud");
  const [selectedCard, setSelectedCard] = useState<string|null>(null);
  const data = getSampleData(activeSample);
  const sample = samples.find(s => s.id === activeSample);
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">🎬 样例演示</h1>
        <p className="text-sm text-[#64748b] mt-1">查看平台的生成效果，了解多版本卡片的展示方式</p>
      </div>
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          {samples.map(s => (
            <button key={s.id} onClick={() => { setActiveSample(s.id); setSelectedCard(null); }} className={"px-5 py-3 rounded-xl text-sm font-medium transition-all " + (activeSample === s.id ? "bg-[#1a56db] text-white shadow-md" : "bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#94a3b8]")}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        {sample && <p className="text-xs text-[#64748b]">{sample.desc}</p>}
      </div>
      <div className="mb-4 p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e]">
        以下内容为演示样例，展示多版本生成效果。实际使用时，平台将根据您填写的信息生成定制化内容。
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(result => (
          <div key={result.id} className={"card p-5 border-2 transition-all " + (selectedCard === result.id ? "border-[#3b82f6] card-active" : "border-transparent hover:border-[#e2e8f0]")}>
            <div className="flex items-start justify-between mb-3">
              <span className={"tag " + (result.style === "official" ? "tag-blue" : result.style === "concise" ? "tag-gray" : result.style === "promotion" ? "tag-yellow" : "tag-green")}>{result.styleLabel}</span>
              <span className={"flex items-center gap-1 text-xs px-2 py-0.5 rounded-full " + (result.riskLevel === "low" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#fffbeb] text-[#92400e]")}>
                <span className={"risk-dot " + result.riskLevel}></span>{result.riskLevel === "low" ? "低风险" : "中风险"}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{result.title}</h3>
            <p className="text-xs text-[#64748b] mb-3 line-clamp-2">{result.summary}</p>
            <div className="flex gap-1.5 mb-3">
              <button onClick={() => setSelectedCard(selectedCard === result.id ? null : result.id)} className={"btn-sm text-xs " + (selectedCard === result.id ? "btn-primary" : "btn-secondary")}>{selectedCard === result.id ? "收起" : "预览"}</button>
              <button className="btn-sm text-xs btn-secondary" onClick={() => { navigator.clipboard.writeText(result.content); alert("已复制"); }}>复制</button>
              <button className="btn-sm text-xs btn-secondary" onClick={() => alert("导出功能即将上线")}>导出</button>
            </div>
            {selectedCard === result.id && (
              <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                <div className="max-h-[400px] overflow-y-auto slim-scrollbar text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">{result.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 p-5 bg-white rounded-xl border border-[#e2e8f0] text-center">
        <h3 className="font-semibold text-sm mb-2">💡 想亲自试一试？</h3>
        <p className="text-xs text-[#64748b] mb-4">选择您需要的任务或活动模板，填写信息，一键生成多版本材料</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/quick-write" className="btn-primary text-sm">去写一个材料</a>
          <a href="/run-activity" className="btn-secondary text-sm">去办一场活动</a>
          <a href="/risk-check" className="btn-secondary text-sm">去检查材料风险</a>
        </div>
      </div>
    </div>
  );
}

