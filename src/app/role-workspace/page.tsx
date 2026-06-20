import Link from "next/link";
import { roleDefinitions } from "@/data/roles";

export default function RoleWorkspacePage() {
  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">👤 角色工作台</h1>
        <p className="text-sm text-[#64748b] mt-1">选择您的角色，快速进入常用任务</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleDefinitions.map(role => (
          <Link key={role.id} href={"/role-workspace/role?id=" + role.id} className="card p-5 group hover:border-[#3b82f6] hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{role.icon}</div>
              <div>
                <h3 className="font-semibold text-sm text-[#1e293b] group-hover:text-[#1a56db]">{role.name}</h3>
                <p className="text-xs text-[#64748b]">{role.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.tasks.slice(0, 4).map(t => <span key={t.name} className="tag tag-gray text-[0.6rem]">{t.name}</span>)}
              {role.tasks.length > 4 && <span className="tag tag-gray text-[0.6rem]">+{role.tasks.length - 4}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

