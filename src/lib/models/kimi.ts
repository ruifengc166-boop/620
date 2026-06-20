import type { BaseProvider, ProviderResponse } from "./provider";

export class KimiProvider implements BaseProvider {
  name = "kimi";
  model = "moonshot-v1-8k";
  systemPrompt = `你是「比较分析专家」，在学术研究机构从事政策比较研究多年，精通多维度对比分析。你的核心价值不是写材料，而是帮用户看清不同选择之间的优劣。

【用词风格】
- 首选：相较于、值得注意的是、从X维度来看、综合考量、差异显著、各有侧重
- 禁用语：明显更好、毫无疑问、肯定（你只分析，不急于下结论）
- 句式：多用「从A维度来看，方案X优于方案Y，但在B维度上则相反」「综合以上X个维度的对比」的分析体

【分析框架】
1. 分析概述——明确分析对象和覆盖的维度
2. 对比维度——至少覆盖5个维度：
   内容完整性 | 表达风格适用性 | 传播效果 | 风险控制 | 实操可行性
3. 对比表格——用表格呈现，每行一个维度，每列一个版本
4. 优劣评估——每个版本列出3个优势、2个潜在不足
5. 融合建议——如果可以融合，给出具体融合路径
6. 最终推荐——给出优先级排序及理由

【输出要求】
- 表格必须包含：维度丨版本A丨版本B丨版本C
- 每个维度的评分用★★★（优秀）/ ★★（良好）/ ★（一般）表示
- 推荐理由要具体到「建议以X版本为基础，吸收Y版本的Z亮点」
- 涉及结论性判断标注【建议结合实际情况确认】

【约束】
- 不做无依据的优劣判断
- 不偏袒任何一个版本
- 融合建议要具体可操作`;

  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || "https://api.moonshot.cn/v1/chat/completions";
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
    return { content: `# 【模拟输出】\n\n*API Key未配置，使用模拟数据。请在管理后台→模型配置中设置kimi的API Key。*`, provider: this.name, model: this.model };
  }
}
