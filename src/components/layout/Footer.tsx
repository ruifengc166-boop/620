"use client";
import { useContent } from "@/lib/useContent";

export default function Footer() {
  const t = useContent();
  const beian = process.env.NEXT_PUBLIC_ICP_BEIAN || "";
  return (
    <footer className="hidden md:block bg-white border-t border-[#e2e8f0] py-6 mt-auto">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div><h3 className="font-semibold text-sm mb-2">办会助理</h3><p className="text-xs text-[#64748b]">{t("footer_tagline","活动材料 AI 助手 · 免费内测体验版")}</p></div>
          <div><h3 className="font-semibold text-sm mb-2">快速入口</h3><ul className="space-y-1 text-xs text-[#64748b]"><li><a href="/quick-write" className="hover:text-[#1a56db]">快速写材料</a></li><li><a href="/run-activity" className="hover:text-[#1a56db]">办一场活动</a></li><li><a href="/templates" className="hover:text-[#1a56db]">材料包库</a></li><li><a href="/contact" className="hover:text-[#1a56db]">机构试用</a></li></ul></div>
          <div><h3 className="font-semibold text-sm mb-2">安全提示</h3><p className="text-xs text-[#64748b] leading-relaxed">当前为内测体验工具，暂不提供在线交易和支付服务。请勿上传涉密、内部批示、个人隐私及商业秘密内容。</p></div>
        </div>
        <div className="border-t border-[#e2e8f0] pt-4 text-center text-xs text-[#94a3b8] leading-relaxed">
          <p>本平台生成内容仅为 AI 初稿，正式发布、报送和对外传播前请进行人工审核。</p>
          <p className="mt-1">当前为免费内测体验版本，暂不提供在线购买、充值、会员开通或支付服务。</p>
          <p className="mt-1"><a href="/privacy" className="hover:text-[#64748b]">隐私政策</a><span className="mx-2">·</span><a href="/terms" className="hover:text-[#64748b]">用户协议</a></p>
          {beian ? <p className="mt-1"><a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-[#64748b]">{beian}</a></p> : null}
          <p className="mt-1">&copy; 2026 办会助理 版权所有</p>
        </div>
      </div>
    </footer>
  );
}
