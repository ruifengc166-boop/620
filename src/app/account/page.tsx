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
    if (isAuthenticated && user?.email) {
      fetch("/api/account/usage?email=" + user.email).then(r => r.json()).then(d => { if (d.ok) setUsage(d); }).catch(() => {});
    }
  }, [isAuthenticated, user?.email]);

  if (!isAuthenticated) {
    return (
      <div className="container-app py-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-xl font-bold text-[#1e293b] mb-2">请先登录</h1>
          <p className="text-sm text-[#64748b] mb-6">登录后可管理账户和查看会员权益</p>
          <Link href="/login" className="btn-primary inline-flex px-8 py-2.5">去登录</Link>
        </div>
      </div>
    );
  }

  const planLabel = user?.membership_level === "admin" ? "管理员" : user?.membership_level === "pro" ? "专业版" : user?.membership_level === "expert" ? "达人版" : "免费版";

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">💎 我的账户</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-xl font-bold">{(user?.nickname?.[0]) || "U"}</div>
              <div>
                <h2 className="font-semibold text-lg">{user?.nickname}</h2>
                <p className="text-sm text-[#64748b]">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#e2e8f0]">
              <div><div className="text-xs text-[#64748b]">会员等级</div><div className={"text-sm font-medium mt-0.5 " + (usage ? "text-[#059669]" : "text-[#94a3b8]")}>{planLabel}</div></div>
              <div><div className="text-xs text-[#64748b]">剩余点数</div><div className="text-sm font-medium mt-0.5">{user?.points_balance ?? "--"} 点</div></div>
              <div><div className="text-xs text-[#64748b]">今日已用</div><div className="text-sm font-medium mt-0.5">{usage ? usage.today + "/" + usage.daily_limit : "--"} 次</div></div>
              <div><div className="text-xs text-[#64748b]">剩余次数</div><div className={"text-sm font-medium mt-0.5 " + (usage && usage.remaining < 5 ? "text-[#dc2626]" : "")}>{usage ? usage.remaining : "--"} 次</div></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold mb-4">使用记录</h2>
            <div className="text-center py-6 text-[#94a3b8] text-sm">
              <p>暂无使用记录</p>
              <p className="text-xs mt-1">开始生成材料后，这里会显示历史记录</p>
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6 mb-4 border-[#bbf7d0] bg-[#f0fdf4]">
            <h3 className="font-semibold text-sm text-[#166534]">🆓 免费版 {(!user || user.membership_level === "free") ? "(当前)" : ""}</h3>
            <p className="text-2xl font-bold text-[#166534] my-2">免费</p>
            <ul className="text-xs space-y-1.5 text-[#166534]">
              <li>✓ 每日{usage ? usage.daily_limit : 10}次生成</li>
              <li>✓ 基础任务</li>
              <li>✓ 单版本生成</li>
              <li>✓ 基础风险提醒</li>
              <li>✓ 复制文本</li>
            </ul>
          </div>

          <div className="card p-6 mb-4 border-[#bfdbfe]">
            <h3 className="font-semibold text-sm">🌟 个人专业版 {user?.membership_level === "pro" ? "(当前)" : ""}</h3>
            <p className="text-2xl font-bold my-2">69 <span className="text-sm font-normal text-[#64748b]">元/月</span></p>
            <ul className="text-xs space-y-1.5 text-[#475569]">
              <li>✓ 每日50次生成</li><li>多版本(限20次/日)</li>
              <li>✓ Word/PDF导出</li>
              <li>✓ 常用活动模板</li>
              <li>✓ 多版本生成</li>
              <li>✓ 风险检查</li>
            </ul>
            <button className="btn-primary w-full mt-4 text-sm" disabled>即将上线</button>
          </div>

          <div className="card p-6 border-[#ddd6fe]">
            <h3 className="font-semibold text-sm">🚀 材料达人版 {user?.membership_level === "expert" ? "(当前)" : ""}</h3>
            <p className="text-2xl font-bold my-2">299 <span className="text-sm font-normal text-[#64748b]">元/月</span></p>
            <ul className="text-xs space-y-1.5 text-[#475569]">
              <li>✓ 每日200次生成</li><li>多版本(限50次/日)</li>
              <li>✓ 多模型比选</li>
              <li>✓ 完整材料包</li>
              <li>✓ 版本融合</li>
              <li>✓ 高级风控报告</li>
            </ul>
            <button className="btn-primary w-full mt-4 text-sm" disabled>即将上线</button>
          </div>

          <button onClick={() => { logout(); router.push("/"); }} className="w-full mt-4 py-2.5 text-sm text-[#dc2626] hover:text-[#991b1b] hover:underline text-center">退出登录</button>
        </div>
      </div>
    </div>
  );
}

