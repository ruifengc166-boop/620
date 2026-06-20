export type MaterialType =
  | "activity_plan"
  | "host_script"
  | "leadership_speech"
  | "news_release"
  | "official_account"
  | "activity_notice"
  | "invitation"
  | "process_table"
  | "task_assignment"
  | "short_video_script"
  | "activity_summary"
  | "work_briefing";

export type ActivityType =
  | "policy_promotion"
  | "work_promotion"
  | "research_symposium"
  | "training_session"
  | "community_practice"
  | "fraud_prevention"
  | "resident_forum"
  | "volunteer_service"
  | "investment_promotion"
  | "enterprise_service"
  | "project_signing"
  | "industry_salon"
  | "cultural_tourism"
  | "cultural_festival"
  | "exhibition_opening"
  | "city_brand"
  | "innovation_competition"
  | "ai_contest"
  | "creative_camp"
  | "work_collection"
  | "press_conference"
  | "achievement_report"
  | "brand_launch"
  | "annual_meeting";

export type GenerationMode = "official" | "planning" | "long_text" | "promotion" | "multi_compare" | "risk_review";
export type CardStyle = "official" | "concise" | "promotion" | "highlight" | "creative";

export interface TaskDefinition {
  id: MaterialType;
  name: string;
  description: string;
  icon: string;
  commonFields: string[];
  specificFields: FormField[];
  outputDescription: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "number";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  hint?: string;
}

