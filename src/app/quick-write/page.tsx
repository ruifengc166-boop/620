import Link from "next/link";

const taskCategories = [
  {
    name: "方案类", items: [
      { name: "活动方案", icon: "📋", desc: "生成完整的活动方案", id: "activity_plan" },
      { name: "活动流程表", icon: "📊", desc: "结构化流程表格", id: "process_table" },
      { name: "任务分工表", icon: "👥", desc: "职责分工表格", id: "task_assignment" },
    ]
  },
  {
    name: "稿子类", items: [
      { name: "主持词", icon: "🎤", desc: "开场白、串词、结束语", id: "host_script" },
      { name: "领导致辞初稿", icon: "🎯", desc: "发言材料整理", id: "leadership_speech" },
      { name: "新闻稿", icon: "📰", desc: "正式新闻通稿", id: "news_release" },
    ]
  },
  {
    name: "宣传类", items: [
      { name: "公众号推文", icon: "💬", desc: "新媒体传播文案", id: "official_account" },
      { name: "短视频口播脚本", icon: "🎬", desc: "口播稿+分镜", id: "short_video_script" },
      { name: "邀请函", icon: "✉️", desc: "正式函+微信文案", id: "invitation" },
    ]
  },
  {
    name: "总结通知类", items: [
      { name: "活动通知", icon: "📢", desc: "正式通知+简版", id: "activity_notice" },
      { name: "活动总结", icon: "📝", desc: "总结+简报+台账", id: "activity_summary" },
      { name: "工作简报", icon: "📄", desc: "简报+亮点提炼", id: "work_briefing" },
    ]
  },
];

export default function QuickWritePage() {
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">✍️ 快速写一个材料</h1>
        <p className="text-sm text-[#64748b] mt-1">选择一个材料类型，填写信息，一键生成多版本</p>
      </div>

      <div className="security-banner mb-6 flex items-start gap-2">
        <span className="text-lg shrink-0">🔒</span>
        <p className="text-xs">请填写可公开或已脱敏的信息。涉及姓名、职务、数据、金额、政策依据等内容，请在使用前自行核实。</p>
      </div>

      <div className="space-y-8">
        {taskCategories.map((cat) => (
          <div key={cat.name}>
            <h2 className="text-sm font-semibold text-[#64748b] mb-3 uppercase tracking-wider">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((task) => (
                <Link key={task.id} href={"/quick-write/task?id=" + task.id} className="card p-5 flex items-center gap-4 hover:border-[#3b82f6] hover:shadow-md transition-all group">
                  <div className="text-3xl shrink-0">{task.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#1e293b] group-hover:text-[#1a56db]">{task.name}</div>
                    <div className="text-xs text-[#64748b] mt-0.5">{task.desc}</div>
                  </div>
                  <span className="text-[#94a3b8] group-hover:text-[#1a56db]">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl">
        <p className="text-xs text-[#166534]">
          <strong>💡 提示：</strong>每个材料任务支持多版本生成，您可以在结果页面选择、对比、融合不同版本。
        </p>
      </div>
    </div>
  );
}

