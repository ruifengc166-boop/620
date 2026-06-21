import type { ProviderResponse } from "./models/provider";
import { TongyiProvider } from "./models/tongyi";
import { DeepSeekProvider } from "./models/deepseek";
import { KimiProvider } from "./models/kimi";
import { DoubaoProvider } from "./models/doubao";
import { GLMProvider } from "./models/glm";
import { ErnieProvider } from "./models/ernie";
import { getModelConfigs } from "./db";

export type GenerationMode = "official" | "planning" | "long_text" | "promotion" | "multi_compare" | "risk_review";

const modeLabels: Record<GenerationMode, string> = {
  official: "稳妥公文模式", planning: "策划推演模式", long_text: "长文整理模式",
  promotion: "宣传传播模式", multi_compare: "多模型比选模式", risk_review: "风险审核模式",
};

// Each mode maps to a specific model with matching agent style
const modeProviderMap: Record<GenerationMode, string> = {
  official: "ernie",       // 文心一言 → 公文写作专家
  planning: "deepseek",     // DeepSeek → 策划分析师
  long_text: "glm",         // GLM → 长文整理专家
  promotion: "doubao",      // 豆包 → 传播策划师
  multi_compare: "kimi",    // Kimi → 比较分析师
  risk_review: "tongyi",    // 通义千问 → 风控审核员
};

function buildPrompt(mode: GenerationMode, taskType: string, input: Record<string, any>): string {
  // Filter out localized fields from general section (added below with Chinese labels)
  const localKeys = ["org_name", "org_region_type", "org_characteristics", "output_style"];
  const generalFields = Object.entries(input).filter(([k, v]) => v && !localKeys.includes(k)).map(([k, v]) => `${k}：${v}`).join("\n");

  let base = `请根据以下信息生成${taskType}。\n\n任务：${taskType}\n\n用户输入信息：\n${generalFields}\n\n`;

  // Add localized organizational info with Chinese labels
  if (input.org_name || input.org_region_type || input.org_characteristics) {
    base += `【单位/地域信息】\n`;
    if (input.org_name) base += `单位名称：${input.org_name}\n`;
    if (input.org_region_type) base += `单位类型：${input.org_region_type}\n`;
    if (input.org_characteristics) base += `单位特色用语：${input.org_characteristics}\n`;
  }
  
  // Intelligent writing guidance based on ALL filled fields
  const guidance: string[] = [];
  if (input.host_unit) guidance.push(`材料需体现主办单位\"${input.host_unit}\"的角色和定位`);
  if (input.organizer_unit) guidance.push(`承办单位\"${input.organizer_unit}\"的职责需在材料中体现`);
  if (input.leadership_guests) guidance.push(`出席活动的领导嘉宾\"${input.leadership_guests}\"应在材料中适当提及`);
  if (input.activity_time) guidance.push(`活动时间\"${input.activity_time}\"需在材料中准确标注`);
  if (input.activity_location) guidance.push(`活动地点\"${input.activity_location}\"需在材料中明确提及`);
  if (input.activity_background && input.activity_purpose) guidance.push(`材料应重点阐述活动的背景和目的，突出举办活动的必要性和意义`);
  else if (input.activity_background) guidance.push(`材料应充分体现活动背景信息`);
  else if (input.activity_purpose) guidance.push(`材料需清晰说明活动目的和预期效果`);
  if (input.activity_process) guidance.push(`根据用户提供的活动流程\"${input.activity_process}\"进行详细展开`);
  if (input.participants) guidance.push(`面向参与对象\"${input.participants}\"，语言风格和内容深度应贴合该群体`);
  if (input.key_content) guidance.push(`重点内容\"${input.key_content}\"需在材料中突出呈现`);
  if (input.expected_tone) guidance.push(`请以\"${input.expected_tone}\"的语气撰写`);
  if (input.formal_submission === "yes") guidance.push(`该材料用于正式报送，格式和用语需规范严谨`);
  if (input.public_release === "yes") guidance.push(`该材料用于公开发布，需注意政治正确性和信息准确性`);

  // Style-specific writing guidance for multi-version output
  const styleGuidance: Record<string, string> = {
    official: "请生成正式稳妥版：结构规范、表达严谨、适合正式报送。",
    concise: "请生成简洁实用版：语言精炼、重点清晰、便于快速使用。",
    promotion: "请生成宣传传播版：标题有吸引力，语言适合公众号和新媒体。",
    highlight: "请生成亮点提炼版：突出核心亮点、成果价值和传播要点。",
    creative: "请生成创意策划版：角度新颖、形式有创意，保持可执行性。",
  };
  if (input.output_style && styleGuidance[input.output_style]) {
    guidance.push(styleGuidance[input.output_style]);
  }
  if (guidance.length === 0) guidance.push(`根据用户提供的活动信息，完整呈现材料内容`);
  
  base += `\n【写作要求】\n${guidance.map(g => `- ${g}`).join("\n")}\n`;
  
  const constraints = `\n【约束条件】\n1. 不得编造政策依据和领导姓名职务\n2. 不确定信息必须标注【待核实】\n3. 不得使用夸大、绝对化表述\n4. 生成内容仅为初稿，需人工审核\n5. 涉及数据、金额、人数时使用用户提供信息，不自行添加\n`;


switch (mode) {
    case "official":
      return `请以正式公文风格撰写一份完整的${taskType}。要求：结构规范、用词严谨、表述稳妥，适合正式报送和归档使用。` + base + constraints;
    case "planning":
      return `请从策划推演的角度进行多维度分析。要求：提供至少2-3种可选方案，对每种方案进行优劣评估，给出推荐建议。` + base + constraints;
    case "long_text":
      return `请以长篇文档形式全面展开。要求：结构层次清晰（至少包含3-4个层级），内容详尽，逻辑严密，适合正式汇报和深入研究。` + base + constraints;
    case "promotion":
      return `请以富有传播力的风格撰写。要求：标题吸引人，语言生动有感染力，适合公众号、短视频、朋友圈等新媒体平台发布。` + base + constraints;
    case "multi_compare":
      return `请从多个不同角度生成2-3个版本，每个版本标注其特点、适用场景和优劣。要求：版本之间有明显的风格和定位差异，方便用户比选和融合。` + base + constraints;
    case "risk_review":
      return `请从风控审核的角度检查以下内容。要求：逐项标记风险点，给出风险等级和修改建议，列出所有待核实信息。` + base + constraints;
    default:
      return base + constraints;
  }
}

