import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] text-[#1d4ed8] px-4 py-1.5 text-xs font-medium mb-4">免费内测 · 暂不提供在线交易和支付服务</div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#1e293b]">申请机构内测</h1>
          <p className="text-sm md:text-base text-[#64748b] mt-3 leading-relaxed">办会助理当前处于免费内测和真实场景验证阶段。欢迎协会、园区、培训机构、活动团队、社群运营团队和分赛场组织方申请试用，共同打磨活动材料包能力。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { title: "适合谁", items: ["活动组织者", "协会/园区运营", "培训与社群团队", "赛事/分赛场执行方"] },
            { title: "能试什么", items: ["活动方案", "通知与主持词", "新闻稿和推文", "总结与复盘材料"] },
            { title: "怎么合作", items: ["免费体验", "反馈共创", "场景模板沉淀", "机构试用支持"] },
          ].map((card) => (
            <div key={card.title} className="card p-5">
              <h2 className="font-semibold text-sm mb-3 text-[#1e293b]">{card.title}</h2>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                {card.items.map(item => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="card p-6 mb-6 border-[#bfdbfe] bg-[#eff6ff]">
          <h2 className="font-semibold text-lg text-[#1e3a8a] mb-3">申请方式</h2>
          <div className="space-y-3 text-sm text-[#1e3a8a] leading-relaxed">
            <p>请通过你与项目团队已有的微信、社群或合作渠道联系，说明你的机构/团队类型、近期活动场景和希望生成的材料类型。</p>
            <p>如果你是瓦卡奖分赛场、创作营、AI社群活动、园区沙龙、协会培训等活动组织方，可以直接申请专属活动材料包试用。</p>
          </div>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link href="/run-activity" className="btn-primary text-sm px-5 py-2 text-center">先免费试用一次</Link>
            <Link href="/templates" className="btn-secondary text-sm px-5 py-2 text-center">查看材料包库</Link>
          </div>
        </div>

        <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] p-5 text-xs text-[#92400e] leading-relaxed">
          <p className="font-semibold mb-1">合规说明</p>
          <p>办会助理当前为内测体验工具，暂不提供在线购买、充值、会员开通或支付服务。生成内容仅供参考，正式发布、报送、对外传播或商业使用前，请根据实际情况进行人工审核和合规确认。</p>
        </div>
      </div>
    </div>
  );
}
