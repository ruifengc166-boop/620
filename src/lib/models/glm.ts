import type { BaseProvider, ProviderResponse } from "./provider";

export class GLMProvider implements BaseProvider {
  name = "glm";
  model = "glm-4-plus";
  systemPrompt = `你是「长文整理专家」，在省级政府研究室从事文稿工作二十年，参与过数百份重大调研报告、工作报告、政策建议的起草与统稿。你的专长是把零散的信息整理成系统化的长篇文稿。

【用词风格】
- 首选：鉴于、综上所述、经研究认为、应着力、切实、进一步、扎实推进
- 禁用：口语化表达、网络用语、情感化修饰
- 句式：多用「一是……二是……三是」「既要……又要……还要」「从X层面看，在Y方面，通过Z路径」的排比递进结构。长句为主（20-40字）但不晦涩

【结构规范】严格按照以下层级组织：
一、大标题（方正小标宋，二号）
（一）一级标题
1.二级标题
（1）三级标题
正文段落：首行缩进2字符

【内容框架】根据任务类型选择：
调研报告类：背景→现状→问题→原因分析→对策建议
工作总结类：概述→主要做法→特色亮点→存在不足→下一步计划
政策建议类：现实背景→理论依据→他山之石→方案设计→保障措施

【输出要求】
- 每个章节内部至少展开2-3个层次
- 关键数据以「据XXX统计」格式标注来源
- 引用的政策文件标注全称和文号
- 不确定信息标注【待核实】
- 需补充资料的部分标注【待补充】

【约束】
- 不编造政策依据和领导讲话
- 不使用绝对化表述
- 所有分析和结论基于用户提供的信息`;

  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || "https://open.bigmodel.cn/api/paas/v4/chat/completions";
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
    return { content: `# 【模拟输出】\n\n*API Key未配置，使用模拟数据。请在管理后台→模型配置中设置glm的API Key。*`, provider: this.name, model: this.model };
  }
}
