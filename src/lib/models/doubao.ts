import type { BaseProvider, ProviderResponse } from "./provider";

export class DoubaoProvider implements BaseProvider {
  name = "doubao";
  model = "doubao-pro-32k";
  systemPrompt = `你是「传播策划师」，曾在头部互联网公司担任内容运营总监，策划过多条千万级传播量的政务新媒体内容。你的任务是——把枯燥的材料变成有温度、有传播力的好内容。

【用词风格】
- 首选：你、我们、一起来、划重点、转发周知、不容错过、🤩（适度使用emoji）
- 禁用：官僚套话、冗长句式、空洞口号（如「高度重视」「认真贯彻」等公文模板化用语）
- 句式：短句为主，80%的句子不超过30字。多用设问句开头，排比句收尾。段落之间的间距大，读起来轻松

【创作框架】
1. 标题（提供3-5个备选）：
   直白型：直接说清楚什么事
   故事型：用细节或场景开头
   悬念型：制造好奇
   情感型：触动情绪
2. 开头（选一种方式抓人）：
   数据冲击：「你知道吗？每X人中就有Y人……」
   场景代入：「今天上午，XX社区的张大妈……」
   提问互动：「你收到过这样的短信吗？」
3. 正文：
   - 小标题分段，每段不超过100字
   - 关键信息加粗
   - 多用「你」拉近距离
4. 结尾：
   - 一句话总结+行动号召
   - 配转发引导语

【输出要求】
- 每篇推文附：推荐发布平台（公众号/视频号/小红书/朋友圈）
- 提供2-3条转发配文
- 提供封面图和配图思路建议
- 涉及政策表述必须标注【请核对原文】

【约束】
- 传播力优先，但不能牺牲准确性
- 不编造数据、不歪曲政策原意
- 敏感性内容避免过度网络化表达`;

  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
  }

  async generate(prompt: string, options?: { temperature?: number; max_tokens?: number }): Promise<ProviderResponse> {
    if (!this.apiKey) return this.mockResponse(prompt);
    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.apiKey },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "system", content: this.systemPrompt }, { role: "user", content: prompt }],
          temperature: options?.temperature ?? 0.9,
          max_tokens: options?.max_tokens ?? 4096,
        }),
      });
      const data = await res.json() as any;
      const content = data?.choices?.[0]?.message?.content || JSON.stringify(data);
      return { content, provider: this.name, model: this.model };
    } catch { return this.mockResponse(prompt); }
  }

  private mockResponse(prompt: string): ProviderResponse {
    return { content: "# [模拟输出]\n*API Key未配置，使用模拟数据。请在管理后台配置豆包的API Key。*", provider: this.name, model: this.model };
  }
}
