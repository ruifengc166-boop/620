"use client";
import { useState } from "react";
import Link from "next/link";
import { activityTemplates, templateCategories, templateCategoryIcons } from "@/data/templates";

export default function ActivityTemplateSelector() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all" ? activityTemplates : activityTemplates.filter(t => t.category === activeCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 slim-scrollbar">
        <button onClick={() => setActiveCategory("all")} className={"shrink-0 px-4 py-2 text-sm rounded-lg font-medium transition-colors " + (activeCategory === "all" ? "bg-[#1a56db] text-white" : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]")}>
          全部模板
        </button>
        {templateCategories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={"shrink-0 px-4 py-2 text-sm rounded-lg font-medium transition-colors " + (activeCategory === cat ? "bg-[#1a56db] text-white" : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc]")}>
            {templateCategoryIcons[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tmpl => (
          <Link key={tmpl.id} href={"/run-activity/template?id=" + tmpl.id} className="card p-5 group hover:border-[#3b82f6] hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="text-2xl">{templateCategoryIcons[tmpl.category] || "📋"}</div>
              <span className={"text-[0.65rem] px-2 py-0.5 rounded-full font-medium " + (tmpl.priority === "P0" ? "bg-[#dbeafe] text-[#1e40af]" : tmpl.priority === "P1" ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#f1f5f9] text-[#475569]")}>
                {tmpl.priority === "P0" ? "⭐ 深度" : tmpl.priority === "P1" ? "常用" : "轻量"}
              </span>
            </div>
            <h3 className="font-semibold text-sm text-[#1e293b] group-hover:text-[#1a56db]">{tmpl.name}</h3>
            <p className="text-xs text-[#64748b] mt-1 line-clamp-2">{tmpl.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#94a3b8]">{tmpl.materialCount}份材料</span>
              <span className="text-xs text-[#1a56db] font-medium">选择模板 &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#94a3b8]">
          <p>暂无匹配的模板</p>
        </div>
      )}
    </div>
  );
}

