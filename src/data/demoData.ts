export interface GenerationResult {
  id: string;
  title: string;
  style: string;
  styleLabel: string;
  content: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
}

export const demoAntiFraud: GenerationResult[] = [
  {
    id: "v1",
    title: "XX社区反诈宣传活动方案（正式稳妥版）",
    style: "official",
    styleLabel: "正式稳妥版",
    content: `# XX社区反诈宣传活动方案\n\n## 一、活动背景\n近期，XX社区辖区内电信网络诈骗案件呈上升趋势，部分居民特别是老年群体防范意识薄弱，遭受财产损失的情况时有发生。为切实提升居民防诈骗意识和能力，守护群众财产安全，特制定本方案。\n\n## 二、活动目的\n1. 提高居民对常见诈骗手法的识别能力\n2. 增强居民自我保护意识\n3. 构建社区防诈骗安全防线\n4. 营造全民反诈的良好氛围\n\n## 三、活动主题\n"守护钱袋子 反诈进社区"\n\n## 四、组织单位\n主办单位：XX街道办事处\n承办单位：XX社区居委会、XX派出所\n协办单位：XX银行XX支行\n\n## 五、时间地点\n时间：2026年7月15日（周六）上午9:00-11:30\n地点：XX社区党群服务中心三楼会议室\n\n## 六、参与对象\nXX社区居民，特别是中老年群体（预计100-150人）\n\n## 七、活动流程\n1. 9:00-9:10 开场致辞（社区书记）\n2. 9:10-9:40 反诈知识讲座（派出所民警）\n3. 9:40-10:00 案例分享与互动问答\n4. 10:00-10:30 反诈情景模拟演练\n5. 10:30-11:00 银行工作人员讲解金融反诈知识\n6. 11:00-11:20 反诈知识有奖问答\n7. 11:20-11:30 总结发言\n\n## 八、职责分工\n（待补充具体负责人）\n\n## 九、宣传安排\n1. 活动前三天通过社区微信群发布通知\n2. 在各小区公告栏张贴宣传海报\n3. 活动当天在社区门口设置宣传点\n\n## 十、物料准备\n1. 反诈宣传单页 200份\n2. 反诈知识手册 150份\n3. 小礼品（纸巾、环保袋）100份\n4. 投影设备、音响\n\n## 十一、风险预案\n1. 如遇大雨，活动转为室内进行\n2. 安排1名医护人员值守\n\n## 十二、待补充信息\n- 具体负责人名单【待核实】\n- 活动预算金额【待补充】\n- 派出所民警具体安排【待确认】`,
    summary: "完整活动方案，包括背景、主题、流程、分工、物料和预案",
    riskLevel: "low"
  },
  {
    id: "v2",
    title: "XX社区反诈宣传活动方案（简洁实用版）",
    style: "concise",
    styleLabel: "简洁实用版",
    content: `# XX社区反诈宣传活动方案（简洁版）\n\n一、时间：2026年7月15日（周六）上午9:00-11:30\n二、地点：XX社区党群服务中心三楼会议室\n三、主题："守护钱袋子 反诈进社区"\n四、对象：社区居民（重点面向中老年群体）\n五、流程：\n  1. 社区书记开场致辞（10分钟）\n  2. 民警反诈知识讲座（30分钟）\n  3. 案例分享和问答（20分钟）\n  4. 反诈情景模拟演练（30分钟）\n  5. 银行反诈知识讲解（30分钟）\n  6. 有奖问答互动（20分钟）\n  7. 总结\n六、宣传：微信群通知+公告栏海报\n七、物料：宣传单页200份、小礼品100份\n\n【待补充】负责人、预算、民警安排`,
    summary: "简洁版方案，重点突出，快速上手",
    riskLevel: "low"
  },
  {
    id: "v3",
    title: "XX社区反诈宣传活动方案（亮点提炼版）",
    style: "highlight",
    styleLabel: "亮点提炼版",
    content: `# XX社区反诈宣传活动特色亮点\n\n## 亮点一：警民联动，真实案例教学\n邀请派出所民警以近期辖区内真实案例为素材，以案说法，让居民感同身受。\n\n## 亮点二：情景模拟，沉浸式体验\n设置"接到诈骗电话该怎么办""银行转账劝阻"等模拟场景，居民现场演练，民警点评指导。\n\n## 亮点三：银行专业参与，金融反诈防线的延伸\nXX银行工作人员讲解识别钓鱼短信、保护银行卡信息安全等实用知识。\n\n## 亮点四：有奖互动，增加参与积极性\n反诈知识有奖问答环节，寓教于乐，巩固学习效果。\n\n## 宣传推广建议\n- 活动前后拍摄短视频，在视频号和微信群传播\n- 制作活动海报和反诈口诀卡片在社区长期张贴\n- 将优秀案例制作成社区反诈宣传册`,
    summary: "提炼活动特色亮点，适合宣传推广",
    riskLevel: "low"
  },
  {
    id: "v4",
    title: "XX社区反诈宣传活动方案（创意策划版）",
    style: "creative",
    styleLabel: "创意策划版",
    content: `# XX社区反诈宣传——创意策划方案\n\n## 创意一：反诈闯关游戏\n设计"反诈大闯关"游戏：设置3-5个关卡（识别诈骗电话、辨别真假警察、拦截转账等），居民完成所有关卡获得"反诈卫士"证书和小礼品。\n\n## 创意二：反诈情景短剧\n由社区工作人员和志愿者编排5分钟反诈短剧，用生动幽默的方式呈现常见诈骗场景。\n\n## 创意三：反诈承诺墙\n设置"我承诺 不被骗"签名墙，居民签名打卡并拍照分享朋友圈。\n\n## 创意四：反诈知识拼图\n将反诈要点设计成拼图游戏，适合家庭参与。\n\n## 创意五：银发专属反诈课堂\n针对老年人开设"银发反诈课堂"，用方言讲解，配合大字版折页，提供一对一咨询。\n\n【待核实】具体实施方案的可行性、所需额外预算`,
    summary: "创意策划版，新颖有趣，参与感强",
    riskLevel: "medium"
  },
];

