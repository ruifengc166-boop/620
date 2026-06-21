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
  // Task-specific structure guidance for different material types
  const taskStructureGuidance: Record<string, string> = {
    "活动方案": "请严格按照活动方案结构输出：\n一、活动背景\n二、活动目的\n三、活动主题\n四、活动时间和地点\n五、组织单位\n六、参与对象和规模\n七、活动流程\n八、职责分工\n九、宣传安排\n十、物料准备\n十一、风险预案\n十二、后续工作\n要求内容完整、可执行，不要只写提纲。",
    "主持词": "请严格按照主持词结构输出：\n一、开场白\n二、介绍出席领导和嘉宾\n三、活动/会议流程串词\n四、重点环节承接语\n五、结束语\n要求口语化、现场感强，每个环节都要有可直接朗读的完整句子。",
    "新闻稿": "请严格按照新闻稿结构输出：\n标题\n导语\n正文一：活动基本情况\n正文二：现场过程和重点内容\n正文三：亮点成效\n结尾：后续影响或工作延伸\n要求新闻语言，不要写成方案或总结。",
    "公众号推文": "请严格按照公众号推文结构输出：\n1. 提供3个标题备选\n2. 开头导语\n3. 正文分段小标题\n4. 活动亮点\n5. 结尾号召或转发语\n要求更有传播感，但不得夸大。",
    "活动通知": "请严格按照通知结构输出：\n标题\n通知对象\n活动时间\n活动地点\n活动内容\n参加人员\n有关要求\n联系人\n落款\n要求格式规范，信息不明确处标注【待确认】。",
    "邀请函": "请严格按照邀请函结构输出：\n称谓\n邀请缘由\n活动价值\n时间地点\n活动安排\n报名/联系信息\n礼貌结尾\n要求语气正式、友好。",
    "活动总结": "请严格按照总结结构输出：\n一、活动基本情况\n二、主要做法\n三、活动成效\n四、亮点经验\n五、存在不足\n六、下一步计划\n要求总结真实稳妥，不编造成果。",
    "工作简报": "请严格按照简报结构输出：\n标题\n导语\n重点做法\n阶段成效\n亮点提炼\n下一步安排\n要求简洁、有条理、适合向上级报送。",
    "领导致辞初稿": "请严格按照领导致辞结构输出：\n一、称呼和问候\n二、开场感谢或祝贺\n三、活动背景和价值肯定\n四、对活动的期望和要求\n五、对参与者的鼓励\n六、结束语和祝福\n要求语气庄重得体，符合领导身份和场合。",
    "活动流程表": "请严格按照流程表格结构输出：\n一、活动基本信息\n二、详细流程表（时间、环节、内容、负责人、备注）\n三、关键时间节点\n四、注意事项\n要求流程清晰、时间合理、分工明确。",
    "任务分工表": "请按照任务分工表结构输出：\n一、总体目标\n二、工作小组设置及职责分工\n三、各小组任务清单（小组名称、任务内容、责任人、完成时限）\n四、协调机制\n要求职责清晰、任务具体、时限明确。",
    "政策解读稿": "请按照政策解读稿结构输出：一、政策背景；二、核心内容；三、适用对象；四、办理流程；五、常见问题；六、注意事项。要求通俗准确，不编造政策条文。",
    "问答手册": "请按照问答手册结构输出：围绕群众/企业最关心的问题，生成不少于8组问答，每组包括问题、简明回答、办理提醒。",
    "企业/群众问答手册": "请按照问答手册结构输出：围绕群众/企业最关心的问题，生成不少于8组问答，每组包括问题、简明回答、办理提醒。",
    "会议纪要": "请按照会议纪要结构输出：会议基本情况、主要议题、发言要点、形成意见、任务分工、后续事项。",
    "台账材料": "请按照台账材料结构输出：事项名称、工作内容、责任单位、责任人、时间节点、完成情况、备注，用表格呈现。",
    "照片说明": "请生成活动照片说明模板：每张照片包括拍摄场景、人物/环节、说明文字、可用于归档的规范表述。",
    "宣传单页文案": "请按照宣传单页结构输出：主标题、副标题、核心卖点/要点、三到五条重点说明、行动引导、联系方式。",
    "现场物料文案": "请按照现场物料文案结构输出：主视觉标题、背景板文案、签到处文案、指引牌文案、桌牌/座签说明、宣传口号。",
    "提纲类材料": "请按照提纲类材料结构输出：一、总体要求；二、主要内容；三、重点环节；四、时间安排；五、注意事项。要求条理清晰、有逻辑层次。",
    "清单类材料": "请按照清单类材料结构输出：以表格形式呈现，包括序号、事项名称、责任主体、完成时限、备注等字段。要求内容具体、便于对照执行。",
    "报告类材料": "请按照报告类材料结构输出：一、基本情况；二、主要做法和成效；三、存在问题；四、下一步打算。要求数据真实、表述稳妥。",
    "手册类材料": "请按照手册类材料结构输出：一、编制说明；二、适用范围；三、主要内容（分章节）；四、操作流程；五、常见问题解答。要求实用、可操作。",
    "台账类材料": "请按照台账类材料结构输出：以表格形式呈现，包括序号、事项、内容摘要、责任人、时间节点、完成情况、备注。要求记录完整。",
    "仪式物料类材料": "请按照仪式物料类材料结构输出：包括标题、场合说明、主持词/串词、流程节点、音乐/背景建议、注意事项。要求符合场合氛围。",
    "学员手册": "请按照手册类材料结构输出：一、编制说明；二、课程安排；三、学习要求；四、考勤管理；五、生活提示。要求全面、实用。",
    "调研方案": "请按照调研方案结构输出：一、调研目的；二、调研对象和范围；三、调研内容；四、调研方式；五、时间安排；六、人员分工；七、预期成果。要求方案可操作。",
    "调研报告初稿": "请按照调研报告结构输出：一、调研背景和目的；二、调研对象和方法；三、调研发现；四、问题分析；五、对策建议。要求论据充分、分析深入。",
  };
  if (taskType && taskStructureGuidance[taskType]) {
    guidance.push(taskStructureGuidance[taskType]);
  }

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

