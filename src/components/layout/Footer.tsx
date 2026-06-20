"use client";
import { useContent } from "@/lib/useContent";
export default function Footer() {
  const t = useContent();
  return (
    <footer className="hidden md:block bg-white border-t border-[#e2e8f0] py-6 mt-auto">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div><h3 className="font-semibold text-sm mb-2">办会助理</h3><p className="text-xs text-[#64748b]">{t("footer_tagline","少加班，快交稿，材料不出错")}</p></div>
          <div><h3 className="font-semibold text-sm mb-2">快速入口</h3><ul className="space-y-1 text-xs text-[#64748b]"><li><a href="/quick-write" className="hover:text-[#1a56db]">快速写材料</a></li><li><a href="/run-activity" className="hover:text-[#1a56db]">办一场活动</a></li><li><a href="/templates" className="hover:text-[#1a56db]">模板广场</a></li></ul></div>
          <div><h3 className="font-semibold text-sm mb-2">安全提示</h3><p className="text-xs text-[#64748b]">默认不保存原始资料。请勿上传涉密、内部批示、个人隐私及商业秘密内容。</p></div>
        </div>
        <div className="border-t border-[#e2e8f0] pt-4 text-center text-xs text-[#94a3b8]"><p>本平台生成内容仅为AI初稿，发布前请进行人工审核。</p><p className="mt-1">&copy; 2026 办会助理 版权所有</p></div>
      </div>
    </footer>
  );
}


