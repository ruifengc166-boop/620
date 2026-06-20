
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface StoredUser {
  id: string; phone_email: string; nickname: string; password_hash: string;
  role_type: string; membership_level: string; points_balance: number;
  created_at: string; updated_at: string;
}
interface StoredTemplate {
  id: string; name: string; category: string; priority_level: string;
  description: string; target_roles: string[]; input_schema: any;
  output_materials: string[]; risk_level: string; is_active: boolean;
}
interface StoredGeneration {
  id: string; user_id: string; task_type: string; event_type: string;
  generation_mode: string; model_provider: string; model_name: string;
  metadata: any; risk_level: string; points_used: number; created_at: string;
}
interface StoredMaterial {
  id: string; user_id: string; title: string; material_type: string;
  content: string; risk_level: string; user_confirmed_safe: boolean;
  created_at: string; updated_at: string;
}
interface StoredRiskReview {
  id: string; user_id: string; generation_id: string;
  risk_level: string; risk_summary: string; created_at: string;
}
interface StoredPointsLog {
  id: string; user_id: string; action_type: string;
  points_change: number; related_generation_id: string; created_at: string;
}
interface ModelConfig {
  provider: string; model_name: string; api_key: string; api_url: string;
  is_active: boolean; mode_mapping: string[]; system_prompt?: string; temperature?: number;
}
interface SiteContent { [key: string]: string; }

interface Database {
  users: StoredUser[];
  templates: StoredTemplate[];
  generations: StoredGeneration[];
  materials: StoredMaterial[];
  risk_reviews: StoredRiskReview[];
  site_content: SiteContent;
  points_logs: StoredPointsLog[];
  model_configs: ModelConfig[];
}

