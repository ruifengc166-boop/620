"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingPage() {
  const { isAuthenticated, user } = useAuth();
  const wechatName = process.env.NEXT_PUBLIC_WECHAT_ACCOUNT_NAME || "办会助理";
  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="card p-6 md:p-8 mb-5 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] mb-2">欢迎使用办会助理</h1>
          <p className="text-sm text-[#64748b] leading-relaxed">{isAuthenticated ? `${user?.nickname || "你"}，` : ""}你已进入免费公测流程。建议先用一个真实活动生成第一份材料，再通过公众号绑定解锁更多额度。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <Link href="/quick-write/task?id=activity_plan" className="card p-5 hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl mb-3">📋</div><h2 className="font-semibold mb-2">先生成活动方案</h2><p className="text-xs text-[#64748b] leading-relaxed">适合第一次体验，能快速看出结构、流程、分工和风险提示。</p>
          </Link>
          <Link href="/quick-write/task?id=news_release" className="card p-5 hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl mb-3">📰</div><h2 className="font-semibold mb-2">再试新闻稿</h2><p className="text-xs text-[#64748b] leading-relaxed">测试生成内容是否像真实通稿，是否避免空话和编造。</p>
          </Link>
          <Link href="/quick-write/task?id=wechat_article" className="card p-5 hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl mb-3">📣</div><h2 className="font-semibold mb-2">最后试推文</h2><p className="text-xs text-[#64748b] leading-relaxed">适合检查传播感、标题、段落和行动引导。</p>
          </Link>
        </div>

        <div className="card p-6 mb-5 border-[#bfdbfe] bg-[#eff6ff]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-[#1e3a8a] mb-2">公众号绑定，解锁更多公测额度</h2>
              <p className="text-sm text-[#475569] leading-relaxed">进入“我的账户”生成 BH 开头绑定码，关注公众号「{wechatName}」后回复绑定码，系统会自动增加生成额度。</p>
            </div>
            <Link href="/account" className="btn-primary justify-center shrink-0 px-5 py-2.5">去生成绑定码</Link>
          </div>
        </div>

        <div className="card p-6 mb-5">
          <h2 className="font-semibold mb-3">使用前请注意</h2>
          <ul className="text-sm text-[#475569] space-y-2 leading-relaxed">
            <li>• 生成内容为 AI 初稿，正式发布、报送、归档或对外传播前必须人工审核。</li>
            <li>• 请勿上传涉密资料、内部批示、未公开会议纪要、个人隐私或商业秘密。</li>
            <li>• 生成后可以点击“好用 / 一般 / 不好用”，你的反馈会用于优化 Prompt 引擎。</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/quick-write" className="btn-primary justify-center px-6 py-3">开始写材料</Link>
          <Link href="/run-activity" className="btn-secondary justify-center px-6 py-3">办一场活动</Link>
          <Link href="/sample-demo" className="btn-secondary justify-center px-6 py-3">看样例</Link>
        </div>
      </div>
    </div>
  );
}
