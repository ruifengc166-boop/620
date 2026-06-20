import ActivityTemplateSelector from "@/components/run-activity/ActivityTemplateSelector";

export default function TemplatesPage() {
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">📐 模板广场</h1>
        <p className="text-sm text-[#64748b] mt-1">浏览活动模板，快速生成整套材料包</p>
      </div>
      <ActivityTemplateSelector />
    </div>
  );
}

