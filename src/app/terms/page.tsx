import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto card p-6 md:p-8">
        <Link href="/" className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回首页</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] mt-4 mb-2">用户协议</h1>
        <p className="text-xs text-[#94a3b8] mb-6">更新日期：2026年7月1日</p>

        <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">一、服务性质</h2>
            <p>办会助理是活动材料 AI 初稿生成工具，可用于辅助生成活动方案、主持词、领导致辞初稿、新闻稿、公众号推文、活动通知、流程表、任务分工表、活动总结等材料。当前服务处于免费内测/公测阶段，暂不提供在线交易、充值、会员开通或支付服务。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">二、AI 初稿声明</h2>
            <p>办会助理生成的内容仅为 AI 初稿，不构成正式公文、政策解释、法律意见、审计意见或最终发布稿。正式发布、报送、归档、签约、宣传或对外传播前，用户必须自行进行人工审核。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">三、用户责任</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>用户应确保输入信息真实、合法、可授权使用。</li>
              <li>用户不得上传涉密资料、内部批示、未公开会议纪要、个人隐私、商业秘密或未经授权的第三方内容。</li>
              <li>用户不得利用本服务生成违法违规、虚假宣传、侵权、涉政不当、欺诈或损害他人权益的内容。</li>
              <li>用户应自行核实政策依据、领导姓名、职务排序、单位名称、活动数据、金额、成果评价和公开授权。</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">四、额度和防滥用</h2>
            <p>平台可能根据用户身份、使用频率、风控情况和内测政策设置生成额度、频率限制或访问限制。对于恶意注册、批量消耗接口、绕过限制、攻击系统、传播违规内容的行为，平台有权限制、暂停或终止相关账号使用。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">五、内容准确性</h2>
            <p>AI 生成内容可能存在事实不完整、表达不准确、格式不匹配或信息遗漏。平台会尽力通过 Prompt 引擎、风险提示和人工反馈机制提升质量，但不保证生成内容完全准确、完整或适合所有正式场景。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">六、知识产权与使用</h2>
            <p>用户对其合法输入的活动资料和最终人工修改后的材料承担相应权利和责任。平台提供的模板、页面设计、Prompt 引擎和产品能力属于平台服务组成部分，未经许可不得复制、反向工程或用于竞争性产品。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">七、服务变更</h2>
            <p>平台可能根据测试情况调整功能、模型、额度、模板、风控规则或服务入口。由于当前处于免费公测阶段，部分功能可能出现不稳定、调整或下线。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">八、协议更新</h2>
            <p>我们可能根据产品发展、法律法规或运营需要更新本协议。更新后将在本页面展示新的版本和日期。继续使用本服务即视为接受更新后的协议。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