export const taskDefinitions: TaskDefinition[] = [
  {
    id: "activity_plan",
    name: "活动方案",
    description: "生成完整的活动方案，包括背景、目的、主题、流程、分工等",
    icon: "📋",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background", "activity_purpose", "activity_process", "leadership_guests", "key_content"],
    specificFields: [
      { name: "activity_goal", label: "活动目标", type: "textarea", placeholder: "请描述本次活动的主要目标", hint: "如：提升居民反诈意识" },
      { name: "activity_scale", label: "活动规模", type: "text", placeholder: "如：200人", required: true },
      { name: "process_detail", label: "流程安排", type: "textarea", placeholder: "详细活动流程" },
      { name: "org_structure", label: "组织架构", type: "text", placeholder: "主办、协办、承办单位" },
      { name: "promotion_arrangement", label: "宣传安排", type: "textarea", placeholder: "宣传渠道和方式" },
      { name: "budget_range", label: "预算范围", type: "text", placeholder: "如：2-3万元" },
      { name: "risk_plan", label: "风险预案需求", type: "textarea", placeholder: "需要预案的环节和风险" },
    ],
    outputDescription: "完整方案：背景、目的、主题、时间地点、组织单位、对象、流程、职责分工、宣传安排、物料准备、风险预案、后续安排"
  },
  {
    id: "host_script",
    name: "主持词",
    description: "生成活动主持词，含开场白、串词、结束语",
    icon: "🎤",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background", "activity_process", "leadership_guests"],
    specificFields: [
      { name: "host_identity", label: "主持人身份", type: "text", placeholder: "如：街道党工委副书记", required: true },
      { name: "meeting_process", label: "会议流程", type: "textarea", placeholder: "请描述会议的各个环节" },
      { name: "guest_list", label: "领导嘉宾名单", type: "textarea", placeholder: "拟出席的领导嘉宾姓名和职务" },
      { name: "has_special_ceremony", label: "是否有启动/签约/颁奖环节", type: "select", options: [{ label: "是", value: "yes" }, { label: "否", value: "no" }] },
      { name: "tone", label: "语气风格", type: "select", options: [{ label: "正式", value: "formal" }, { label: "亲切", value: "friendly" }, { label: "简洁", value: "concise" }, { label: "热烈", value: "warm" }], required: true },
    ],
    outputDescription: "开场白、介绍领导嘉宾、各环节串词、结束语"
  },
  {
    id: "leadership_speech",
    name: "领导致辞初稿",
    description: "发言材料结构整理助手 —— 生成领导发言初稿",
    icon: "🎯",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_background", "activity_purpose", "key_content"],
    specificFields: [
      { name: "speaker_identity", label: "发言领导身份", type: "text", placeholder: "如：街道党工委书记", required: true },
      { name: "work_achievements", label: "工作成果", type: "textarea", placeholder: "需要提及的工作成果" },
      { name: "focus_points", label: "希望表达的重点", type: "textarea", placeholder: "领导希望强调的内容" },
      { name: "speech_duration", label: "发言时长", type: "select", options: [{ label: "3分钟", value: "3min" }, { label: "5分钟", value: "5min" }, { label: "10分钟", value: "10min" }, { label: "15分钟", value: "15min" }] },
      { name: "speech_tone", label: "语气", type: "select", options: [{ label: "稳重", value: "steady" }, { label: "鼓舞", value: "inspiring" }, { label: "务实", value: "practical" }, { label: "亲切", value: "friendly" }] },
    ],
    outputDescription: "讲话材料初稿，标注待核实信息"
  },
  {
    id: "news_release",
    name: "新闻稿",
    description: "生成正式新闻稿，包括标题、导语、正文、结尾",
    icon: "📰",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background", "activity_process", "key_content"],
    specificFields: [
      { name: "news_angle", label: "新闻角度", type: "select", options: [{ label: "活动成果", value: "achievement" }, { label: "领导重视", value: "leadership" }, { label: "群众获得感", value: "public" }, { label: "创新做法", value: "innovation" }] },
      { name: "activity_highlights", label: "活动亮点", type: "textarea", placeholder: "活动的特色亮点" },
      { name: "attendance_count", label: "参与人数", type: "number", placeholder: "如：200" },
      { name: "result_data", label: "成果数据", type: "textarea", placeholder: "活动成果和数据" },
      { name: "public_release", label: "是否公开发布", type: "select", options: [{ label: "公开发布", value: "yes" }, { label: "内部参考", value: "no" }] },
    ],
    outputDescription: "正式新闻稿：标题、导语、正文、结尾"
  },
  {
    id: "official_account",
    name: "公众号推文",
    description: "生成公众号推文，含标题、摘要、正文、转发语",
    icon: "💬",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background", "key_content"],
    specificFields: [
      { name: "audience", label: "读者对象", type: "select", options: [{ label: "居民群众", value: "residents" }, { label: "企业代表", value: "enterprise" }, { label: "系统内部", value: "internal" }, { label: "社会公众", value: "public" }] },
      { name: "communication_style", label: "传播风格", type: "select", options: [{ label: "正式温馨", value: "formal_warm" }, { label: "活泼亲切", value: "lively" }, { label: "简洁明了", value: "concise" }, { label: "有感染力", value: "engaging" }] },
      { name: "need_title_options", label: "是否需要标题组", type: "select", options: [{ label: "需要多个标题选择", value: "yes" }, { label: "一个标题即可", value: "no" }] },
      { name: "need_subheadings", label: "是否需要分段小标题", type: "select", options: [{ label: "是", value: "yes" }, { label: "否", value: "no" }] },
    ],
    outputDescription: "公众号标题、摘要、正文、结尾转发语"
  },
  {
    id: "activity_notice",
    name: "活动通知",
    description: "生成正式通知版和微信群简版",
    icon: "📢",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background"],
    specificFields: [
      { name: "notice_recipients", label: "通知对象", type: "text", placeholder: "如：各社区居民", required: true },
      { name: "attendance_requirements", label: "参会要求", type: "textarea", placeholder: "着装要求、携带材料等" },
      { name: "registration_method", label: "报名方式", type: "text", placeholder: "如：扫描二维码报名" },
      { name: "contact_person", label: "联系人", type: "text", placeholder: "姓名+电话" },
      { name: "notes", label: "注意事项", type: "textarea", placeholder: "其他需要说明的事项" },
    ],
    outputDescription: "正式通知版、微信群简版"
  },
  {
    id: "invitation",
    name: "邀请函",
    description: "生成正式邀请函和短信/微信邀请文案",
    icon: "✉️",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "activity_background", "activity_purpose"],
    specificFields: [
      { name: "invitee", label: "邀请对象", type: "text", placeholder: "如：辖区重点企业负责人", required: true },
      { name: "invitee_identity", label: "邀请身份", type: "text", placeholder: "如：XX公司总经理" },
      { name: "activity_value", label: "活动价值", type: "textarea", placeholder: "对受邀对象的价值和吸引力" },
      { name: "formal_tone", label: "语气", type: "select", options: [{ label: "正式公函", value: "formal" }, { label: "友好邀请", value: "friendly" }] },
    ],
    outputDescription: "正式邀请函、短信/微信邀请文案"
  },
  {
    id: "process_table",
    name: "活动流程表",
    description: "生成结构化流程表格",
    icon: "📊",
    commonFields: ["activity_name", "activity_type", "activity_time", "activity_location", "activity_process"],
    specificFields: [
      { name: "start_time", label: "活动开始时间", type: "text", placeholder: "如：09:00", required: true },
      { name: "end_time", label: "活动结束时间", type: "text", placeholder: "如：12:00", required: true },
      { name: "main_sessions", label: "主要环节(每行一个)", type: "textarea", placeholder: "开幕致辞\n政策宣讲\n交流互动\n总结发言", required: true },
      { name: "duration_per_session", label: "每个环节预计时长", type: "text", placeholder: "如：开幕10分钟，致辞15分钟" },
      { name: "need_manager", label: "是否需要负责人列", type: "select", options: [{ label: "是", value: "yes" }, { label: "否", value: "no" }] },
    ],
    outputDescription: "表格：时间、环节、内容、负责人、备注"
  },
  {
    id: "task_assignment",
    name: "任务分工表",
    description: "生成活动任务分工表格",
    icon: "👥",
    commonFields: ["activity_name", "activity_type", "activity_background"],
    specificFields: [
      { name: "work_groups", label: "工作组类型(每行一个)", type: "textarea", placeholder: "会务组\n宣传组\n后勤组", required: true },
      { name: "staff_count", label: "人员数量", type: "text", placeholder: "如：每组3-5人" },
      { name: "key_tasks", label: "关键任务", type: "textarea", placeholder: "需要完成的关键任务" },
      { name: "deadline", label: "截止时间", type: "text", placeholder: "活动前完成节点" },
    ],
    outputDescription: "表格：工作组、任务内容、负责人、完成时间、备注"
  },
  {
    id: "short_video_script",
    name: "短视频口播脚本",
    description: "生成标题、口播稿、分镜建议",
    icon: "🎬",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_background", "activity_purpose", "key_content"],
    specificFields: [
      { name: "platform", label: "平台", type: "select", options: [{ label: "视频号", value: "video_account" }, { label: "抖音", value: "douyin" }, { label: "小红书", value: "xiaohongshu" }, { label: "内部宣传", value: "internal" }], required: true },
      { name: "duration", label: "时长", type: "select", options: [{ label: "30秒", value: "30s" }, { label: "60秒", value: "60s" }, { label: "90秒", value: "90s" }], required: true },
      { name: "style", label: "风格", type: "select", options: [{ label: "正式", value: "formal" }, { label: "轻松", value: "casual" }, { label: "政策解读", value: "policy" }, { label: "纪实", value: "documentary" }] },
      { name: "need_storyboard", label: "是否需要分镜", type: "select", options: [{ label: "是", value: "yes" }, { label: "否", value: "no" }] },
    ],
    outputDescription: "标题、口播稿、分镜建议、字幕重点、封面文案"
  },
  {
    id: "activity_summary",
    name: "活动总结",
    description: "生成工作总结版、简报版、台账版",
    icon: "📝",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background", "activity_purpose", "activity_process", "key_content"],
    specificFields: [
      { name: "actual_process", label: "活动实际过程", type: "textarea", placeholder: "实际开展情况" },
      { name: "attendance_count", label: "参与人数", type: "number", placeholder: "实际参与人数" },
      { name: "main_achievements", label: "主要成果", type: "textarea", placeholder: "活动的实际成果" },
      { name: "highlight_practices", label: "亮点做法", type: "textarea", placeholder: "特色亮点做法" },
      { name: "follow_up_plan", label: "后续计划", type: "textarea", placeholder: "下一步计划" },
    ],
    outputDescription: "工作总结版、简报版、台账版"
  },
  {
    id: "work_briefing",
    name: "工作简报",
    description: "生成简报标题、正文、亮点提炼",
    icon: "📄",
    commonFields: ["activity_name", "activity_type", "host_unit", "activity_time", "activity_location", "participants", "activity_background", "activity_purpose", "key_content"],
    specificFields: [
      { name: "briefing_audience", label: "简报对象", type: "text", placeholder: "如：上级部门、街道领导班子", required: true },
      { name: "work_background", label: "工作背景", type: "textarea", placeholder: "工作开展的背景" },
      { name: "key_practices", label: "重点做法", type: "textarea", placeholder: "重点做法和措施" },
      { name: "effectiveness_data", label: "成效数据", type: "textarea", placeholder: "具体数据和成效" },
      { name: "next_steps", label: "下一步计划", type: "textarea", placeholder: "下一步工作安排" },
    ],
    outputDescription: "简报标题、正文、亮点提炼、下一步安排"
  },
];

