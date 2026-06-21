"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { activityTemplates as fallbackTemplates, templateCategoryIcons } from "@/data/templates";

type TemplateCard = {
  id: string;
  name: string;
  category: string;
  description: string;
  priority?: string;
  priority_level?: string;
  materialCount?: number;
  materials?: string[];
  output_materials?: string[];
  marketplace_title?: string;
  marketplace_subtitle?: string;
  selling_points?: string[];
  suitable_for?: string[];
  scenario_tags?: string[];
  core_materials?: string[];
  delivery_value?: string;
  sample_preview?: string;
  cover_icon?: string;
  price_label?: string;
  is_featured?: boolean;
};

function normalizeFallback(t: any): TemplateCard {
  const materials = t.materials || t.output_materials || [];
  return {
    ...t,
    priority: t.priority || t.priority_level || "P2",
    priority_level: t.priority || t.priority_level || "P2",
    materials,
    output_materials: materials,
    materialCount: t.materialCount || materials.length,
  };
}

function buildSamplePreview(t: TemplateCard, coreMaterials: string[]) {
  if (typeof t.sample_preview === "string" && t.sample_preview.trim()) return t.sample_preview.trim();
  const first = coreMaterials[0] || "活动方案";
  const second = coreMaterials[1] || "主持词";
  const third = coreMaterials[2] || "新闻稿";
  return `【${t.name || "活动"}材料包样例预览】

1. ${first}
围绕活动背景、目标、时间地点、参与对象、流程安排和职责分工生成完整初稿。

2. ${second}
生成可直接朗读的开场白、环节串词、嘉宾介绍和结束语。

3. ${third}
生成标题、导语、活动过程、亮点成效和后续影响等新闻表达。

实际生成时会根据你填写的活动名称、时间、地点、主办单位和背景目的自动替换内容。`;
}

export default function TemplateMarketplace() {
  const [templates, setTemplates] = useState<TemplateCard[]>(fallbackTemplates.map(normalizeFallback));
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then(r => r.json())
      .then(d => { if (d.ok && Array.isArray(d.templates)) setTemplates(d.templates); })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => Array.from(new Set(templates.map(t => t.category).filter(Boolean))), [templates]);
  const filtered = activeCategory === "all" ? templates : templates.filter(t => t.category === activeCategory);

  return (
    <div>
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-6 text-white">
        <div className="text-xs text-[#bfdbfe] mb-2">材料包货架 · 先看模板，再生成</div>
        <h2 className="text-xl md:text-2xl font-bold">选择一套成熟活动材料包</h2>
        <p className="text-sm text-[#dbeafe] mt-2 max-w-2xl">模板广场用于浏览适用场景、核心材料和样例片段。确定后进入“办一场活动”，填写一次信息生成整套材料。</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 slim-scrollbar">
        <button onClick={() => setActiveCategory("all")} className={"shrink-0 px-4 py-2 text-sm rounded-lg font-medium transition-colors " + (activeCategory === "all" ? "bg-[#1a56db] text-white" : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]")}>全部材料包</button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={"shrink-0 px-4 py-2 text-sm rounded-lg font-medium transition-colors " + (activeCategory === cat ? "bg-[#1a56db] text-white" : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]")}>{templateCategoryIcons[cat] || "📦"} {cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map(t => {
          const priority = t.priority_level || t.priority || "P2";
          const materials = t.output_materials || t.materials || [];
          const coreMaterials = t.core_materials?.length ? t.core_materials : materials.slice(0, 6);
          const title = t.marketplace_title || `${t.name}材料包`;
          const subtitle = t.marketplace_subtitle || t.description;
          const suitableFor = t.suitable_for?.length ? t.suitable_for : [t.category];
          const scenarioTags = t.scenario_tags?.length ? t.scenario_tags : [t.category, t.name].filter(Boolean);
          const sellingPoints = t.selling_points?.length ? t.selling_points : [`包含${materials.length}份材料`, "覆盖会前、会中、会后", "适合快速生成初稿"];
          const isPreviewOpen = previewId === t.id;
          const samplePreview = buildSamplePreview(t, coreMaterials);

          return (
            <div key={t.id} className="card p-5 hover:border-[#3b82f6] hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center text-2xl">{t.cover_icon || templateCategoryIcons[t.category] || "📦"}</div>
                  <div>
                    <h3 className="font-bold text-base text-[#1e293b]">{title}</h3>
                    <p className="text-xs text-[#64748b] mt-1 leading-relaxed">{subtitle}</p>
                  </div>
                </div>
                <span className={"shrink-0 text-[0.65rem] px-2 py-0.5 rounded-full font-medium " + (priority === "P0" ? "bg-[#dbeafe] text-[#1e40af]" : priority === "P1" ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#f1f5f9] text-[#475569]")}>{priority === "P0" ? "⭐ 深度包" : priority === "P1" ? "常用包" : "轻量包"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-[#f8fafc] p-3"><div className="text-[0.65rem] text-[#94a3b8] mb-1">适合对象</div><div className="flex flex-wrap gap-1">{suitableFor.slice(0, 4).map(x => <span key={x} className="tag tag-gray text-[0.55rem]">{x}</span>)}</div></div>
                <div className="rounded-xl bg-[#f8fafc] p-3"><div className="text-[0.65rem] text-[#94a3b8] mb-1">适用场景</div><div className="flex flex-wrap gap-1">{scenarioTags.slice(0, 4).map(x => <span key={x} className="tag tag-blue text-[0.55rem]">{x}</span>)}</div></div>
              </div>

              <div className="mb-4"><div className="text-[0.65rem] text-[#94a3b8] mb-1">核心材料 · {t.price_label || `${materials.length}份材料`}</div><div className="flex flex-wrap gap-1.5">{coreMaterials.map(m => <span key={m} className="text-[0.6rem] px-2 py-1 rounded-full bg-[#f1f5f9] text-[#475569]">{m}</span>)}</div></div>

              <div className="mb-4 rounded-xl border border-[#e2e8f0] p-3">
                <div className="text-[0.65rem] text-[#94a3b8] mb-1">交付价值</div>
                <p className="text-xs text-[#475569] leading-relaxed">{t.delivery_value || "一次填写活动信息，批量生成方案、通知、主持词、新闻稿、总结等材料初稿。"}</p>
                <ul className="mt-2 space-y-1">{sellingPoints.slice(0, 3).map(p => <li key={p} className="text-[0.65rem] text-[#64748b]">✓ {p}</li>)}</ul>
              </div>

              {isPreviewOpen && <div className="mb-4 rounded-xl bg-[#fffbeb] border border-[#fde68a] p-3 text-xs text-[#92400e] leading-relaxed whitespace-pre-wrap">{samplePreview}</div>}

              <div className="flex gap-2">
                <button onClick={() => setPreviewId(isPreviewOpen ? null : t.id)} className="btn-secondary text-xs flex-1 justify-center">{isPreviewOpen ? "收起样例" : "查看样例"}</button>
                <Link href={`/run-activity/template?id=${t.id}&source=marketplace`} className="btn-primary text-xs flex-1 justify-center">使用此模板生成</Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-[#94a3b8] text-sm">暂无匹配的材料包</div>}
    </div>
  );
}
