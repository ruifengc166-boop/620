import Link from "next/link";

const materials = ["活动方案", "主持词", "新闻稿", "公众号推文", "活动总结", "任务分工表"];
const audiences = ["社区/街道活动", "协会秘书处", "园区运营", "培训机构", "活动策划执行", "AI创作营/分赛场"];

export default function BetaPage() {
  const wechatName = process.env.NEXT_PUBLIC_WECHAT_ACCOUNT_NAME || "办会助理";
  return (
    <div className="container-app py-8 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#eff6ff] via-white to-[#f0fdf4] border border-[#dbeafe] p-6 md:p-10 mb-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-white border border-[#bfdbfe] px-3 py-1 text-xs font-medium text-[#1d4ed8] mb-4">免费公测 · 公众号绑定加额度</span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] leading-tight mb-4">一次填写活动信息，生成整套办会材料</h1>
          <p className="text-base md:text-lg text-[#475569] leading-relaxed mb-6">办会助理面向真实活动组织场景，帮助你快速生成活动方案、主持词、新闻稿、公众号推文、总结等 AI 初稿。正式使用前请人工审核事实、数据和授权。</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="btn-primary justify-center px-6 py-3 text-base">立即免费公测</Link>
            <Link href="/sample-demo" className="btn-secondary justify-center px-6 py-3 text-base">查看样例演示</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5"><div className="text-2xl mb-2">①</div><h2 className="font-semibold mb-2">注册获得体验额度</h2><p className="text-sm text-[#64748b] leading-relaxed">邮箱注册后即可获得基础体验额度，先生成第一份活动材料，验证输出是否可用。</p></div>
        <div className="card p-5"><div className="text-2xl mb-2">②</div><h2 className="font-semibold mb-2">关注公众号回复绑定码</h2><p className="text-sm text-[#64748b] leading-relaxed">进入“我的账户”生成 BH 开头绑定码，在公众号「{wechatName}」回复后自动增加额度。</p></div>
        <div className="card p-5"><div className="text-2xl mb-2">③</div><h2 className="font-semibold mb-2">反馈质量继续优化</h2><p className="text-sm text-[#64748b] leading-relaxed">生成后可点“好用/一般/不好用”，反馈会用于优化 Prompt 引擎和模板体系。</p></div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-[#1e293b] mb-4">能生成什么？</h2>
          <div className="grid grid-cols-2 gap-2">{materials.map(m => <div key={m} className="rounded-lg bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2 text-sm text-[#475569]">✓ {m}</div>)}</div>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-[#1e293b] mb-4">适合谁用？</h2>
          <div className="grid grid-cols-2 gap-2">{audiences.map(m => <div key={m} className="rounded-lg bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2 text-sm text-[#475569]">✓ {m}</div>)}</div>
        </div>
      </section>

      <section className="card p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold text-[#1e293b] mb-3">公测注意事项</h2>
        <div className="space-y-2 text-sm text-[#475569] leading-relaxed">
          <p>1. 本工具生成内容为 AI 初稿，不等于正式公文、政策解释或最终发布稿。</p>
          <p>2. 请勿上传涉密资料、内部批示、未公开会议纪要、个人隐私、商业秘密或未经授权内容。</p>
          <p>3. 正式发布、报送、归档或对外传播前，请人工核实政策依据、领导姓名、职务、数据、金额、单位名称和公开授权。</p>
        </div>
      </section>

      <section className="text-center rounded-3xl bg-[#0f172a] text-white p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">现在开始生成第一套活动材料</h2>
        <p className="text-sm md:text-base text-[#cbd5e1] mb-6">先用真实活动试一份，再通过公众号绑定解锁更多公测额度。</p>
        <Link href="/register" className="inline-flex btn-primary px-8 py-3 text-base justify-center">注册并开始</Link>
      </section>
    </div>
  );
}