function getDefaultDB(): Database {
  return {
    users: [],
        templates: [
      { id: "policy_promotion", name: "政策宣讲会", category: "党政机关活动", priority_level: "P0", description: "面向群众或企业进行政策解读宣讲", target_roles: [], input_schema: {}, output_materials: ["活动方案", "会议通知", "主持词", "领导致辞初稿", "政策解读稿", "企业/群众问答手册", "新闻稿", "公众号推文", "短视频口播脚本", "活动总结"], risk_level: "low", is_active: true },
      { id: "work_promotion", name: "工作推进会", category: "党政机关活动", priority_level: "P0", description: "推动重点工作落实的会议活动", target_roles: [], input_schema: {}, output_materials: ["会议方案", "会议议程", "主持词", "领导讲话初稿", "部门汇报提纲", "任务分解表", "会议纪要", "新闻稿", "督办清单", "工作简报"], risk_level: "low", is_active: true },
      { id: "research_symposium", name: "调研座谈会", category: "党政机关活动", priority_level: "P0", description: "深入一线调研并座谈交流", target_roles: [], input_schema: {}, output_materials: ["调研方案", "座谈提纲", "主持词", "领导讲话初稿", "问题清单", "发言提纲", "调研报告初稿", "新闻稿", "会议纪要", "后续跟进表"], risk_level: "low", is_active: true },
      { id: "training_session", name: "专题培训会", category: "党政机关活动", priority_level: "P2", description: "针对特定主题开展培训", target_roles: [], input_schema: {}, output_materials: ["培训方案", "培训通知", "主持词", "领导开班讲话", "课程安排表", "培训课件大纲", "学员手册", "新闻稿", "培训总结", "工作简报"], risk_level: "low", is_active: true },
      { id: "party_building", name: "党建/主题党日活动", category: "党政机关活动", priority_level: "P0", description: "党建主题学习和实践活动", target_roles: [], input_schema: {}, output_materials: ["活动方案", "学习议程", "主持词", "书记讲话初稿", "学习材料汇编", "会议记录", "新闻稿", "学习心得体会模板", "台账说明", "活动总结"], risk_level: "low", is_active: true },
      { id: "community_practice", name: "社区文明实践活动", category: "社区活动", priority_level: "P0", description: "社区开展新时代文明实践主题活动", target_roles: [], input_schema: {}, output_materials: ["活动方案", "志愿者招募文案", "居民通知", "主持词", "新闻稿", "公众号推文", "照片说明", "台账材料", "活动总结", "工作简报"], risk_level: "low", is_active: true },
      { id: "fraud_prevention", name: "防诈骗/安全宣传活动", category: "社区活动", priority_level: "P1", description: "面向居民开展防诈骗、安全生产等宣传", target_roles: [], input_schema: {}, output_materials: ["活动方案", "居民通知", "主持词", "宣传单页文案", "案例汇编", "新闻稿", "公众号推文", "照片说明", "活动总结", "台账材料"], risk_level: "low", is_active: true },
      { id: "resident_forum", name: "居民议事会", category: "社区活动", priority_level: "P2", description: "组织居民议事、收集民意", target_roles: [], input_schema: {}, output_materials: ["会议方案", "居民通知", "议题清单", "主持词", "会议记录", "问题台账", "新闻稿", "解决方案", "活动总结", "工作简报"], risk_level: "low", is_active: true },
      { id: "volunteer_service", name: "志愿服务活动", category: "社区活动", priority_level: "P2", description: "组织志愿者开展社区服务活动", target_roles: [], input_schema: {}, output_materials: ["活动方案", "志愿者招募令", "活动通知", "主持词", "志愿者分工表", "新闻稿", "公众号推文", "活动总结", "照片说明", "服务时长记录"], risk_level: "low", is_active: true },
      { id: "waste_sorting", name: "垃圾分类宣传活动", category: "社区活动", priority_level: "P1", description: "向居民宣传垃圾分类知识和政策", target_roles: [], input_schema: {}, output_materials: ["活动方案", "居民通知", "宣传单页文案", "分类知识手册", "主持词", "新闻稿", "公众号推文", "照片说明", "活动总结", "台账材料"], risk_level: "low", is_active: true },
      { id: "investment_promotion", name: "招商推介会", category: "招商产业活动", priority_level: "P0", description: "面向企业开展招商引资推介", target_roles: [], input_schema: {}, output_materials: ["招商活动方案", "企业邀请函", "领导致辞初稿", "招商推介稿", "园区介绍稿", "投资指南", "主持词", "媒体通稿", "会后跟进表", "项目洽谈纪要"], risk_level: "low", is_active: true },
      { id: "enterprise_service", name: "企业服务日", category: "招商产业活动", priority_level: "P1", description: "为企业提供政策宣讲、诉求收集等服务", target_roles: [], input_schema: {}, output_materials: ["活动方案", "企业邀请函", "主持词", "领导致辞初稿", "政策汇编手册", "企业诉求收集表", "新闻稿", "公众号推文", "活动总结", "跟进落实表"], risk_level: "low", is_active: true },
      { id: "project_signing", name: "项目签约仪式", category: "招商产业活动", priority_level: "P0", description: "重大项目集中签约仪式", target_roles: [], input_schema: {}, output_materials: ["签约方案", "签约流程表", "主持词", "领导致辞初稿", "签约项目简介", "媒体通稿", "新闻稿", "现场物料文案", "风险提醒清单", "活动总结"], risk_level: "low", is_active: true },
      { id: "industry_salon", name: "产业沙龙/闭门会", category: "招商产业活动", priority_level: "P1", description: "产业主题交流沙龙", target_roles: [], input_schema: {}, output_materials: ["活动方案", "企业邀请函", "主持词", "嘉宾发言稿", "讨论提纲", "会议纪要", "新闻稿", "活动总结", "参会企业名录", "后续跟进计划"], risk_level: "low", is_active: true },
      { id: "cultural_tourism", name: "文旅推介会", category: "文旅品牌活动", priority_level: "P1", description: "推介本地文旅资源和特色项目", target_roles: [], input_schema: {}, output_materials: ["推介方案", "嘉宾邀请函", "主持词", "领导致辞初稿", "文旅推介稿", "宣传视频脚本", "媒体通稿", "新闻稿", "公众号推文", "活动总结"], risk_level: "low", is_active: true },
      { id: "exhibition_opening", name: "展览/展会开幕式", category: "文旅品牌活动", priority_level: "P1", description: "展览或展会的开幕仪式", target_roles: [], input_schema: {}, output_materials: ["开幕方案", "嘉宾邀请函", "流程表", "主持词", "领导致辞初稿", "展览介绍稿", "新闻稿", "媒体通稿", "现场文案", "活动总结"], risk_level: "low", is_active: true },
      { id: "cultural_festival", name: "文化节/艺术节", category: "文旅品牌活动", priority_level: "P2", description: "举办大型文化节庆活动", target_roles: [], input_schema: {}, output_materials: ["活动方案", "活动通知", "节目单", "主持词", "领导致辞初稿", "新闻稿", "公众号推文", "宣传海报文案", "活动总结", "照片说明"], risk_level: "low", is_active: true },
      { id: "civilization_creation", name: "文明创建工作会", category: "文旅品牌活动", priority_level: "P2", description: "推进城市/社区文明创建工作", target_roles: [], input_schema: {}, output_materials: ["工作方案", "居民倡议书", "创建标准清单", "主持词", "新闻稿", "公众号推文", "自查整改台账", "活动总结", "照片说明", "工作简报"], risk_level: "low", is_active: true },
      { id: "business_optimization", name: "优化营商环境推进会", category: "招商产业活动", priority_level: "P2", description: "推进营商环境优化工作", target_roles: [], input_schema: {}, output_materials: ["会议方案", "企业邀请函", "主持词", "领导讲话初稿", "惠企政策汇编", "企业诉求清单", "任务分解表", "新闻稿", "会议纪要", "工作简报"], risk_level: "low", is_active: true },
      { id: "press_conference", name: "新闻发布会", category: "新闻传播活动", priority_level: "P1", description: "面向媒体发布重要信息", target_roles: [], input_schema: {}, output_materials: ["发布方案", "媒体邀请函", "主持词", "发布词", "媒体问答指引", "新闻通稿", "新闻稿", "背景材料", "媒体签到表", "会后跟进"], risk_level: "low", is_active: true },
      { id: "achievement_report", name: "成果汇报会", category: "新闻传播活动", priority_level: "P2", description: "向上级或公众汇报工作成果", target_roles: [], input_schema: {}, output_materials: ["汇报方案", "会议议程", "主持词", "领导讲话初稿", "成果汇报材料", "数据图表汇编", "新闻稿", "成果清单", "活动总结", "媒体通稿"], risk_level: "low", is_active: true },
      { id: "annual_meeting", name: "年度总结/表彰大会", category: "新闻传播活动", priority_level: "P1", description: "年度工作总结和表彰先进", target_roles: [], input_schema: {}, output_materials: ["大会方案", "会议议程", "主持词", "领导讲话初稿", "工作报告", "表彰决定", "代表发言稿", "新闻稿", "工作简报", "活动总结"], risk_level: "low", is_active: true },
      { id: "public_welfare", name: "民生实事项目推进会", category: "新闻传播活动", priority_level: "P2", description: "推进民生实事项目落实", target_roles: [], input_schema: {}, output_materials: ["会议方案", "项目清单", "主持词", "领导讲话初稿", "进度汇报表", "问题协调纪要", "新闻稿", "督办清单", "会议纪要", "工作简报"], risk_level: "low", is_active: true },
    ],
    generations: [],
    materials: [],
    risk_reviews: [],
    site_content: {},
    points_logs: [],
    model_configs: [
      { provider: "tongyi", model_name: "qwen-max", api_key: "", api_url: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", is_active: true, mode_mapping: ["risk_review"], system_prompt: "你是一位专业的风控审核员，擅长从意识形态安全、政策合规、泄密风险等角度检查文档内容。", temperature: 0.5 },
      { provider: "deepseek", model_name: "deepseek-chat", api_key: "", api_url: "https://api.deepseek.com/v1/chat/completions", is_active: true, mode_mapping: ["planning"], system_prompt: "你是一位资深的策划分析师和策略顾问，擅长活动策划、流程设计、方案推演和逻辑优化。", temperature: 0.8 },
      { provider: "kimi", model_name: "moonshot-v1-8k", api_key: "", api_url: "https://api.moonshot.cn/v1/chat/completions", is_active: true, mode_mapping: ["multi_compare"], system_prompt: "你是一位专业的比较分析专家，擅长从多角度对比不同方案、整理长文档、提炼核心观点。", temperature: 0.6 },
      { provider: "doubao", model_name: "doubao-pro-32k", api_key: "", api_url: "https://ark.cn-beijing.volces.com/api/v3/chat/completions", is_active: true, mode_mapping: ["promotion"], system_prompt: "你是一位资深的传播策划师和新媒体运营专家，擅长撰写公众号推文、短视频脚本等传播类内容。", temperature: 0.9 },
      { provider: "glm", model_name: "glm-4-plus", api_key: "", api_url: "https://open.bigmodel.cn/api/paas/v4/chat/completions", is_active: true, mode_mapping: ["long_text"], system_prompt: "你是一位经验丰富的长文整理专家和文档编撰顾问，擅长处理大量信息、组织长篇文档结构。", temperature: 0.6 },
      { provider: "ernie", model_name: "ernie-4.0", api_key: "", api_url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro", is_active: true, mode_mapping: ["official"], system_prompt: "你是一位资深的政府公文写作专家，精通各类机关公文写作规范，用词严谨规范、结构层次分明。", temperature: 0.5 },
    ],
  };
}

let _cache: Database | null = null;

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}
export function loadDB(): Database {
  ensureDir();
  if (_cache) return _cache;
  if (!fs.existsSync(DB_FILE)) {
    const def = getDefaultDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(def, null, 2), "utf-8");
    _cache = def;
    return def;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    _cache = JSON.parse(raw) as Database;
    return _cache;
  } catch {
    const def = getDefaultDB();
    _cache = def;
    return def;
  }
}


