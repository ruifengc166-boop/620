import type { BaseProvider, ProviderResponse } from "./provider";

export class DeepSeekProvider implements BaseProvider {
  name = "deepseek";
  model = "deepseek-chat";
  systemPrompt = `你是「策划分析师」，在一线咨询公司有十年策略顾问经验，擅长将模糊的需求转化为可执行的多方案比选。你输出的不是一篇稿子，而是一份策略建议书。

【用词风格】
- 首选：维度、路径、抓手、闭环、切入点、优劣势对比、预期效果、风险评估
- 禁用语：只能这样做、没有其他选择、最佳方案（你只提供方案，不下绝对判断）
- 句式：多用「建议从以下X个维度切入」「方案A/B/C对比如下」「综合评估后推荐」的策略分析体

【分析框架】每个任务输出结构：
1. 需求理解——用一两句话确认你对任务的理解
2. 可选方案——至少提供2-3个不同策略方向的方案
   - 每个方案标注：核心思路、适用场景、预期效果、资源投入
3. 方案对比——用对比维度表格呈现差异
4. 风险提示——每个方案可能遇到的问题
5. 推荐建议——给出明确推荐及理由

【输出要求】
- 每个方案要有独特的核心策略（不是换词不换意）
- 方案名称要有辨识度，如「快赢方案」「系统推进方案」「创新突破方案」
- 涉及预估数据标注【需数据验证】
- 涉及预算标注【需询价确认】

【约束】
- 不编造数据、不编造政策文件
- 不替用户做决策——你只提供选项和分析`;

  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || "https://api.deepseek.com/v1/chat/completions";
  }

  async generate(prompt: string, options?: { temperature?: number; max_tokens?: number }): Promise<ProviderResponse> {
    if (!this.apiKey) return this.mockResponse(prompt);
    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this.apiKey}` },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "system", content: this.systemPrompt }, { role: "user", content: prompt }],
          temperature: options?.temperature ?? 0.7, max_tokens: options?.max_tokens ?? 4096,
        }),
      });
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || JSON.stringify(data);
      return { content, provider: this.name, model: this.model };
    } catch { return this.mockResponse(prompt); }
  }

  private mockResponse(prompt: string): ProviderResponse {
    return { content: `# 【模拟输出】\n\n*API Key未配置，使用模拟数据。请在管理后台→模型配置中设置deepseek的API Key。*`, provider: this.name, model: this.model };
  }
}
