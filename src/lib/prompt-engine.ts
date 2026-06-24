import fs from "fs";
import path from "path";
import os from "os";
import type { GenerationMode } from "./model-router";

export const PROMPT_ENGINE_CONFIG_VERSION = "runtime-private-v1";

type PromptMap = Record<string, string>;
export interface PromptEngineConfig {
  version: string;
  enabled: boolean;
  system_prompt: string;
  material_prompts: PromptMap;
  scenario_prompts: PromptMap;
  style_prompts: PromptMap;
  review_prompt: string;
  constraints_prompt: string;
  output_contract: string;
  notes?: string;
  updated_at?: string;
}

type InputMap = Record<string, any>;

const FIELD_LABELS: Record<string, string> = {
  activity_name: "活动名称",
  event_name: "活动名称",
  title: "标题/主题",
  theme: "活动主题",
  activity_theme: "活动主题",
  activity_time: "活动时间",
  time: "时间",
  activity_location: "活动地点",
  location: "地点",
  host_unit: "主办单位",
  organizer_unit: "承办单位",
  co_organizer_unit: "协办单位",
  participants: "参与对象",
  participant_count: "参与人数/规模",
  activity_background: "活动背景",
  background: "背景信息",
  activity_purpose: "活动目的",
  purpose: "目标/目的",
  key_content: "重点内容",
  activity_process: "活动流程",
  process: "流程安排",
  leadership_guests: "领导/嘉宾",
  guests: "嘉宾信息",
  expected_tone: "期望语气",
  org_name: "单位名称",
  org_region_type: "单位类型",
  org_characteristics: "单位特色用语",
  contact: "联系人",
  registration: "报名方式",
  materials: "材料要求",
};

const INTERNAL_KEYS = new Set(["output_style", "user_id", "cards", "mode"]);

const MATERIAL_ALIASES: Record<string, string> = {
  "活动方案": "活动方案",
  "会议方案": "活动方案",
  "主持词": "主持词",
  "新闻稿": "新闻稿",
  "媒体通稿": "新闻稿",
  "公众号推文": "公众号推文",
  "推文": "公众号推文",
  "活动通知": "活动通知",
  "会议通知": "活动通知",
  "活动总结": "活动总结",
  "培训总结": "活动总结",
  "领导致辞初稿": "领导致辞初稿",
  "领导讲话初稿": "领导致辞初稿",
  "活动流程表": "活动流程表",
  "任务分工表": "任务分工表",
  "任务分解表": "任务分工表",
  "工作简报": "工作简报",
  "邀请函": "邀请函",
  "会议纪要": "会议纪要",
  "政策解读稿": "政策解读稿",
  "问答手册": "问答手册",
};

const SCENARIO_KEYWORDS: Record<string, string[]> = {
  waka: ["瓦卡", "分赛场", "赛事", "作品征集", "征集发动", "奖项", "大赛"],
  camp: ["创作营", "训练营", "开营", "结营", "学员", "导师", "课程安排"],
  salon: ["分享会", "沙龙", "交流会", "圆桌", "创作者交流", "案例分享"],
  training: ["培训", "宣讲", "课程", "专题讲座", "学习班"],
  community: ["社区", "街道", "居民", "群众", "党群服务中心", "新时代文明实践"],
  park: ["园区", "企业", "产业", "招商", "孵化器", "科技园", "服务企业"],
  university: ["高校", "大学", "学院", "学生", "社团", "校园"],
  policy: ["政策", "申报", "补贴", "政务", "办事", "解读"],
  party: ["党建", "党群", "党员", "支部", "主题党日"],
};

const SAFE_FALLBACK_CONFIG: PromptEngineConfig = {
  version: PROMPT_ENGINE_CONFIG_VERSION,
  enabled: true,
  system_prompt: "你是办会材料写作助手。请根据用户输入生成结构清晰、事实稳妥、便于人工修改的活动材料初稿。不得编造用户未提供的事实、数据、领导姓名、政策依据和成果评价。",
  material_prompts: {},
  scenario_prompts: {},
  style_prompts: {},
  review_prompt: "生成前检查：文种是否匹配、结构是否完整、事实是否安全、是否存在待核实信息。",
  constraints_prompt: "不确定信息必须标注【待确认】或【待核实】；生成内容仅为初稿，正式使用前需人工审核。",
  output_contract: "请输出：一、正文初稿；二、使用前建议补充；三、风险与待核实项。",
  notes: "请在管理后台配置私有 Prompt。GitHub 仓库只保存读取和拼装逻辑，不保存核心 Prompt 内容。",
};