function resetCache(): void { _cache = null; }

function hashPassword(pw: string): string {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function genId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// ===== Exported functions =====

export function findUserByEmail(email: string) {
  return loadDB().users.find(u => u.phone_email === email);
}

export function findUserById(id: string) {
  return loadDB().users.find(u => u.id === id);
}

export function createUser(nickname: string, email: string, password: string): StoredUser {
  const db = loadDB();
  const user: StoredUser = {
    id: genId(), phone_email: email, nickname, password_hash: hashPassword(password),
    role_type: "user", membership_level: "free", points_balance: 10,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB();
  return user;
}

export function verifyPassword(user: StoredUser, password: string): boolean {
  return user.password_hash === hashPassword(password);
}

export function getTemplates() {
  return loadDB().templates.filter(t => t.is_active);
}

export function getAllGenerations() {
  return loadDB().generations;
}

export function createGeneration(data: Partial<StoredGeneration>): StoredGeneration {
  const db = loadDB();
  const gen: StoredGeneration = {
    id: genId(), user_id: data.user_id || "", task_type: data.task_type || "",
    event_type: data.event_type || "", generation_mode: data.generation_mode || "",
    model_provider: data.model_provider || "", model_name: data.model_name || "",
    metadata: data.metadata || {}, risk_level: data.risk_level || "low",
    points_used: data.points_used || 0, created_at: new Date().toISOString(),
  };
  db.generations.push(gen);
  saveDB();
  return gen;
}

export function createMaterial(data: Partial<StoredMaterial>): StoredMaterial {
  const db = loadDB();
  const mat: StoredMaterial = {
    id: genId(), user_id: data.user_id || "", title: data.title || "",
    material_type: data.material_type || "", content: data.content || "",
    risk_level: data.risk_level || "low", user_confirmed_safe: data.user_confirmed_safe || false,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  db.materials.push(mat);
  saveDB();
  return mat;
}

export function deleteMaterial(id: string): void {
  const db = loadDB();
  db.materials = db.materials.filter(m => m.id !== id);
  saveDB();
}

export function getUserMaterials(userId: string) {
  return loadDB().materials.filter(m => m.user_id === userId);
}

export function getModelConfigs() {
  return loadDB().model_configs;
}

export function updateModelConfig(provider: string, updates: Partial<ModelConfig>): void {
  const db = loadDB();
  const idx = db.model_configs.findIndex(m => m.provider === provider);
  if (idx >= 0) {
    db.model_configs[idx] = { ...db.model_configs[idx], ...updates };
    saveDB();
  }
}

export function getPointsLogs(userId: string) {
  return loadDB().points_logs.filter(p => p.user_id === userId);
}

export function addPointsLog(data: Partial<StoredPointsLog>): void {
  const db = loadDB();
  db.points_logs.push({
    id: genId(), user_id: data.user_id || "", action_type: data.action_type || "",
    points_change: data.points_change || 0, related_generation_id: data.related_generation_id || "",
    created_at: new Date().toISOString(),
  });
  saveDB();
}

export function getAllUsers() {
  return loadDB().users;
}

export function getAllTemplatesAdmin() {
  return loadDB().templates;
}

export function upsertTemplate(tpl: StoredTemplate): void {
  const db = loadDB();
  const idx = db.templates.findIndex(t => t.id === tpl.id);
  if (idx >= 0) db.templates[idx] = tpl;
  else db.templates.push(tpl);
  saveDB();
}

export function getStats() {
  const db = loadDB();
  return {
    total_users: db.users.length,
    total_generations: db.generations.length,
    total_materials: db.materials.length,
    total_risk_reviews: db.risk_reviews.length,
    generations_today: db.generations.filter(g => g.created_at.startsWith(new Date().toISOString().slice(0, 10))).length,
    active_models: db.model_configs.filter(m => m.is_active).length,
  };
}



export function updateSiteContent(key: string, value: string): void {
  const db = loadDB();
  if (!db.site_content) db.site_content = {};
  db.site_content[key] = value;
  saveDB();
}
export function saveDB(): void {
  ensureDir();
  if (_cache) fs.writeFileSync(DB_FILE, JSON.stringify(_cache, null, 2), "utf-8");
}


