import { NextResponse } from "next/server";
import { getAllTemplatesAdmin } from "@/lib/db";

function buildDefaultSamplePreview(t: any, coreMaterials: string[]) {
  const first = coreMaterials[0] || "活动方案";
  const second = coreMaterials[1] || "主持词";
  const third = coreMaterials[2] || "新闻稿";
  return `【${t.name || "活动"}材料包样例预览】

1. ${first}
将围绕活动背景、目标、时间地点、参与对象、流程安排和职责分工生成完整初稿。

2. ${second}
将生成可直接朗读的开场白、环节串词、嘉宾介绍和结束语。

3. ${third}
将生成标题、导语、活动过程、亮点成效和后续影响等新闻表达。

实际生成时会根据你填写的活动名称、时间、地点、主办单位和背景目的自动替换内容。`;
}

function normalizeTemplate(t: any) {
  const materials = t.output_materials || t.materials || [];
  const priority = t.priority_level || t.priority || "P2";
  const materialCount = t.materialCount || materials.length;
  const coreMaterials = t.core_materials?.length ? t.core_materials : materials.slice(0, 6);
  const suitableFor = t.suitable_for?.length ? t.suitable_for : (t.target_roles?.length ? t.target_roles : [t.category]);
  const scenarioTags = t.scenario_tags?.length ? t.scenario_tags : [t.category, t.name].filter(Boolean);
  const samplePreview = typeof t.sample_preview === "string" && t.sample_preview.trim()
    ? t.sample_preview.trim()
    : buildDefaultSamplePreview(t, coreMaterials);

  return {
    ...t,
    priority,
    priority_level: priority,
    materials,
    output_materials: materials,
    materialCount,
    marketplace_title: t.marketplace_title || `${t.name}材料包`,
    marketplace_subtitle: t.marketplace_subtitle || t.description || "一次填写活动信息，快速生成整套活动材料。",
    selling_points: t.selling_points?.length ? t.selling_points : [
      `包含${materialCount}份常用材料`,
      "覆盖会前、会中、会后主要文书",
      "适合快速生成初稿并人工修改",
    ],
    suitable_for: suitableFor,
    scenario_tags: scenarioTags,
    core_materials: coreMaterials,
    delivery_value: t.delivery_value || "一次填写活动信息，批量生成方案、通知、主持词、新闻稿、总结等材料初稿，适合正式活动筹备和归档修改。",
    sample_preview: samplePreview,
    cover_icon: t.cover_icon || "📦",
    price_label: t.price_label || `${materialCount}份材料`,
    sort_order: typeof t.sort_order === "number" ? t.sort_order : (priority === "P0" ? 10 : priority === "P1" ? 50 : 100),
    is_featured: typeof t.is_featured === "boolean" ? t.is_featured : priority === "P0",
  };
}

export async function GET() {
  const templates = getAllTemplatesAdmin()
    .filter((t: any) => t.is_active !== false)
    .map(normalizeTemplate)
    .sort((a: any, b: any) => (a.sort_order || 999) - (b.sort_order || 999));

  return NextResponse.json({ ok: true, templates });
}
