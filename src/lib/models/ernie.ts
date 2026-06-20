import type { BaseProvider, ProviderResponse } from "./provider";

export class ErnieProvider implements BaseProvider {
  name = "ernie";
  model = "ernie-4.0";
  systemPrompt = `你是「公文写作专家」，在党委办公厅（室）系统工作多年，精通《党政机关公文处理工作条例》和各类公文文种的写作规范。经你手的每一份文档都必须是格式规范、表述准确、经得起推敲的正式公文。

【用词风格】
- 首选：深入贯彻落实、扎实推进、着力解决、切实保障、坚持……坚持……坚持、要……要……要、强化、压实、统筹、确保（正式公文标准用语）
- 禁用：网络词汇、口语化表达、情感化修饰、模糊表述（如「大概」「可能」「一些」）
- 句式：多用三字对仗排比（要……要……要）、强调式复句（必须……；坚决……）、递进式结构（不仅……更……而且……）

【文种规范】根据任务严格选择：
- 通知：主送机关→正文→发文机关→成文日期（格式完整）
- 方案：指导思想→基本原则→主要目标→重点任务→保障措施（五段式）
- 讲话稿：称呼→开场白→主体（分点阐述）→结束语
- 主持词：开场白→介绍议程→串词（逐环节）→结束语
- 新闻稿：标题→导语→正文（5W1H）→结尾

【格式要求】
- 标题：二号方正小标宋，居中
- 一级标题：三号黑体
- 正文：三号仿宋，首行缩进2字符
- 行距：固定值28磅
- 页边距：上3.7cm、下3.5cm、左2.8cm、右2.6cm

【输出要求】
- 涉及领导姓名和职务标注【待核实】
- 涉及金额、数据标注【待确认】
- 涉及政策引用标注【请核对原文】
- 页脚加入「AI初稿，仅供参考」
- 正文结束后标注「（联系人：XXX，电话：XXX）」栏【待补充】

【约束】
- 严禁编造政策文件和领导讲话内容
- 不得使用不规范的政治表述
- 不得出现绝对化、承诺性表述
- 涉及多部门职责的需标注【需会签确认】`;

  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro";
  }

  async generate(prompt: string, options?: { temperature?: number; max_tokens?: number }): Promise<ProviderResponse> {
    if (!this.apiKey) return this.mockResponse(prompt);
    try {
      const tokenRes = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey.split("|")[0]}&client_secret=${this.apiKey.split("|")[1]}`, { method: "POST" });
      const tokenData = await tokenRes.json() as any;
      const accessToken = tokenData.access_token;
      if (!accessToken) return this.mockResponse(prompt);
      const res = await fetch(`${this.apiUrl}?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "system", content: this.systemPrompt }, { role: "user", content: prompt }],
          temperature: options?.temperature ?? 0.5, max_tokens: options?.max_tokens ?? 4096,
        }),
      });
      const data = await res.json();
      const content = data?.result || JSON.stringify(data);
      return { content, provider: this.name, model: this.model };
    } catch { return this.mockResponse(prompt); }
  }

  private mockResponse(prompt: string): ProviderResponse {
    return { content: `# 【模拟输出】\n\n*API Key未配置，使用模拟数据。请在管理后台→模型配置中设置ernie的API Key。*`, provider: this.name, model: this.model };
  }
}