export async function generateContent(
  mode: GenerationMode,
  taskType: string,
  input: Record<string, any>,
  options?: { temperature?: number; max_tokens?: number }
): Promise<ProviderResponse> {
  const prompt = buildPrompt(mode, taskType, input);
  const preferredProvider = modeProviderMap[mode];
  const configs = getModelConfigs();
  let provider: any = null;
  let providerName = preferredProvider;
  let modelName = "";

  // Find matching active provider with API key, or fallback to any provider with a key
  const preferred = configs.find(c => c.provider === preferredProvider && c.is_active && c.api_key);
  const modeMapped = configs.find(c => c.is_active && c.mode_mapping.includes(mode) && c.api_key);
  const anyWithKey = configs.find(c => c.is_active && c.api_key);
  const fallback = configs.find(c => c.is_active);

  const config = preferred || modeMapped || anyWithKey || fallback || configs[0];

  if (config) {
    providerName = config.provider;
    modelName = config.model_name;
    // Override systemPrompt and temperature from admin config if set
    const sysPrompt = config.system_prompt || undefined;
    const temp = config.temperature !== undefined ? config.temperature : options?.temperature;
    switch (config.provider) {
      case "tongyi": provider = new TongyiProvider(config.api_key, config.api_url); break;
      case "deepseek": provider = new DeepSeekProvider(config.api_key, config.api_url); break;
      case "kimi": provider = new KimiProvider(config.api_key, config.api_url); break;
      case "doubao": provider = new DoubaoProvider(config.api_key, config.api_url); break;
      case "glm": provider = new GLMProvider(config.api_key, config.api_url); break;
      case "ernie": provider = new ErnieProvider(config.api_key, config.api_url); break;
    }
    if (provider) provider.systemPrompt = sysPrompt || provider.systemPrompt;
    if (temp !== undefined) options = { ...options, temperature: temp };
  }

  if (!provider) provider = new ErnieProvider("");

  const result = await provider.generate(prompt, options);
  return { ...result, provider: providerName, model: modelName };
}

export function getModeLabel(mode: GenerationMode): string {
  return modeLabels[mode] || mode;
}

