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
  const fields = Object.entries(input).filter(([, v]) => v).map(([k, v]) => `${k}：${v}`).join("\n");
  const base = `请根据以下信息生成${taskType}。\n\n任务：${taskType}\n\n用户输入信息：\n${fields}\n\n`;
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