export const activityTypeOptions: { label: string; value: string; category: string }[] = [
  { label: "政策宣讲会", value: "policy_promotion", category: "党政机关活动" },
  { label: "工作推进会", value: "work_promotion", category: "党政机关活动" },
  { label: "调研座谈会", value: "research_symposium", category: "党政机关活动" },
  { label: "专题培训会", value: "training_session", category: "党政机关活动" },
  { label: "社区文明实践活动", value: "community_practice", category: "社区活动" },
  { label: "防诈骗/安全宣传活动", value: "fraud_prevention", category: "社区活动" },
  { label: "居民议事会", value: "resident_forum", category: "社区活动" },
  { label: "志愿服务活动", value: "volunteer_service", category: "社区活动" },
  { label: "招商推介会", value: "investment_promotion", category: "招商产业活动" },
  { label: "企业服务日", value: "enterprise_service", category: "招商产业活动" },
  { label: "项目签约仪式", value: "project_signing", category: "招商产业活动" },
  { label: "产业沙龙/闭门会", value: "industry_salon", category: "招商产业活动" },
  { label: "文旅推介会", value: "cultural_tourism", category: "文旅品牌活动" },
  { label: "城市IP发布会", value: "city_brand", category: "文旅品牌活动" },
  { label: "文化节/艺术节", value: "cultural_festival", category: "文旅品牌活动" },
  { label: "展览/展会开幕式", value: "exhibition_opening", category: "文旅品牌活动" },
  { label: "创新创业大赛", value: "innovation_competition", category: "大赛征集活动" },
  { label: "AI创意大赛", value: "ai_contest", category: "大赛征集活动" },
  { label: "创作营/训练营", value: "creative_camp", category: "大赛征集活动" },
  { label: "作品征集活动", value: "work_collection", category: "大赛征集活动" },
  { label: "新闻发布会", value: "press_conference", category: "新闻传播活动" },
  { label: "成果汇报会", value: "achievement_report", category: "新闻传播活动" },
  { label: "品牌发布会", value: "brand_launch", category: "新闻传播活动" },
  { label: "年度总结/表彰大会", value: "annual_meeting", category: "新闻传播活动" },
];