function getDataDir(): string {
  const primary = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(primary)) fs.mkdirSync(primary, { recursive: true });
    const test = path.join(primary, ".write-test");
    fs.writeFileSync(test, "");
    fs.unlinkSync(test);
    return primary;
  } catch {
    const fallback = path.join(os.tmpdir(), "banhuigongfang-data");
    if (!fs.existsSync(fallback)) fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

const PROMPT_FILE = path.join(getDataDir(), "prompt-engine.private.json");

function valueToText(value: any): string {
  if (Array.isArray(value)) return value.filter(Boolean).join("、");
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value ?? "").trim();
}

function normalizePromptMap(value: any): PromptMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, valueToText(v)]).filter(([k, v]) => k && v));
}

function normalizeConfig(raw: Partial<PromptEngineConfig> | null | undefined): PromptEngineConfig {
  return {
    ...SAFE_FALLBACK_CONFIG,
    ...(raw || {}),
    version: raw?.version || PROMPT_ENGINE_CONFIG_VERSION,
    enabled: raw?.enabled !== false,
    system_prompt: valueToText(raw?.system_prompt || SAFE_FALLBACK_CONFIG.system_prompt),
    material_prompts: normalizePromptMap(raw?.material_prompts),
    scenario_prompts: normalizePromptMap(raw?.scenario_prompts),
    style_prompts: normalizePromptMap(raw?.style_prompts),
    review_prompt: valueToText(raw?.review_prompt || SAFE_FALLBACK_CONFIG.review_prompt),
    constraints_prompt: valueToText(raw?.constraints_prompt || SAFE_FALLBACK_CONFIG.constraints_prompt),
    output_contract: valueToText(raw?.output_contract || SAFE_FALLBACK_CONFIG.output_contract),
    notes: valueToText(raw?.notes || SAFE_FALLBACK_CONFIG.notes),
  };
}

export function getPromptEngineConfig(): PromptEngineConfig {
  try {
    if (!fs.existsSync(PROMPT_FILE)) return SAFE_FALLBACK_CONFIG;
    return normalizeConfig(JSON.parse(fs.readFileSync(PROMPT_FILE, "utf-8")));
  } catch {
    return SAFE_FALLBACK_CONFIG;
  }
}

