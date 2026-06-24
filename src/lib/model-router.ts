import type { ProviderResponse } from "./models/provider";
import { TongyiProvider } from "./models/tongyi";
import { DeepSeekProvider } from "./models/deepseek";
import { KimiProvider } from "./models/kimi";
import { DoubaoProvider } from "./models/doubao";
import { GLMProvider } from "./models/glm";
import { ErnieProvider } from "./models/ernie";
import { getModelConfigs } from "./db";
import { buildAgentPrompt, buildAgentSystemPrompt } from "./prompt-engine";

export type GenerationMode = "official" | "planning" | "long_text" | "promotion" | "multi_compare" | "risk_review";

const modeLabels: Record<GenerationMode, string> = {
  official: "稳妥公文模式", planning: "策划推演模式", long_text: "长文整理模式",
  promotion: "宣传传播模式", multi_compare: "多模型比选模式", risk_review: "风险审核模式",
};

const modeProviderMap: Record<GenerationMode, string> = {
  official: "ernie",
  planning: "deepseek",
  long_text: "glm",
  promotion: "doubao",
  multi_compare: "kimi",
  risk_review: "tongyi",
};

function buildPrompt(mode: GenerationMode, taskType: string, input: Record<string, any>): string {
  return buildAgentPrompt(mode, taskType, input);
}

function mergeSystemPrompt(defaultPrompt: string, adminPrompt?: string) {
  const agentPrompt = buildAgentSystemPrompt();
  if (adminPrompt && adminPrompt.trim()) {
    return `${adminPrompt.trim()}\n\n${agentPrompt}`;
  }
  return `${defaultPrompt}\n\n${agentPrompt}`;
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

  const preferred = configs.find(c => c.provider === preferredProvider && c.is_active && c.api_key);
  const modeMapped = configs.find(c => c.is_active && c.mode_mapping.includes(mode) && c.api_key);
  const anyWithKey = configs.find(c => c.is_active && c.api_key);
  const fallback = configs.find(c => c.is_active);
  const config = preferred || modeMapped || anyWithKey || fallback || configs[0];

  if (config) {
    providerName = config.provider;
    modelName = config.model_name;
    const adminSystemPrompt = config.system_prompt || undefined;
    const temp = config.temperature !== undefined ? config.temperature : options?.temperature;
    switch (config.provider) {
      case "tongyi": provider = new TongyiProvider(config.api_key, config.api_url); break;
      case "deepseek": provider = new DeepSeekProvider(config.api_key, config.api_url); break;
      case "kimi": provider = new KimiProvider(config.api_key, config.api_url); break;
      case "doubao": provider = new DoubaoProvider(config.api_key, config.api_url); break;
      case "glm": provider = new GLMProvider(config.api_key, config.api_url); break;
      case "ernie": provider = new ErnieProvider(config.api_key, config.api_url); break;
    }
    if (provider) provider.systemPrompt = mergeSystemPrompt(provider.systemPrompt, adminSystemPrompt);
    if (temp !== undefined) options = { ...options, temperature: temp };
  }

  if (!provider) {
    provider = new ErnieProvider("");
    provider.systemPrompt = mergeSystemPrompt(provider.systemPrompt);
  }

  const result = await provider.generate(prompt, options);
  return { ...result, provider: providerName, model: modelName };
}

export function getModeLabel(mode: GenerationMode): string {
  return modeLabels[mode] || mode;
}
