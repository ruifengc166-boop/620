import type { BaseProvider, ProviderResponse } from "./provider";

export class TongyiProvider implements BaseProvider {
  name = "tongyi";
  model = "qwen-max";
  systemPrompt = `你是「风控审核员」，在省级宣传部门从事内容审查工作逾十五年，对政治表述的敏感度达到职业本能级别。你的唯一任务是——检查、标注、预警，绝不创作。

【用词风格】
- 首选：核查、建议、需注意、存在风险、建议修改为、需人工确认
- 禁用：完美、确保、绝对、一定、必须（除非是政策原文引用）
- 句式：多用「经审查发现……」「建议将……修改为……」「需重点关注第X段」的审核报告体

【审核框架】按以下顺序逐项扫描：
1. 政治表述规范性——党的指导思想、领导人称谓、政策名称是否与最新提法一致
2. 政策依据准确性——引用的文件、文号、条款是否可查证
3. 泄密风险——是否含内部信息、未公开数据、过程性表述
4. 个人隐私——是否含身份证号、手机号、家庭住址、财务信息
5. 事实数据核实——人数、金额、日期、排名是否有来源支撑
6. 夸大表述——是否有「最」「第一」「唯一」「领先」等绝对化用语
7. 意识形态安全——是否存在价值观偏差或不当类比

【输出格式】
必须按以下结构输出：

总体风险等级：[低/中/高]
风险项：
1. [风险类型] | [原文引用] | [风险说明] | [修改建议] | [是否需人工确认]
待核实清单：
- [具体待核实项]

【约束】
- 不确定的政策条款必须标注文号和原文链接【待核实】
- 疑似涉密内容标注【内部·注意脱敏】
- 所有评分和结论必须有依据，不凭空判断`;

  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
  }

  async generate(prompt: string, options?: { temperature?: number; max_tokens?: number }): Promise<ProviderResponse> {
    if (!this.apiKey) return this.mockResponse(prompt);
    try {
      const messages = [{ role: "system", content: this.systemPrompt }, { role: "user", content: prompt }];
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this.apiKey}` },
        body: JSON.stringify({
          model: this.model,
          input: { messages },
          parameters: { temperature: options?.temperature ?? 0.5, max_tokens: options?.max_tokens ?? 4096, result_format: "message" },
        }),
      });
      const data = await res.json();
      const content = data?.output?.choices?.[0]?.message?.content || JSON.stringify(data);
      return { content, provider: this.name, model: this.model };
    } catch { return this.mockResponse(prompt); }
  }

  private mockResponse(prompt: string): ProviderResponse {
    return { content: `# 【模拟输出】\n\n*API Key未配置，使用模拟数据。请在管理后台→模型配置中设置tongyi的API Key。*`, provider: this.name, model: this.model };
  }
}
