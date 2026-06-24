"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/account/usage", { credentials: "include" })
        .then(r => r.json())
        .then(d => { if (d.ok) setUsage(d); })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container-app py-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-xl font-bold text-[#1e293b] mb-2">请先登录</h1>
          <p className="text-sm text-[#64748b] mb-6">登录后可查看内测额度和使用情况</p>
          <Link href="/login" className="btn-primary inline-flex px-8 py-2.5">去登录</Link>
        </div>
      </div>
    );
  }

  const planLabel = user?.membership_level === "admin" ? "管理员" : user?.membership_level === "pro" ? "机构内测" : user?.membership_level === "expert" ? "深度内测" : "免费内测";

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">💎 我的账户</h1>
        <p className="text-sm text-[#64748b] mt-1">当前为免费内测体验阶段，暂不提供在线交易、充值和付费开通。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-xl font-bold">{(user?.nickname?.[0]) || "U"}</div>
              <div><h2 className="font-semibold text-lg">{user?.nickname}</h2><p className="text-sm text-[#64748b]">{user?.email}</p></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#e2e8f0]">
              <div><div className="text-xs text-[#64748b]">内测身份</div><div className={"text-sm font-medium mt-0.5 " + (usage ? "text-[#059669]" : "text-[#94a3b8]")}>{planLabel}</div></div>
              <div><div className="text-xs text-[#64748b]">剩余点数</div><div className="text-sm font-medium mt-0.5">{user?.points_balance ?? "--"} 点</div></div>
              <div><div className="text-xs text-[#64748b]">今日已用</div><div className="text-sm font-medium mt-0.5">{usage ? usage.today + "/" + usage.daily_limit : "--"} 次</div></div>
              <div><div className="text-xs text-[#64748b]">剩余次数</div><div className={"text-sm font-medium mt-0.5 " + (usage && usage.remaining < 5 ? "text-[#dc2626]" : "")}>{usage ? usage.remaining : "--"} 次</div></div>
            </div>
          </div>
          <div className="card p-6 mb-4">
            <h2 className="font-semibold mb-3">内测说明</h2>
            <div className="text-sm text-[#475569] leading-relaxed space-y-2">
              <p>办会助理当前用于免费体验、真实场景验证和机构试用申请。生成内容仅为 AI 初稿，正式发布、报送和对外传播前，请务必进行人工审核。</p>
              <p>如需用于系列活动、分赛场、园区沙龙、协会培训、社群活动等机构场景，可申请内测支持。</p>
            </div>
            <Link href="/contact" className="btn-primary inline-flex mt-4 text-sm px-5 py-2">申请机构内测</Link>
          </div>
          <div className="card p-6"><h2 className="font-semibold mb-4">使用记录</h2><div className="text-center py-6 text-[#94a3b8] text-sm"><p>暂无使用记录</p><p className="text-xs mt-1">开始生成材料后，这里会显示历史记录</p></div></div>
        </div>
        <div>
          <div className="card p-6 mb-4 border-[#bbf7d0] bg-[#f0fdf4]"><h3 className="font-semibold text-sm text-[#166534]">🧪 免费内测版 {(!user || user.membership_level === "free") ? "(当前)" : ""}</h3><p className="text-2xl font-bold text-[#166534] my-2">体验开放</p><ul className="text-xs space-y-1.5 text-[#166534]"><li>✓ 每日{usage ? usage.daily_limit : 10}次生成体验</li><li>✓ 基础活动材料</li><li>✓ 常用材料包模板</li><li>✓ 复制文本</li><li>✓ 人工审核提示</li></ul></div>
          <div className="card p-6 mb-4 border-[#bfdbfe]"><h3 className="font-semibold text-sm">🌟 机构内测支持</h3><p className="text-lg font-bold my-2">联系申请</p><ul className="text-xs space-y-1.5 text-[#475569]"><li>✓ 适合协会、园区、培训机构、活动团队</li><li>✓ 系列活动材料包</li><li>✓ 分赛场/分享会/培训会场景</li><li>✓ 反馈共创与模板优化</li></ul><Link href="/contact" className="btn-secondary w-full mt-4 text-sm flex justify-center py-2">申请试用</Link></div>
          <div className="card p-6 border-[#ddd6fe]"><h3 className="font-semibold text-sm">🚀 深度共创</h3><p className="text-lg font-bold my-2">内测邀请</p><ul className="text-xs space-y-1.5 text-[#475569]"><li>✓ 批量活动材料验证</li><li>✓ 专属场景模板沉淀</li><li>✓ 活动组织流程共创</li><li>✓ 适合长期活动运营团队</li></ul><Link href="/contact" className="btn-secondary w-full mt-4 text-sm flex justify-center py-2">联系共创</Link></div>
          <button onClick={() => { logout(); router.push("/"); }} className="w-full mt-4 py-2.5 text-sm text-[#dc2626] hover:text-[#991b1b] hover:underline text-center">退出登录</button>
        </div>
      </div>
    </div>
  );
}