export const policyPromotion: GenerationResult[] = [
  {
    id: "v1",
    title: "XX街道惠企政策宣讲会活动方案（正式稳妥版）",
    style: "official",
    styleLabel: "正式稳妥版",
    content: `# XX街道惠企政策宣讲会活动方案

## 一、活动背景
为深入贯彻落实XX区关于优化营商环境、支持企业发展的决策部署，帮助辖区企业全面了解和用好各项惠企政策，打通政策落地"最后一公里"，特举办本次惠企政策宣讲会。

## 二、活动目的
1. 向企业系统宣讲最新惠企政策
2. 帮助企业理解政策申报条件和流程
3. 收集企业诉求和建议
4. 建立政企常态化沟通机制

## 三、活动主题
"政策直通车 服务零距离"

## 四、组织单位
主办单位：XX街道办事处
协办单位：XX区发展和改革局、XX区商务局、XX区税务局

## 五、时间地点
时间：2026年8月20日（周五）14:30-17:00
地点：XX街道办事处二楼大会议室

## 六、参与对象
辖区重点企业负责人、财务负责人（预计80-100人）

## 七、活动流程
1. 14:30-14:40 开场致辞（街道办事处主任）
2. 14:40-15:10 惠企政策解读（区发改局）
3. 15:10-15:40 税收优惠政策讲解（区税务局）
4. 15:40-16:00 茶歇与自由交流
5. 16:00-16:30 企业问答互动环节
6. 16:30-16:50 企业诉求收集
7. 16:50-17:00 总结发言

## 八、职责分工
（待补充具体负责人）

## 九、待核实信息
- 具体惠企政策条款请以正式文件为准【待核实】
- 参会企业名单【待确认】
- 场地布置与费用【待补充】`,
    summary: "完整的政策宣讲会活动方案",
    riskLevel: "low"
  },
  {
    id: "v2",
    title: "XX街道惠企政策宣讲会会议通知（正式版）",
    style: "concise",
    styleLabel: "简洁实用版",
    content: `# 关于举办惠企政策宣讲会的通知

各有关企业：

为帮助辖区企业全面了解和用好惠企政策，街道办事处定于2026年8月20日举办惠企政策宣讲会。现将有关事项通知如下：

一、时间：2026年8月20日（周五）14:30-17:00
二、地点：XX街道办事处二楼大会议室
三、参会人员：企业负责人、财务负责人
四、会议内容：
  1. 惠企政策解读
  2. 税收优惠政策讲解
  3. 现场答疑与诉求收集
五、报名方式：请于8月18日前扫描附件二维码报名

联系人：张XX  电话：XXX-XXXXXXXX

XX街道办事处
2026年8月X日

【微信群简版】
通知：8月20日（周五）下午2:30在街道办二楼大会议室举办惠企政策宣讲会，现场解读最新惠企政策和税收优惠，欢迎各企业负责人和财务负责人参加。请于8月18日前扫码报名。`,
    summary: "正式通知+微信群简版",
    riskLevel: "low"
  },
  {
    id: "v3",
    title: "XX街道惠企政策宣讲会主持词（正式版）",
    style: "promotion",
    styleLabel: "宣传传播版",
    content: `# XX街道惠企政策宣讲会主持词

尊敬的各位领导、各位企业家朋友：

大家下午好！

今天，我们在这里隆重举办XX街道惠企政策宣讲会。首先，我代表街道办事处，对各位企业家朋友的到来表示热烈的欢迎！对各协办单位的大力支持表示衷心的感谢！

## 一、活动背景介绍

本次宣讲会旨在帮助辖区企业深入了解和用好各项惠企政策，推动政策落地见效，助力企业高质量发展。

## 二、介绍出席领导

今天出席宣讲会的领导有：
XX街道办事处XXX主任
XX区发展和改革局XXX科长
XX区税务局XXX科长
（【待核实】完整名单）

## 三、会议议程

第一项议程：请街道办事处XXX主任致辞。
第二项议程：请区发改局XXX科长解读惠企政策。
第三项议程：请区税务局XXX科长讲解税收优惠政策。
第四项议程：茶歇与自由交流。
第五项议程：企业问答互动环节。
第六项议程：企业诉求收集。

## 四、结束语

各位企业家朋友，XX街道将始终与大家携手同行，以更优的服务、更实的举措，为企业发展创造更好的营商环境。

谢谢大家！

（【待核实】领导姓名和职务请根据实际情况确认）`,
    summary: "完整主持词，含开场白、串词和结束语",
    riskLevel: "medium"
  },
];