export const generationModeOptions = [
  { label: "稳妥公文模式", value: "official" as GenerationMode, description: "正式、规范的公文写作风格" },
  { label: "策划推演模式", value: "planning" as GenerationMode, description: "注重策划推演和逻辑优化" },
  { label: "长文整理模式", value: "long_text" as GenerationMode, description: "适合长文档整理和深度分析" },
  { label: "宣传传播模式", value: "promotion" as GenerationMode, description: "突出传播效果，适合新媒体" },
  { label: "多模型比选模式", value: "multi_compare" as GenerationMode, description: "同时生成多个版本供比选" },
  { label: "风险审核模式", value: "risk_review" as GenerationMode, description: "侧重安全合规审核" },
];

export const commonFormFields: Record<string, { name: string; label: string; type: string; placeholder: string; options?: { label: string; value: string }[] }> = {
  activity_name: { name: "activity_name", label: "活动名称", type: "text", placeholder: "请输入活动名称" },
  activity_type: { name: "activity_type", label: "活动类型", type: "select", placeholder: "请选择活动类型" },
  host_unit: { name: "host_unit", label: "主办单位", type: "text", placeholder: "如：XX街道党工委" },
  organizer_unit: { name: "organizer_unit", label: "承办单位", type: "text", placeholder: "如：XX社区居委会" },
  activity_time: { name: "activity_time", label: "活动时间", type: "text", placeholder: "如：2026年6月25日上午9:00" },
  activity_location: { name: "activity_location", label: "活动地点", type: "text", placeholder: "如：XX社区党群服务中心" },
  participants: { name: "participants", label: "参与对象", type: "text", placeholder: "如：社区居民、志愿者" },
  activity_background: { name: "activity_background", label: "活动背景", type: "textarea", placeholder: "活动的背景和起因" },
  activity_purpose: { name: "activity_purpose", label: "活动目的", type: "textarea", placeholder: "活动的主要目的" },
  activity_process: { name: "activity_process", label: "活动流程简述", type: "textarea", placeholder: "简要描述活动流程" },
  leadership_guests: { name: "leadership_guests", label: "领导嘉宾", type: "text", placeholder: "拟邀请的领导嘉宾" },
  key_content: { name: "key_content", label: "重点内容", type: "textarea", placeholder: "需要重点呈现的内容" },
  expected_tone: { name: "expected_tone", label: "期望语气风格", type: "select", placeholder: "请选择语气风格" },
  formal_submission: { name: "formal_submission", label: "是否正式报送", type: "select", placeholder: "请选择", options: [{ label: "是", value: "yes" }, { label: "否", value: "no" }] },
  public_release: { name: "public_release", label: "是否用于公开发布", type: "select", placeholder: "" },
};
export const cardStyleOptions: { label: string; value: CardStyle; description: string }[] = [
  { label: "正式稳妥版", value: "official", description: "表达规范，适合正式场合" },
  { label: "简洁实用版", value: "concise", description: "重点突出，高效实用" },
  { label: "宣传传播版", value: "promotion", description: "有传播感，适合公开发布" },
  { label: "亮点提炼版", value: "highlight", description: "聚焦特色亮点和成果" },
  { label: "创意策划版", value: "creative", description: "角度新颖，有创意性" },
];
