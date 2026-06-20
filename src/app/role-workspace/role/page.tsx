"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { roleDefinitions } from "@/data/roles";

export default function RoleDetailWrapper() {
  return <Suspense fallback={<div className="container-app py-12 text-center text-[#64748b]">加载中...</div>}>
    <RoleDetail />
  </Suspense>;
}

function RoleDetail() {

  const searchParams = useSearchParams();
  const roleId = searchParams.get("id") || "";
  const role = roleDefinitions.find(r => r.id === roleId);
  if (!role) {
    return <div className="container-app py-12 text-center text-[#64748b]">未找到该角色 <Link href="/role-workspace" className="text-[#1a56db] ml-2">返回选择</Link></div>;
  }
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-4"><Link href="/role-workspace" className="text-sm text-[#64748b] hover:text-[#1a56db]">&larr; 返回角色列表</Link></div>
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl">{role.icon}</div>
          <div><h1 className="text-xl font-bold">{role.name}</h1><p className="text-sm text-[#64748b]">{role.description}</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {role.tasks.map(task => (
            <Link key={task.name} href={"/quick-write"} className="card p-4 hover:border-[#3b82f6] transition-all group">
              <div className="font-semibold text-sm text-[#1e293b] group-hover:text-[#1a56db]">{task.name}</div>
              <div className="text-xs text-[#64748b] mt-1">{task.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