export function savePromptEngineConfig(next: Partial<PromptEngineConfig>): PromptEngineConfig {
  const current = getPromptEngineConfig();
  const merged = normalizeConfig({ ...current, ...next, updated_at: new Date().toISOString() });
  fs.writeFileSync(PROMPT_FILE, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

export function getPromptEngineMeta() {
  const cfg = getPromptEngineConfig();
  return {
    version: cfg.version,
    enabled: cfg.enabled,
    updated_at: cfg.updated_at || null,
    material_count: Object.keys(cfg.material_prompts || {}).length,
    scenario_count: Object.keys(cfg.scenario_prompts || {}).length,
    style_count: Object.keys(cfg.style_prompts || {}).length,
    storage: "server-runtime-private-file",
  };
}

function formatInput(input: InputMap): string {
  const rows = Object.entries(input)
    .filter(([key, value]) => !INTERNAL_KEYS.has(key) && valueToText(value))
    .map(([key, value]) => `${FIELD_LABELS[key] || key}：${valueToText(value)}`);
  return rows.length ? rows.join("\n") : "【待补充】用户未提供详细信息，请生成通用可修改初稿，并显著标注待补充项。";
}

function combinedInputText(taskType: string, input: InputMap): string {
  return `${taskType}\n${Object.values(input).map(valueToText).join("\n")}`.toLowerCase();
}

function includesAny(text: string, words: string[]) {
  return words.some(w => text.includes(w.toLowerCase()));
}

function detectScenario(taskType: string, input: InputMap): string {
  const text = combinedInputText(taskType, input);
  for (const [key, words] of Object.entries(SCENARIO_KEYWORDS)) {
    if (includesAny(text, words)) return key;
  }
  return "general";
}

function inferMaterialKey(taskType: string): string {
  if (MATERIAL_ALIASES[taskType]) return MATERIAL_ALIASES[taskType];
  if (taskType.includes("方案")) return "活动方案";
  if (taskType.includes("主持")) return "主持词";
  if (taskType.includes("新闻") || taskType.includes("通稿")) return "新闻稿";
  if (taskType.includes("公众号") || taskType.includes("推文")) return "公众号推文";
  if (taskType.includes("通知")) return "活动通知";
  if (taskType.includes("总结") || taskType.includes("复盘")) return "活动总结";
  if (taskType.includes("致辞") || taskType.includes("讲话")) return "领导致辞初稿";
  if (taskType.includes("流程")) return "活动流程表";
  if (taskType.includes("分工") || taskType.includes("分解")) return "任务分工表";
  if (taskType.includes("简报")) return "工作简报";
  if (taskType.includes("邀请")) return "邀请函";
  if (taskType.includes("纪要")) return "会议纪要";
  if (taskType.includes("政策") || taskType.includes("解读")) return "政策解读稿";
  if (taskType.includes("问答") || taskType.includes("手册")) return "问答手册";
  return "通用";
}

function buildFieldGuidance(input: InputMap): string[] {
  const guidance: string[] = [];
  if (input.host_unit) guidance.push(`材料需体现主办单位「${input.host_unit}」的角色和定位。`);
  if (input.organizer_unit) guidance.push(`承办单位「${input.organizer_unit}」的职责需自然体现。`);
  if (input.leadership_guests) guidance.push(`出席领导/嘉宾「${input.leadership_guests}」可以适当提及，但职务、排序和称谓需标注核实。`);
  if (input.activity_time) guidance.push(`活动时间「${input.activity_time}」必须准确出现。`);
  if (input.activity_location) guidance.push(`活动地点「${input.activity_location}」必须明确出现。`);
  if (input.participants) guidance.push(`语言深度和表达方式要贴合参与对象「${input.participants}」。`);
  if (input.activity_background && input.activity_purpose) guidance.push("要把活动背景和活动目的连接起来，说明为什么要办、办了要解决什么问题。");
  else if (input.activity_background) guidance.push("要充分体现用户提供的活动背景，不要泛泛而谈。");
  else if (input.activity_purpose) guidance.push("要清晰说明活动目的和预期效果，避免空泛口号。");
  if (input.activity_process) guidance.push(`应根据用户提供的流程「${input.activity_process}」展开，不要另造一套流程。`);
  if (input.key_content) guidance.push(`重点内容「${input.key_content}」必须突出呈现。`);
  if (input.formal_submission === "yes") guidance.push("该材料用于正式报送，必须更加规范、克制、稳妥。");
  if (input.public_release === "yes") guidance.push("该材料用于公开发布，必须注意事实准确、隐私保护和表述边界。");
  return guidance;
}

function modeStrategy(mode: GenerationMode): string {
  const map: Record<GenerationMode, string> = {
    official: "正式稳妥生成",
    planning: "策划推演生成",
    long_text: "长文档生成",
    promotion: "宣传传播生成",
    multi_compare: "多版本比选生成",
    risk_review: "风险审校生成",
  };
  return map[mode] || mode;
}

export function buildAgentSystemPrompt() {
  const cfg = getPromptEngineConfig();
  return cfg.enabled ? cfg.system_prompt : SAFE_FALLBACK_CONFIG.system_prompt;
}

export function buildAgentPrompt(mode: GenerationMode, taskType: string, input: InputMap): string {
  const cfg = getPromptEngineConfig();
  const materialKey = inferMaterialKey(taskType);
  const scenarioKey = detectScenario(taskType, input);
  const styleKey = input.output_style || (mode === "promotion" ? "promotion" : "official");
  const materialPrompt = cfg.material_prompts[materialKey] || cfg.material_prompts["通用"] || "";
  const scenarioPrompt = cfg.scenario_prompts[scenarioKey] || cfg.scenario_prompts["general"] || "";
  const stylePrompt = cfg.style_prompts[styleKey] || "";
  const fieldGuidance = buildFieldGuidance(input);

  return `【任务】\n请生成：${taskType}\n\n【用户输入信息】\n${formatInput(input)}\n\n【识别结果】\n- 生成模式：${modeStrategy(mode)}\n- 文种模板：${materialKey}\n- 场景模板：${scenarioKey}\n- 风格模板：${styleKey}\n\n【文种 Prompt】\n${materialPrompt || "【未配置】请在管理后台配置该文种 Prompt。当前使用通用结构生成。"}\n\n【场景 Prompt】\n${scenarioPrompt || "【未配置】请在管理后台配置该场景 Prompt。"}\n\n【风格 Prompt】\n${stylePrompt || "【未配置】请在管理后台配置该风格 Prompt。"}\n\n【字段使用要求】\n${fieldGuidance.length ? fieldGuidance.map(item => `- ${item}`).join("\n") : "- 用户信息较少，请生成可修改的通用初稿，并显著标注待补充项。"}\n\n【审校 Prompt】\n${cfg.review_prompt}\n\n【约束 Prompt】\n${cfg.constraints_prompt}\n\n【输出格式 Prompt】\n${cfg.output_contract}\n\n【重要要求】\n- 不要解释你如何思考，直接输出可用材料。\n- 正文要完整，不要只给提纲。\n- 如果信息不足，先生成可用底稿，并在对应位置标注【待补充】。\n- 语言要像真实工作材料，不要像 AI 教程或泛泛说明。`;
}
