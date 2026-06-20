"use client";
import { useState, useEffect } from "react";

const defaults: Record<string, string> = {
  // ========== 首页 ==========
  page_home_title: "办会助理",
  page_home_subtitle: "一站式活动材料 AI 助手",
  page_home_slogan: "写方案、主持词、新闻稿、总结，不再从零开始",
  page_home_security: "默认不保存原始资料。请勿上传涉密、内部、隐私及商业秘密内容。",
  page_home_tasks_title: "常用材料",
  page_home_view_all: "查看全部",
  page_home_quick_write: "我要快速写一个材料",
  page_home_run_activity: "我要办一场活动",
  page_home_entry1_desc: "12种高频材料，快速生成多版本",
  page_home_entry2_desc: "24个活动模板，整套材料包生成",
  page_home_tips: "默认不保存原始资料 \u00b7 即用即走 \u00b7 安全生成",

  // ========== 全局导航 ==========
  nav_brand: "办会助理",
  nav_tagline: "| 材料AI助手",
  nav_quick_write: "快速写材料",
  nav_run_activity: "办一场活动",
  nav_risk_check: "风险检查",
  nav_templates: "模板广场",
  nav_role: "角色工作台",
  nav_my: "我的材料",
  nav_account: "我的账户",
  nav_login: "登录/注册",
  nav_logout: "退出",
  nav_admin: "管理",

  // ========== 登录页 ==========
  page_login_title: "登录",
  page_login_subtitle: "欢迎回到办会助理",
  page_login_email: "邮箱",
  page_login_password: "密码",
  page_login_button: "登录",
  page_login_register_link: "还没有账号？注册",
  page_login_error_required: "请填写邮箱和密码",
  page_login_error_failed: "登录失败",

  // ========== 注册页 ==========
  page_register_title: "注册",
  page_register_subtitle: "创建您的办会助理账号",
  page_register_nickname: "昵称",
  page_register_email: "邮箱",
  page_register_password: "密码",
  page_register_confirm: "确认密码",
  page_register_button: "注册",
  page_register_login_link: "已有账号？登录",
  page_register_error_required: "请填写所有字段",
  page_register_error_mismatch: "两次密码不一致",
  page_register_success: "注册成功",

  // ========== 快速写材料 ==========
  page_quickwrite_title: "快速写一个材料",
  page_quickwrite_subtitle: "选择一个材料类型，填写信息，一键生成多版本",
  page_quickwrite_tip: "每个材料任务支持多版本生成，您可以在结果页面选择、对比、融合不同版本。",
  page_quickwrite_category1: "方案类",
  page_quickwrite_category2: "稿子类",
  page_quickwrite_category3: "宣传类",
  page_quickwrite_category4: "总结通知类",
  page_quickwrite_btn_generate: "生成",
  page_quickwrite_btn_save: "采用并保存",
  page_quickwrite_btn_risk: "风险检查",
  page_quickwrite_btn_export: "导出",
  page_quickwrite_version_official: "正式稳妥版",
  page_quickwrite_version_concise: "简洁实用版",
  page_quickwrite_version_promotion: "宣传传播版",
  page_quickwrite_version_highlight: "亮点提炼版",
  page_quickwrite_version_creative: "创意策划版",
  page_quickwrite_fusion: "版本融合",
  page_quickwrite_result_disclaimer: "以下内容为AI生成初稿，仅供修改参考。发布、报送或公开使用前，请进行人工审核。",
  page_quickwrite_input_prompt: "请勿输入涉密文件、内部批示、未公开会议纪要、领导个人敏感信息、企业商业秘密、居民个人信息、身份证号、手机号、住址、未经授权的图片/文章/音乐等内容。",
  page_quickwrite_generate_prompt: "本工具仅生成材料初稿。政策依据、数据、姓名、职务、金额、荣誉、项目成果等信息必须由用户自行核实。",
  page_quickwrite_export_prompt: "发布、报送或公开使用前，请进行人工审核。涉及政策、数据、职务、金额、荣誉、个人信息、商业信息等内容必须核实。",

  // ========== 办活动 ==========
  page_runactivity_title: "办一场活动",
  page_runactivity_subtitle: "选择一个活动模板，填写信息，一次性生成整套活动材料包",
  page_runactivity_step1: "活动信息",
  page_runactivity_step2: "选择材料",
  page_runactivity_step3: "生成结果",
  page_runactivity_btn_next: "下一步：选择材料",
  page_runactivity_btn_generate: "生成",
  page_runactivity_btn_back: "上一步",
  page_runactivity_all_templates: "全部模板",
  page_runactivity_materials_selected: "已选择",

  // ========== 模板广场 ==========
  page_templates_title: "模板广场",
  page_templates_subtitle: "浏览活动模板，快速生成整套材料包",

  // ========== 样例演示 ==========
  page_sampledemo_title: "样例演示",
  page_sampledemo_desc: "查看平台的生成效果，了解多版本卡片的展示方式",
  page_sampledemo_notice: "以下内容为演示样例，展示多版本生成效果。实际使用时，平台将根据您填写的信息生成定制化内容。",
  page_sampledemo_cta: "想亲自试一试？",
  page_sampledemo_cta_desc: "选择您需要的任务或活动模板，填写信息，一键生成多版本材料",

  // ========== 我的材料 ==========
  page_mymaterials_title: "我的材料",
  page_mymaterials_empty: "还没有保存的材料",
  page_mymaterials_empty_desc: "生成材料后，点击\"保存\"按钮即可收藏在这里",
  page_mymaterials_empty_cta1: "去写一个材料",
  page_mymaterials_empty_cta2: "去办一场活动",
  page_mymaterials_save_notice: "平台默认不自动保存您的原始输入和生成内容",
  page_mymaterials_title_count: "份",
  page_mymaterials_btn_delete: "删除",
  page_mymaterials_btn_export: "导出",
  page_mymaterials_btn_preview: "预览",
  page_mymaterials_clear_all: "一键清空全部",

  // ========== 账户 ==========
  page_account_title: "我的账户",
  page_account_not_login: "请先登录",
  page_account_go_login: "去登录",
  page_account_membership: "会员等级",
  page_account_points: "剩余点数",
  page_account_today: "今日已用",
  page_account_history: "使用记录",
  page_account_no_history: "暂无使用记录",
  page_account_plan_free: "免费版",
  page_account_plan_pro: "个人专业版",
  page_account_plan_expert: "材料达人版",
  page_account_logout: "退出登录",

  // ========== 角色工作台 ==========
  page_role_title: "角色工作台",
  page_role_subtitle: "选择您的角色，快速进入常用任务",

  // ========== 页脚 ==========
  footer_copyright: "\u00a9 2026 办会助理 版权所有",
  footer_tagline: "少加班，快交稿，材料不出错",
  footer_entries_title: "快速入口",
  footer_security_title: "安全提示",
  footer_security: "默认不保存原始资料。请勿上传涉密、内部批示、个人隐私及商业秘密内容。",
  footer_disclaimer: "本平台生成内容仅为AI初稿，发布前请进行人工审核。",

  // ========== 生成结果 ==========
  result_disclaimer: "以下内容为AI生成初稿，仅供修改参考。发布、报送或公开使用前，请进行人工审核。",
  result_risk_low: "低风险",
  result_risk_medium: "中风险",
  result_risk_high: "高风险",
  result_btn_preview: "预览",
  result_btn_adopt: "采用并保存",
  result_btn_risk: "风险检查",
  result_btn_export: "导出",
  result_saved: "已保存到\"我的材料\"！",
};

let globalCache: Record<string, string> | null = null;

export function useContent() {
  const [content, setContent] = useState<Record<string, string>>(defaults);
  useEffect(() => {
    if (globalCache) { setContent({ ...defaults, ...globalCache }); return; }
    fetch("/api/admin/content").then(r => r.json()).then(d => {
      if (d.ok && d.content) { globalCache = d.content; setContent({ ...defaults, ...d.content }); }
    }).catch(() => {});
  }, []);
  return (key: string, fallback?: string) => content[key] || fallback || defaults[key] || key;
}