export const investmentPromotion: GenerationResult[] = [
  {
    id: "v1",
    title: "XX园区招商推介会活动方案（正式稳妥版）",
    style: "official",
    styleLabel: "正式稳妥版",
    content: `# XX园区2026年招商推介会活动方案\n\n## 一、活动背景\n为深入贯彻落实XX区委区政府关于"产业强区"的战略部署，进一步扩大XX园区的知名度和影响力，吸引优质企业和项目落地，特举办本次招商推介会。\n\n## 二、活动目的\n1. 展示园区产业优势和营商环境\n2. 对接重点企业投资意向\n3. 推动在谈项目加速签约\n4. 建立企业投资信心\n\n## 三、活动主题\n"智汇XX 共创未来"\n\n## 四、组织单位\n主办：XX园区管理委员会\n协办：XX区投资促进局、XX区商务局\n\n## 五、时间地点\n时间：2026年8月8日（周六）14:30-17:30\n地点：XX园区会议中心二楼报告厅\n\n## 六、参与对象\n1. 重点目标企业负责人 50家\n2. 行业协会代表\n3. 金融机构代表\n4. 媒体记者\n（预计总人数120人）\n\n## 七、活动流程\n（详见流程表）\n\n## 八、职责分工\n（待补充）\n\n## 九、预算\n（待补充）\n\n## 十、待核实信息\n- 拟邀请企业名单【待确认】\n- 具体领导出席情况【待确认】\n- 场地布置费用【待补充】`,
    summary: "完整的招商推介会方案",
    riskLevel: "low"
  },
  {
    id: "v2",
    title: "XX园区招商推介稿（宣传传播版）",
    style: "promotion",
    styleLabel: "宣传传播版",
    content: `# 遇见XX 共赢未来\n——XX园区招商推介稿\n\n尊敬的各位企业家朋友：\n\n大家好！\n\n今天，我们相聚在这里，共同开启一场关于机遇与未来的对话。XX园区，正以开放的姿态、优越的环境和无限的可能，等待各位企业家的到来。\n\n## 为什么选择XX园区？\n\n**区位优势：** 地处XX城市核心发展轴，距高铁站仅15分钟车程，交通便利，辐射XX经济圈。\n\n**产业集聚：** 已形成新一代信息技术、高端装备制造、生物医药三大主导产业，聚集了XX家规上企业。\n\n**政策支持：** 新入驻企业可享受"三免两减半"租金优惠、人才引进补贴最高XX万元、科技创新奖励等一揽子政策。\n\n**营商环境：** "一站式"政务服务窗口，企业开办全流程不超过1个工作日。\n\n## 我们期待与您合作\n\n今日选择XX，明日收获未来。我们承诺以最真诚的态度、最高效的服务、最优越的政策，为每一位投资者创造价值。\n\n让我们携手并进，共创美好明天！\n\n【待核实】具体政策数据和奖励金额请以正式文件为准`,
    summary: "有感染力的招商推介演讲稿",
    riskLevel: "low"
  },
];

export function getSampleData(key: string): GenerationResult[] {
  const map: Record<string, GenerationResult[]> = {
    "anti-fraud": demoAntiFraud,
    "policy": policyPromotion,
    "investment": investmentPromotion,
  };
  return map[key] || demoAntiFraud;
}

