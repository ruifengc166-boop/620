"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [usage, setUsage] = useState<any>(null);
  const [bind, setBind] = useState<any>(null);
  const [bindMsg, setBindMsg] = useState("");

  const loadUsage = () => {
    fetch("/api/account/usage", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.ok) setUsage(d); })
      .catch(() => {});
  };

  const loadBind = () => {
    fetch("/api/account/bind-code", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.ok) setBind(d); })
      .catch(() => {});
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsage();
      loadBind();
    }
  }, [isAuthenticated]);

  const createBindCode = async () => {
    setBindMsg("");
    const r = await fetch("/api/account/bind-code", { method: "POST", credentials: "include" });
    const d = await r.json();
    if (d.ok) { setBind(d); setBindMsg("绑定码已生成。关注公众号后回复该绑定码即可自动加额度。"); }
    else setBindMsg(d.msg || "生成绑定码失败");
  };

  const refreshBind = () => { loadBind(); loadUsage(); setBindMsg("已刷新绑定状态"); setTimeout(() => setBindMsg(""), 2000); };

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
  const usedToday = usage?.today ?? 0;
  const usableTotalToday = usage ? usedToday + (usage.remaining || 0) : null;
  const points = usage?.points_balance ?? user?.points_balance ?? "--";
  const wechatName = process.env.NEXT_PUBLIC_WECHAT_ACCOUNT_NAME || "办会助理";
  const wechatQrUrl = process.env.NEXT_PUBLIC_WECHAT_QR_URL || "";

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
              <div><div className="text-xs text-[#64748b]">剩余点数</div><div className="text-sm font-medium mt-0.5">{points} 点</div></div>
              <div><div className="text-xs text-[#64748b]">今日已用/可用</div><div className="text-sm font-medium mt-0.5">{usage ? usedToday + "/" + usableTotalToday : "--"} 次</div></div>
              <div><div className="text-xs text-[#64748b]">可生成次数</div><div className={"text-sm font-medium mt-0.5 " + (usage && usage.remaining < 5 ? "text-[#dc2626]" : "")}>{usage ? usage.remaining : "--"} 次</div></div>
            </div>
          </div>

          <div className="card p-6 mb-4 border-[#bfdbfe] bg-[#eff6ff]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold mb-2 text-[#1e3a8a]">📮 公众号绑定加额度</h2>
                <p className="text-sm text-[#475569] leading-relaxed">关注公众号并回复绑定码，可自动获得额外内测额度。一个网站账号、一个微信 openid 只能领取一次。</p>
              </div>
              <span className={"shrink-0 px-2 py-1 rounded-full text-[0.65rem] " + (bind?.bound ? "bg-[#dcfce7] text-[#166534]" : "bg-white text-[#1d4ed8] border border-[#bfdbfe]")}>{bind?.bound ? "已绑定" : "未绑定"}</span>
            </div>
            {bind?.bound ? (
              <div className="mt-4 p-3 rounded-lg bg-white border border-[#bfdbfe] text-sm text-[#166534]">已完成公众号绑定，奖励额度已自动发放。当前可生成次数以账户额度为准。</div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 items-start">
                <div className="bg-white border border-[#bfdbfe] rounded-xl p-3 text-center">
                  {wechatQrUrl ? <img src={wechatQrUrl} alt={`${wechatName}公众号二维码`} className="w-32 h-32 mx-auto rounded-lg object-cover" /> : <div className="w-32 h-32 mx-auto rounded-lg bg-[#f1f5f9] flex items-center justify-center text-xs text-[#94a3b8]">公众号二维码<br/>待配置</div>}
                  <div className="text-[0.65rem] text-[#64748b] mt-2">扫码关注「{wechatName}」</div>
                </div>
                <div className="space-y-3">
                  {bind?.code ? <div className="p-4 bg-white border border-[#bfdbfe] rounded-xl text-center md:text-left"><div className="text-xs text-[#64748b] mb-1">关注后回复绑定码</div><div className="text-3xl font-bold tracking-widest text-[#1d4ed8]">{bind.code}</div><div className="text-[0.65rem] text-[#94a3b8] mt-1">有效期：{bind.expires_at ? new Date(bind.expires_at).toLocaleString() : "24小时"}</div></div> : <div className="p-4 bg-white border border-[#bfdbfe] rounded-xl text-sm text-[#475569]">先点击“生成绑定码”，再扫码关注公众号并回复绑定码。</div>}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={createBindCode} className="btn-primary text-sm justify-center py-2">{bind?.code ? "重新生成绑定码" : "生成绑定码"}</button>
                    <button onClick={refreshBind} className="btn-secondary text-sm justify-center py-2">我已回复，刷新状态</button>
                  </div>
                  {!wechatQrUrl && <p className="text-xs text-[#64748b]">提示：如需显示二维码，请在腾讯云环境变量设置 <code>NEXT_PUBLIC_WECHAT_QR_URL</code>，并重新构建。</p>}
                </div>
              </div>
            )}
            {bindMsg && <p className="text-xs text-[#1d4ed8] mt-3">{bindMsg}</p>}
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
          <div className="card p-6 mb-4 border-[#bbf7d0] bg-[#f0fdf4]"><h3 className="font-semibold text-sm text-[#166534]">🧪 免费内测版 {(!user || user.membership_level === "free") ? "(当前)" : ""}</h3><p className="text-2xl font-bold text-[#166534] my-2">体验开放</p><ul className="text-xs space-y-1.5 text-[#166534]"><li>✓ 当前可生成 {usage ? usage.remaining : 3} 次</li><li>✓ 公众号绑定可加额度</li><li>✓ 基础活动材料</li><li>✓ 常用材料包模板</li><li>✓ 人工审核提示</li></ul></div>
          <div className="card p-6 mb-4 border-[#bfdbfe]"><h3 className="font-semibold text-sm">🌟 机构内测支持</h3><p className="text-lg font-bold my-2">联系申请</p><ul className="text-xs space-y-1.5 text-[#475569]"><li>✓ 适合协会、园区、培训机构、活动团队</li><li>✓ 系列活动材料包</li><li>✓ 分赛场/分享会/培训会场景</li><li>✓ 反馈共创与模板优化</li></ul><Link href="/contact" className="btn-secondary w-full mt-4 text-sm flex justify-center py-2">申请试用</Link></div>
          <div className="card p-6 border-[#ddd6fe]"><h3 className="font-semibold text-sm">🚀 深度共创</h3><p className="text-lg font-bold my-2">内测邀请</p><ul className="text-xs space-y-1.5 text-[#475569]"><li>✓ 批量活动材料验证</li><li>✓ 专属场景模板沉淀</li><li>✓ 活动组织流程共创</li><li>✓ 适合长期活动运营团队</li></ul><Link href="/contact" className="btn-secondary w-full mt-4 text-sm flex justify-center py-2">联系共创</Link></div>
          <button onClick={() => { logout(); router.push("/"); }} className="w-full mt-4 py-2.5 text-sm text-[#dc2626] hover:text-[#991b1b] hover:underline text-center">退出登录</button>
        </div>
      </div>
    </div>
  );
}
