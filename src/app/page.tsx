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
      <section className="bg-gradient-to-br from-[#1a56db] via-[#2563eb] to-[#1e40af] text-white">
        <div className="container-app py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs text-[#dbeafe] mb-4">免费内测中 · 暂不提供在线交易和支付服务</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">办会助理</h1>
            <p className="text-base md:text-xl text-[#bfdbfe] max-w-2xl mx-auto">给活动组织者用的 AI 材料助手</p>
            <p className="text-sm text-[#93c5fd] mt-2">一次填写活动信息，生成方案、通知、主持词、新闻稿、推文和总结初稿</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link href="/run-activity" className="bg-white text-[#1d4ed8] rounded-xl px-6 py-3 text-sm font-semibold shadow-lg hover:bg-[#eff6ff] transition-colors">免费试用生成材料</Link>
            <Link href="/contact" className="bg-white/10 border border-white/30 rounded-xl px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors">申请机构内测</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/quick-write" className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-2">✍️</div>
              <h2 className="font-semibold text-lg">我要快速写一个材料</h2>
              <p className="text-sm text-[#bfdbfe] mt-1">高频材料，快速生成初稿</p>
            </Link>
            <Link href="/run-activity" className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all hover:scale-[1.02]">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="font-semibold text-lg">我要办一场活动</h2>
              <p className="text-sm text-[#bfdbfe] mt-1">填写一次信息，生成整套活动材料</p>
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] rounded-2xl p-8 md:p-12 mt-8 mb-8 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">为什么选择办会助理</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "免费体验", desc: "当前为内测体验版，适合先验证真实办会场景" },
                { title: "快速出稿", desc: "先生成活动材料初稿，再由人工审核修改" },
                { title: "材料包一键出", desc: "选活动模板，方案、通知、主持词、新闻稿一起准备" },
                { title: "适合机构试用", desc: "协会、园区、培训、社群和活动团队可申请内测支持" },
              ].map(f => (
                <div key={f.title} className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="font-bold text-xl mb-3 text-[#1e293b]">{f.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm text-[#bfdbfe]">🛡️ 内测体验工具 · 生成内容仅供参考 · 正式使用前请人工审核</p>
          </div>
        </div>
      </section>

      <div className="container-app my-4">
        <div className="security-banner flex items-start gap-2">
          <span className="text-lg shrink-0">🔒</span>
          <div>
            <p className="font-medium text-sm">安全与合规提示</p>
            <p className="text-xs mt-0.5">当前为免费内测体验版，暂不提供在线交易和支付服务。请勿上传涉密、内部批示、未公开会议纪要、个人隐私、商业秘密及未经授权的第三方内容。</p>
          </div>
        </div>
      </div>

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

      <section className="container-app py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/templates" className="card p-5 flex items-center gap-3 hover:border-[#059669] transition-all"><span className="text-3xl">📐</span><div><div className="font-semibold text-sm">活动材料包库</div><div className="text-xs text-[#64748b]">先看模板包，再进入生成</div></div></Link>
          <Link href="/sample-demo" className="card p-5 flex items-center gap-3 hover:border-[#059669] transition-all"><span className="text-3xl">🎬</span><div><div className="font-semibold text-sm">样例演示</div><div className="text-xs text-[#64748b]">查看生成效果</div></div></Link>
          <Link href="/contact" className="card p-5 flex items-center gap-3 hover:border-[#059669] transition-all"><span className="text-3xl">🤝</span><div><div className="font-semibold text-sm">机构试用</div><div className="text-xs text-[#64748b]">申请内测支持</div></div></Link>
        </div>
      </section>
    </div>
  );
}
