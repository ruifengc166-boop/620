import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto card p-6 md:p-8">
        <Link href="/" className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回首页</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] mt-4 mb-2">隐私政策</h1>
        <p className="text-xs text-[#94a3b8] mb-6">更新日期：2026年7月1日</p>

        <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">一、我们收集的信息</h2>
            <p>为提供账号登录、材料生成、额度管理、风险控制和问题排查服务，办会助理可能收集以下信息：邮箱、昵称、账号创建时间、登录状态、生成记录、使用额度、IP 地址、浏览器 User-Agent、操作时间、反馈信息以及用户主动填写的活动信息。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">二、用户输入内容的处理</h2>
            <p>用户输入的活动名称、单位信息、流程安排、背景目的等内容仅用于生成对应活动材料初稿、保存用户材料、排查生成问题和改进服务体验。请勿上传涉密资料、内部批示、未公开会议纪要、个人隐私、商业秘密或未经授权的第三方内容。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">三、模型调用说明</h2>
            <p>办会助理会调用第三方大模型服务生成材料。为完成生成请求，用户提交的必要文本可能会被发送至当前配置的大模型接口。我们不会主动将用户输入内容用于公开展示，也不会主动将用户材料作为训练数据提供给第三方。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">四、信息使用目的</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>提供账号注册、登录和身份识别。</li>
              <li>完成活动方案、主持词、新闻稿、公众号推文、总结等材料生成。</li>
              <li>统计生成次数、管理免费内测额度、防止恶意注册和接口滥用。</li>
              <li>根据用户反馈改进材料质量和 Prompt 引擎。</li>
              <li>排查系统错误、模型失败和安全风险。</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">五、信息保存与安全</h2>
            <p>我们会采取合理措施保护用户信息，避免未经授权的访问、泄露、篡改或丢失。当前服务仍处于免费公测/内测阶段，生成内容不建议作为唯一正式依据。用户应自行保存重要材料，并在正式使用前完成事实、数据、政策、姓名、职务和授权审核。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">六、用户权利</h2>
            <p>用户可以要求更正账号信息、删除不再需要的材料或反馈记录、停止使用本服务。由于当前系统处于早期阶段，相关请求可通过网站公布的联系渠道提交，我们将在合理时间内处理。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">七、未成年人和敏感信息</h2>
            <p>本工具面向活动组织和办公材料生成场景，不建议未成年人单独使用。请勿上传身份证号、手机号、家庭住址、居民名单、内部通讯录、财务明细、未公开会议资料等敏感信息。</p>
          </section>

          <section>
            <h2 className="font-semibold text-[#1e293b] mb-2">八、政策更新</h2>
            <p>我们可能根据产品功能、法律法规或运营需要更新本隐私政策。更新后将在本页面展示新的版本和日期。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
