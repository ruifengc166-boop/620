import ActivityTemplateSelector from "@/components/run-activity/ActivityTemplateSelector";

export default function RunActivityPage() {
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">🎉 办一场活动</h1>
        <p className="text-sm text-[#64748b] mt-1">选择一个活动模板，填写信息，一次性生成整套活动材料包</p>
      </div>

      <div className="security-banner mb-6 flex items-start gap-2">
        <span className="text-lg shrink-0">🔒</span>
        <p className="text-xs">请填写可公开或已脱敏的信息。生成内容仅为AI初稿，发布前请进行人工审核。</p>
      </div>

      <ActivityTemplateSelector />
    </div>
  );
}

