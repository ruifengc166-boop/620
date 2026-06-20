"use client";
import Link from "next/link";

const quickTasks = [
  { name: "活动方案", icon: "📋", desc: "完整活动方案设计" },
  { name: "主持词", icon: "🎤", desc: "开场白、串词、结束语" },
  { name: "新闻稿", icon: "📰", desc: "正式新闻通稿" },
  { name: "公众号推文", icon: "💬", desc: "新媒体传播文案" },
  { name: "活动通知", icon: "📢", desc: "正式通知+微信群简版" },
  { name: "活动总结", icon: "📝", desc: "总结+简报+台账" },
  { name: "流程表", icon: "📊", desc: "结构化流程表格" },
  { name: "短视频脚本", icon: "🎬", desc: "口播稿+分镜建议" },
];

export default function HomePage() {
    return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a56db] via-[#2563eb] to-[#1e40af] text-white">
        <div className="container-app py-12 md:py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">办会工坊</h1>
            <p className="text-base md:text-xl text-[#bfdbfe] max-w-2xl mx-auto">一站式活动材料 AI 助手</p>
            <p className="text-sm text-[#93c5fd] mt-2">写方案、主持词、新闻稿、总结，不再从零开始</p>
          </div>

          {/* Three Main Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/quick-write" className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-2">✍️</div>
              <h2 className="font-semibold text-lg">我要快速写一个材料</h2>
              <p className="text-sm text-[#bfdbfe] mt-1">12种高频材料，快速生成多版本</p>
            </Link>
            <Link href="/run-activity" className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="font-semibold text-lg">我要办一场活动</h2>
              <p className="text-sm text-[#bfdbfe] mt-1">24个活动模板，整套材料包生成</p>
            </Link>
            
          </div>

          {/* Slogan */}
          <div className="mt-8 text-center">
            <p className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm text-[#bfdbfe]">
              🛡️ 默认不保存原始资料 · 即用即走 · 安全生成
            </p>
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <div className="container-app my-4">
        <div className="security-banner flex items-start gap-2">
          <span className="text-lg shrink-0">🔒</span>
          <div>
            <p className="font-medium text-sm">安全提示</p>
            <p className="text-xs mt-0.5">默认不保存原始资料。请勿上传涉密、内部批示、未公开会议纪要、个人隐私、商业秘密及未经授权的第三方内容。</p>
          </div>
        </div>
      </div>

      {/* High Frequency Tasks */}
      <section className="container-app py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-xl font-bold text-[#1e293b]">📝 常用材料</h2>
          <Link href="/quick-write" className="text-sm text-[#1a56db] hover:text-[#1e40af] font-medium">查看全部 &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {quickTasks.map((task) => (
            <Link key={task.name} href={"/quick-write/task?type=" + encodeURIComponent(task.name)} className="card p-4 text-center hover:border-[#3b82f6] hover:shadow-md transition-all">
              <div className="text-2xl mb-1.5">{task.icon}</div>
              <div className="font-medium text-sm text-[#1e293b]">{task.name}</div>
              <div className="text-[0.65rem] text-[#64748b] mt-0.5 line-clamp-1">{task.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Role Workspace Entry */}
      <section className="bg-white border-t border-[#e2e8f0] py-8">
        <div className="container-app">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-bold text-[#1e293b]">👤 角色工作台</h2>
            <Link href="/role-workspace" className="text-sm text-[#1a56db] hover:text-[#1e40af] font-medium">选择角色 &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: "活动负责人", icon: "👨‍💼" },
              { name: "材料撰写人", icon: "✍" },
              { name: "宣传人员", icon: "📸" },
              { name: "党建工作人员", icon: "🚩" },
              { name: "会务执行人员", icon: "🎪" },
            ].map((role) => (
              <Link key={role.name} href={"/role-workspace/role?role=" + encodeURIComponent(role.name)} className="card p-4 text-center hover:border-[#3b82f6] transition-all">
                <div className="text-2xl mb-1">{role.icon}</div>
                <div className="text-xs font-medium text-[#475569]">{role.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container-app py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/templates" className="card p-5 flex items-center gap-3 hover:border-[#059669] transition-all">
            <span className="text-3xl">📐</span>
            <div><div className="font-semibold text-sm">模板广场</div><div className="text-xs text-[#64748b]">24个活动模板</div></div>
          </Link>
          <Link href="/sample-demo" className="card p-5 flex items-center gap-3 hover:border-[#059669] transition-all">
            <span className="text-3xl">🎬</span>
            <div><div className="font-semibold text-sm">样例演示</div><div className="text-xs text-[#64748b]">查看生成效果</div></div>
          </Link>
        </div>
      </section>


    </div>
  );
}








