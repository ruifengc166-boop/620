import TemplateMarketplace from "@/components/templates/TemplateMarketplace";

export default function TemplatesPage() {
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">📐 活动材料包库</h1>
        <p className="text-sm text-[#64748b] mt-1">浏览成熟活动材料包，查看适用场景、材料清单和样例片段，再进入生成流程</p>
      </div>
      <TemplateMarketplace />
    </div>
  );
}