export function generateRiskCheckResult(content: string) {
  const risks: { type: string; text: string; reason: string; suggestion: string; requiresHumanReview: boolean }[] = [];
  const pendingVerification: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";
  let highRiskFound = false;
  let mediumRiskFound = false;

  const sensitiveKeywords = [
    { words: ["绝密", "机密", "秘密"], type: "泄密风险", suggestion: "涉密信息严禁上传本平台，请立即删除相关内容。", human: true, high: true },
    { words: ["内部资料", "不得外传", "内部传阅"], type: "泄密风险", suggestion: "内部资料请勿上传。如需使用，请先脱敏处理。", human: true, high: true },
    { words: ["领导批示"], type: "泄密风险", suggestion: "领导批示属内部信息，请删除或脱敏。", human: true, high: true },
    { words: ["身份证"], type: "个人隐私风险", suggestion: "身份证号属个人敏感信息，请脱敏处理（如：****1234）。", human: true, high: true },
    { words: ["手机号"], type: "个人隐私风险", suggestion: "批量手机号可能涉及个人隐私。", human: true, high: true },
    { words: ["住宅地址", "家庭住址", "具体地址"], type: "个人隐私风险", suggestion: "具体住址信息建议脱敏为「某社区」或「某片区」。", human: true, high: true },
  ];

  const mediumKeywords = [
    { words: ["最", "第一", "首个", "唯一"], type: "夸大宣传", suggestion: "绝对化表述可能违反广告法，建议修改或加限定条件。", human: false },
    { words: ["效果显著", "多方好评", "一致认可"], type: "事实数据风险", suggestion: "此类模糊表述需补充具体数据和来源。", human: false },
  ];

  // Additional high-risk patterns (会议纪要, 未公开, 居民名单, 学生名单, 银行账号, 投诉举报, 患者, 企业财务)
  const extraSensitive = [
    { pattern: /会议纪要/g, type: "泄密风险", suggestion: "内部会议纪要请勿上传。如需参考，请先脱敏处理。", human: true },
    { pattern: /未公开/g, type: "泄密风险", suggestion: "未公开信息请勿上传。如需使用请先核实可否公开。", human: true },
    { pattern: /居民名单|学生名单/g, type: "个人隐私风险", suggestion: "人员名单涉及个人信息保护，请删除或脱敏。", human: true },
    { pattern: /银行账号|银行卡/g, type: "个人隐私风险", suggestion: "银行账号属个人敏感信息，请脱敏处理。", human: true },
    { pattern: /投诉举报/g, type: "个人隐私风险", suggestion: "投诉举报人信息受法律保护，严禁上传。", human: true, high: true },
    { pattern: /患者|病历/g, type: "个人隐私风险", suggestion: "医疗健康信息属高度敏感信息，严禁上传。", human: true, high: true },
    { pattern: /企业财务|营业收入|利润表/g, type: "商业秘密风险", suggestion: "企业财务数据可能涉及商业秘密，请脱敏。", human: true },
  ];

  for (const s of extraSensitive) {
    if (s.pattern.test(content)) {
      risks.push({ type: s.type, text: "检测到疑似敏感内容", reason: "检测到可能包含" + s.type + "的内容", suggestion: s.suggestion, requiresHumanReview: s.human });
      if ((s as any).high) highRiskFound = true;
      mediumRiskFound = true;
    }
  }

  for (const kw of sensitiveKeywords) {
    for (const word of kw.words) {
      if (content.includes(word)) {
        risks.push({ type: kw.type, text: `包含"${word}"`, reason: `检测到疑似${kw.type}关键词"${word}"`, suggestion: kw.suggestion, requiresHumanReview: kw.human });
        if (kw.high) highRiskFound = true;
        mediumRiskFound = true;
        break;
      }
    }
  }

  for (const kw of mediumKeywords) {
    for (const word of kw.words) {
      if (content.includes(word)) {
        risks.push({ type: kw.type, text: `包含"${word}"`, reason: `检测到"${word}"等绝对化或模糊表述`, suggestion: kw.suggestion, requiresHumanReview: kw.human });
        mediumRiskFound = true;
        break;
      }
    }
  }

  pendingVerification.push("参与人数【待核实】");
  pendingVerification.push("领导姓名和职务【待确认】");
  pendingVerification.push("政策依据需核对原文【建议核实】");
  pendingVerification.push("涉及金额和数据的部分【建议核实】");

  if (highRiskFound) riskLevel = "high";
  else if (mediumRiskFound) riskLevel = "medium";

  return { riskLevel, risks, pendingVerification };
}

export interface RiskCheckInfo {
  riskLevel: "low" | "medium" | "high";
  risks: { type: string; text: string; reason: string; suggestion: string; requiresHumanReview: boolean }[];
  pendingVerification: string[];
}
