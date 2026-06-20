"use client";
import { adminFetch } from "@/lib/admin-api";
import { useState, useEffect } from "react";
import Link from "next/link";

const sections = [
  { id: "home", label: "首页" },
  { id: "nav", label: "导航" },
  { id: "auth", label: "登录/注册" },
  { id: "quickwrite", label: "快速写材料" },
  { id: "runactivity", label: "办活动" },
  { id: "other", label: "其他页面" },
  { id: "footer", label: "页脚" },
];

const fieldGroups: Record<string, { key: string; label: string; desc: string }[]> = {
  home: [
    { key: "page_home_title", label: "首页标题", desc: "显示在浏览器标签和首页顶部" },
    { key: "page_home_subtitle", label: "首页副标题", desc: "首页Hero区域副标题文字" },
    { key: "page_home_slogan", label: "首页口号", desc: "首页Hero区域口号" },
    { key: "page_home_security", label: "安全提示", desc: "首页安全提示条" },
    { key: "page_home_tasks_title", label: "常用材料标题", desc: "首页常用材料区域标题" },
    { key: "page_home_view_all", label: "查看全部链接", desc: "首页常用材料区域的链接文字" },
    { key: "page_home_quick_write", label: "主入口1标题", desc: "快速写材料入口卡片标题" },
    { key: "page_home_run_activity", label: "主入口2标题", desc: "办活动入口卡片标题" },
    { key: "page_home_entry1_desc", label: "入口1描述", desc: "快速写材料入口描述" },
    { key: "page_home_entry2_desc", label: "入口2描述", desc: "办活动入口描述" },
  ],
  nav: [
    { key: "nav_brand", label: "导航品牌名", desc: "顶部导航栏品牌名称" },
    { key: "nav_tagline", label: "导航标语", desc: "导航栏品牌旁边的标语" },
    { key: "nav_quick_write", label: "导航-快速写材料", desc: "顶部导航项目" },
    { key: "nav_run_activity", label: "导航-办一场活动", desc: "顶部导航项目" },
    { key: "nav_templates", label: "导航-模板广场", desc: "顶部导航项目" },
    { key: "nav_my", label: "导航-我的材料", desc: "顶部导航项目" },
    { key: "nav_account", label: "导航-我的账户", desc: "顶部导航项目" },
  ],
  auth: [
    { key: "page_login_title", label: "登录页标题", desc: "登录页面标题" },
    { key: "page_login_subtitle", label: "登录页副标题", desc: "登录页面副标题" },
    { key: "page_login_button", label: "登录按钮", desc: "登录按钮文字" },
    { key: "page_login_register_link", label: "注册链接", desc: "登录页的注册链接文字" },
    { key: "page_register_title", label: "注册页标题", desc: "注册页面标题" },
    { key: "page_register_subtitle", label: "注册页副标题", desc: "注册页面副标题" },
    { key: "page_register_button", label: "注册按钮", desc: "注册按钮文字" },
  ],
  quickwrite: [
    { key: "page_quickwrite_title", label: "页面标题", desc: "快速写材料页标题" },
    { key: "page_quickwrite_subtitle", label: "页面副标题", desc: "快速写材料页描述" },
    { key: "page_quickwrite_input_prompt", label: "输入提示", desc: "表单下方的安全提示文本" },
    { key: "page_quickwrite_generate_prompt", label: "生成前提示", desc: "生成按钮前的提示" },
    { key: "page_quickwrite_result_disclaimer", label: "结果声明", desc: "生成结果页的免责声明" },
    { key: "page_quickwrite_export_prompt", label: "导出提示", desc: "导出前的提示文本" },
    { key: "page_quickwrite_tip", label: "功能提示", desc: "底部功能提示栏" },
  ],
  runactivity: [
    { key: "page_runactivity_title", label: "页面标题", desc: "办活动页标题" },
    { key: "page_runactivity_subtitle", label: "页面副标题", desc: "办活动页描述" },
    { key: "page_runactivity_step1", label: "步骤1标签", desc: "步骤指示器的第一步" },
    { key: "page_runactivity_step2", label: "步骤2标签", desc: "步骤指示器的第二步" },
    { key: "page_runactivity_step3", label: "步骤3标签", desc: "步骤指示器的第三步" },
  ],
  other: [
    { key: "page_templates_title", label: "模板广场标题", desc: "模板广场页标题" },
    { key: "page_mymaterials_title", label: "我的材料标题", desc: "我的材料页标题" },
    { key: "page_mymaterials_empty", label: "空状态标题", desc: "暂无材料时显示的标题" },
    { key: "page_sampledemo_title", label: "样例演示标题", desc: "样例演示页标题" },
    { key: "page_account_title", label: "账户页标题", desc: "我的账户页标题" },
    { key: "page_role_title", label: "角色工作台标题", desc: "角色工作台页标题" },
  ],
  footer: [
    { key: "footer_copyright", label: "版权信息", desc: "页脚版权文字" },
    { key: "footer_tagline", label: "品牌标语", desc: "页脚品牌标语" },
    { key: "footer_disclaimer", label: "免责声明", desc: "页脚AI初稿提示" },
    { key: "footer_security", label: "安全提示", desc: "页脚安全提示文字" },
    { key: "footer_entries_title", label: "快速入口标题", desc: "页脚快速入口区域标题" },
  ],
};

export default function AdminContent() {
  const [items, setItems] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState("home");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/content").then(r => r.json()).then(d => {
      if (d.ok) setItems(d.content || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const saveItem = async (key: string) => {
    const val = items[key] ?? "";
    const r = await adminFetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value: val }) });
    const d = await r.json();
    setMsg(key + " 已保存"); setTimeout(() => setMsg(""), 2000);
  };

  // Get the default value from useContent defaults (hardcoded here)
  const getDefault = (key: string) => "默认值";

  const fields = fieldGroups[activeSection] || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1e293b]">内容管理</h1>
          <p className="text-xs text-[#64748b] mt-0.5">管理全站文本内容，修改后前台自动更新</p>
        </div>
      </div>

      {msg && <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-sm text-[#166534]">{msg}</div>}

      {/* Section Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 slim-scrollbar">
        {sections.map(sec => (
          <button key={sec.id} onClick={() => setActiveSection(sec.id)} className={"shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-colors " + (activeSection === sec.id ? "bg-[#1a56db] text-white" : "bg-white border border-[#e2e8f0] text-[#475569] hover:bg-[#f1f5f9]")}>
            {sec.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-8 text-center text-xs text-[#94a3b8]">加载中...</div>
      ) : (
        <div className="space-y-3">
          {fields.map(fd => {
            const val = items[fd.key];
            return (
              <div key={fd.key} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <label className="font-semibold text-sm">{fd.label}</label>
                    <p className="text-[0.6rem] text-[#64748b]">{fd.desc}</p>
                  </div>
                  <span className="text-[0.5rem] text-[#94a3b8] font-mono">{fd.key}</span>
                </div>
                <textarea className="form-input min-h-[60px] resize-y text-sm mt-2" value={items[fd.key] ?? ""} onChange={e => setItems({...items, [fd.key]: e.target.value})} />
                <div className="flex justify-end mt-2">
                  <button onClick={() => saveItem(fd.key)} className="btn-primary text-xs py-1.5 px-3">保存</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Link href="/admin" className="inline-block mt-4 text-xs text-[#1a56db] hover:underline">← 返回概览</Link>
    </div>
  );
}
