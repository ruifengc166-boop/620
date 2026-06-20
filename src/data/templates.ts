export interface ActivityTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  materialCount: number;
  materials: string[];
  priority: "P0" | "P1" | "P2";
  demo?: string;
}

export const activityTemplates: ActivityTemplate[] = [
  { id: "policy_promotion", name: "政策宣讲会", category: "党政机关活动", description: "面向群众或企业进行政策解读宣讲", materialCount: 10, materials: ["活动方案", "会议通知", "主持词", "领导致辞初稿", "政策解读稿", "企业/群众问答手册", "新闻稿", "公众号推文", "短视频口播脚本", "活动总结"], priority: "P0" },
  { id: "work_promotion", name: "工作推进会", category: "党政机关活动", description: "推动重点工作落实的会议活动", materialCount: 10, materials: ["会议方案", "会议议程", "主持词", "领导讲话初稿", "部门汇报提纲", "任务分解表", "会议纪要", "新闻稿", "督办清单", "工作简报"], priority: "P0" },
  { id: "research_symposium", name: "调研座谈会", category: "党政机关活动", description: "深入一线调研并座谈交流", materialCount: 10, materials: ["调研方案", "座谈提纲", "主持词", "领导讲话初稿", "问题清单", "发言提纲", "调研报告初稿", "新闻稿", "会议纪要", "后续跟进表"], priority: "P0" },
  { id: "training_session", name: "专题培训会", category: "党政机关活动", description: "针对特定主题开展培训", materialCount: 10, materials: ["培训方案", "培训通知", "主持词", "领导开班讲话", "课程安排表", "培训课件大纲", "学员手册", "新闻稿", "培训总结", "工作简报"], priority: "P2" },
  { id: "party_building", name: "党建/主题党日活动", category: "党政机关活动", description: "党建主题学习和实践活动", materialCount: 10, materials: ["活动方案", "学习议程", "主持词", "书记讲话初稿", "学习材料汇编", "会议记录", "新闻稿", "学习心得体会模板", "台账说明", "活动总结"], priority: "P0" },
  { id: "community_practice", name: "社区文明实践活动", category: "社区活动", description: "社区开展新时代文明实践主题活动", materialCount: 10, materials: ["活动方案", "志愿者招募文案", "居民通知", "主持词", "新闻稿", "公众号推文", "照片说明", "台账材料", "活动总结", "工作简报"], priority: "P0" },
  { id: "fraud_prevention", name: "防诈骗/安全宣传活动", category: "社区活动", description: "面向居民开展防诈骗、安全生产等宣传", materialCount: 10, materials: ["活动方案", "居民通知", "主持词", "宣传单页文案", "案例汇编", "新闻稿", "公众号推文", "照片说明", "活动总结", "台账材料"], priority: "P1" },
  { id: "resident_forum", name: "居民议事会", category: "社区活动", description: "组织居民议事、收集民意", materialCount: 10, materials: ["会议方案", "居民通知", "议题清单", "主持词", "会议记录", "问题台账", "新闻稿", "解决方案", "活动总结", "工作简报"], priority: "P2" },
  { id: "volunteer_service", name: "志愿服务活动", category: "社区活动", description: "组织志愿者开展社区服务活动", materialCount: 10, materials: ["活动方案", "志愿者招募令", "活动通知", "主持词", "志愿者分工表", "新闻稿", "公众号推文", "活动总结", "照片说明", "服务时长记录"], priority: "P2" },
  { id: "waste_sorting", name: "垃圾分类宣传活动", category: "社区活动", description: "向居民宣传垃圾分类知识和政策", materialCount: 10, materials: ["活动方案", "居民通知", "宣传单页文案", "分类知识手册", "主持词", "新闻稿", "公众号推文", "照片说明", "活动总结", "台账材料"], priority: "P1" },
  { id: "investment_promotion", name: "招商推介会", category: "招商产业活动", description: "面向企业开展招商引资推介", materialCount: 10, materials: ["招商活动方案", "企业邀请函", "领导致辞初稿", "招商推介稿", "园区介绍稿", "投资指南", "主持词", "媒体通稿", "会后跟进表", "项目洽谈纪要"], priority: "P0" },
  { id: "enterprise_service", name: "企业服务日", category: "招商产业活动", description: "为企业提供政策宣讲、诉求收集等服务", materialCount: 10, materials: ["活动方案", "企业邀请函", "主持词", "领导致辞初稿", "政策汇编手册", "企业诉求收集表", "新闻稿", "公众号推文", "活动总结", "跟进落实表"], priority: "P1" },
  { id: "project_signing", name: "项目签约仪式", category: "招商产业活动", description: "重大项目集中签约仪式", materialCount: 10, materials: ["签约方案", "签约流程表", "主持词", "领导致辞初稿", "签约项目简介", "媒体通稿", "新闻稿", "现场物料文案", "风险提醒清单", "活动总结"], priority: "P0" },
  { id: "industry_salon", name: "产业沙龙/闭门会", category: "招商产业活动", description: "产业主题交流沙龙", materialCount: 10, materials: ["活动方案", "企业邀请函", "主持词", "嘉宾发言稿", "讨论提纲", "会议纪要", "新闻稿", "活动总结", "参会企业名录", "后续跟进计划"], priority: "P1" },
  { id: "cultural_tourism", name: "文旅推介会", category: "文旅品牌活动", description: "推介本地文旅资源和特色项目", materialCount: 10, materials: ["推介方案", "嘉宾邀请函", "主持词", "领导致辞初稿", "文旅推介稿", "宣传视频脚本", "媒体通稿", "新闻稿", "公众号推文", "活动总结"], priority: "P1" },
  { id: "exhibition_opening", name: "展览/展会开幕式", category: "文旅品牌活动", description: "展览或展会的开幕仪式", materialCount: 10, materials: ["开幕方案", "嘉宾邀请函", "流程表", "主持词", "领导致辞初稿", "展览介绍稿", "新闻稿", "媒体通稿", "现场文案", "活动总结"], priority: "P1" },
  { id: "cultural_festival", name: "文化节/艺术节", category: "文旅品牌活动", description: "举办大型文化节庆活动", materialCount: 10, materials: ["活动方案", "活动通知", "节目单", "主持词", "领导致辞初稿", "新闻稿", "公众号推文", "宣传海报文案", "活动总结", "照片说明"], priority: "P2" },
  { id: "civilization_creation", name: "文明创建工作会", category: "文旅品牌活动", description: "推进城市/社区文明创建工作", materialCount: 10, materials: ["工作方案", "居民倡议书", "创建标准清单", "主持词", "新闻稿", "公众号推文", "自查整改台账", "活动总结", "照片说明", "工作简报"], priority: "P2" },
  { id: "business_optimization", name: "优化营商环境推进会", category: "招商产业活动", description: "推进营商环境优化工作", materialCount: 10, materials: ["会议方案", "企业邀请函", "主持词", "领导讲话初稿", "惠企政策汇编", "企业诉求清单", "任务分解表", "新闻稿", "会议纪要", "工作简报"], priority: "P2" },
  { id: "press_conference", name: "新闻发布会", category: "新闻传播活动", description: "面向媒体发布重要信息", materialCount: 10, materials: ["发布方案", "媒体邀请函", "主持词", "发布词", "媒体问答指引", "新闻通稿", "新闻稿", "背景材料", "媒体签到表", "会后跟进"], priority: "P1" },
  { id: "achievement_report", name: "成果汇报会", category: "新闻传播活动", description: "向上级或公众汇报工作成果", materialCount: 10, materials: ["汇报方案", "会议议程", "主持词", "领导讲话初稿", "成果汇报材料", "数据图表汇编", "新闻稿", "成果清单", "活动总结", "媒体通稿"], priority: "P2" },
  { id: "annual_meeting", name: "年度总结/表彰大会", category: "新闻传播活动", description: "年度工作总结和表彰先进", materialCount: 10, materials: ["大会方案", "会议议程", "主持词", "领导讲话初稿", "工作报告", "表彰决定", "代表发言稿", "新闻稿", "工作简报", "活动总结"], priority: "P1" },
  { id: "public_welfare", name: "民生实事项目推进会", category: "新闻传播活动", description: "推进民生实事项目落实", materialCount: 10, materials: ["会议方案", "项目清单", "主持词", "领导讲话初稿", "进度汇报表", "问题协调纪要", "新闻稿", "督办清单", "会议纪要", "工作简报"], priority: "P2" },
];

export const templateCategories = ["党政机关活动","社区活动","招商产业活动","文旅品牌活动","新闻传播活动"];
export const templateCategoryIcons: Record<string, string> = {
  "党政机关活动": "🏛️",
  "社区活动": "🏘️",
  "招商产业活动": "💼",
  "文旅品牌活动": "🎭",
  "新闻传播活动": "📡",
};
