"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => { adminFetch("/api/admin/users").then(r => r.json()).then(d => d.ok && setUsers(d.users)).catch(() => {}); }, []);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6">👥 用户管理</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-[#e2e8f0] text-[#64748b]">
            <th className="text-left py-3 px-4 font-medium">昵称</th><th className="text-left py-3 px-4 font-medium">邮箱</th>
            <th className="text-left py-3 px-4 font-medium">会员等级</th><th className="text-left py-3 px-4 font-medium">剩余点数</th>
            <th className="text-left py-3 px-4 font-medium">注册时间</th>
          </tr></thead>
          <tbody>{users.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-[#94a3b8]">暂无用户数据</td></tr> :
            users.map((u: any) => (
              <tr key={u.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                <td className="py-3 px-4">{u.nickname}</td><td className="py-3 px-4 text-[#64748b]">{u.email}</td>
                <td className="py-3 px-4"><span className={"tag " + (u.membership === "free" ? "tag-gray" : "tag-green")}>{u.membership}</span></td>
                <td className="py-3 px-4">{u.points}</td><td className="py-3 px-4 text-[#94a3b8]">{new Date(u.created_at).toLocaleDateString("zh-CN")}</td>
              </tr>
            ))
          }</tbody>
        </table>
      </div>
      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}

