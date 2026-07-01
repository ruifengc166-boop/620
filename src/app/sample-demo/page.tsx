"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type DemoMaterial = { title: string; type: string; summary: string; content: string; riskLevel: "low" | "medium" };
type DemoCase = { id: string; name: string; desc: string; icon: string; input: string[]; materials: DemoMaterial[] };

const cases: DemoCase[] = [
  {
    id: "anti-fraud",
    name: "社区反诈宣传活动",
    desc: "基层社区活动：方案、主持词、新闻稿、推文、总结的典型输出效果",
    icon: "🛡",
    input: ["活动名称：防范电信网络诈骗进社区宣传活动", "地点：XX社区党群广场", "对象：社区居民约200人", "流程：讲座、案例视频、互动问答、资料发放、咨询解答"],
    materials: [
      { type: "活动方案", title: "XX社区防范电信网络诈骗宣传活动方案", summary: "结构完整，含流程、分工、宣传、物料和风险预案", riskLevel: "low", content: `一、活动背景\n为进一步提升社区居民识骗、防骗、拒骗能力，围绕近期高发电信网络诈骗类型，拟在XX社区党群广场开展防范电信网络诈骗进社区宣传活动。\n\n二、活动目的\n通过反诈讲座、案例视频、互动问答和现场咨询，帮助居民识别刷单返利、冒充客服、冒充公检法等常见诈骗方式，提升居民自我保护意识。\n\n三、活动安排\n时间：【待确认】\n地点：XX社区党群广场\n对象：社区居民约200人\n\n四、活动流程\n| 时间 | 环节 | 内容 | 备注 |\n| --- | --- | --- | --- |\n| 活动前30分钟 | 签到引导 | 设置签到台、发放资料 | 会务组负责 |\n| 开场后10分钟 | 主持开场 | 介绍活动背景和出席人员 | 主持人 |\n| 30分钟 | 反诈讲座 | 民警/专员讲解常见案例 | 嘉宾信息待核实 |\n| 15分钟 | 案例视频 | 播放典型反诈视频 | 设备提前测试 |\n| 20分钟 | 互动问答 | 居民提问、现场解答 | 可设置小礼品 |\n| 20分钟 | 资料发放 | 发放宣传折页并提供咨询 | 志愿者协助 |\n\n五、风险与待核实项\n领导姓名、职务、出席人员名单、宣传资料数量和现场照片需人工核实。` },
      { type: "新闻稿", title: "反诈宣传进社区 守好居民“钱袋子”", summary: "新闻稿导语清晰，强调活动事实和后续安排", riskLevel: "low", content: `【待确认日期】，XX社区在党群广场开展防范电信网络诈骗进社区宣传活动，面向辖区居民普及常见诈骗类型和防范知识，进一步增强居民风险识别和自我保护能力。\n\n活动现场设置反诈知识讲座、典型案例视频播放、互动问答、宣传资料发放和咨询解答等环节。工作人员结合刷单返利、冒充客服、虚假投资理财等常见案例，提醒居民不轻信陌生来电、不点击可疑链接、不随意转账汇款。\n\n下一步，XX社区将继续通过居民微信群、入户宣传和线下活动等方式，持续开展反诈宣传，推动防诈知识覆盖更多居民。\n\n【待核实】参与人数、领导姓名、嘉宾职务、现场照片和居民反馈需补充后发布。` },
      { type: "活动总结", title: "XX社区反诈宣传活动总结", summary: "有做法、有成效、有不足、有下一步", riskLevel: "low", content: `一、基本情况\n本次活动围绕防范电信网络诈骗主题，面向社区居民开展宣传讲解、案例展示、互动答疑和资料发放。\n\n二、主要做法\n一是提前通过居民群和公告栏进行宣传发动；二是邀请专业人员结合真实案例开展讲解；三是设置现场咨询和互动问答，提升居民参与度。\n\n三、活动成效\n活动进一步提升了居民对常见诈骗手法的识别能力，为后续社区反诈宣传工作打下基础。具体参与人数、资料发放数量和满意度数据需补充。\n\n四、存在问题与不足\n活动宣传覆盖面、现场问题收集和后续跟进机制仍有优化空间。\n\n五、下一步计划\n持续通过微信群、入户宣传、社区课堂等方式开展常态化反诈宣传。` },
    ],
  },
  {
    id: "waka",
    name: "瓦卡奖分赛场分享会",
    desc: "你的真实业务场景：赛事发动、案例分享、创作者连接和传播材料",
    icon: "🏆",
    input: ["活动名称：瓦卡奖 AI 视觉创作分赛场分享会", "地点：深圳龙岗", "对象：AI视觉创作者、短视频创作者、设计师、内容机构代表", "目的：介绍瓦卡奖征集方向，发动投稿，分享优秀案例，建立本地创作者连接"],
    materials: [
      { type: "活动方案", title: "瓦卡奖 AI 视觉创作分赛场分享会活动方案", summary: "轻量分赛场方案，突出征集发动和创作者连接", riskLevel: "low", content: `一、活动定位\n本次分享会以瓦卡奖作品征集发动和优秀案例交流为核心，面向深圳龙岗及周边 AI 视觉创作者、短视频创作者、设计师和内容机构代表，搭建赛事信息发布、作品案例展示和创作者交流连接平台。\n\n二、活动目标\n1. 介绍瓦卡奖征集方向和参与方式。\n2. 分享优秀 AI 视觉创作案例，帮助创作者理解作品标准。\n3. 发动本地创作者投稿参赛。\n4. 建立分赛场后续交流和作品征集联系机制。\n\n三、建议流程\n签到入场 → 主持开场 → 瓦卡奖介绍 → 获奖/优秀案例分享 → 创作者交流 → 投稿说明 → 合影与自由交流。\n\n四、组织重点\n分赛场活动宜轻量、紧凑、易传播，不宜写成大型展会或复杂合作流程。重点做好报名发动、案例展示、现场拍摄、投稿指引和后续社群承接。\n\n【待核实】嘉宾名单、案例授权、投稿二维码、分赛场合作单位名称需确认。` },
      { type: "公众号推文", title: "AI视觉创作者，来这里看见你的下一件作品", summary: "适合传播和报名发动，带行动引导", riskLevel: "low", content: `如果你正在用 AI 做影像、短片、视觉艺术、广告创意或短剧内容，这场分享会值得关注。\n\n瓦卡奖 AI 视觉创作分赛场分享会将在深圳龙岗举行，现场将介绍瓦卡奖征集方向、作品要求和投稿方式，并通过优秀案例分享，帮助创作者更清楚地理解什么样的作品更适合参与。\n\n本场活动适合：\n- AI视觉创作者\n- 短视频创作者\n- 设计师和导演\n- 内容机构与创意团队\n\n活动亮点：\n一、了解瓦卡奖征集方向\n二、观看优秀作品案例\n三、与本地创作者交流\n四、获取投稿说明和后续连接\n\n报名方式：【待补充】\n活动时间：【待确认】\n活动地点：深圳龙岗【具体地址待确认】\n\n【风险提示】案例展示、嘉宾信息、作品授权和报名二维码需确认后发布。` },
      { type: "主持词", title: "瓦卡奖分赛场分享会主持词", summary: "现场朗读友好，串联自然", riskLevel: "low", content: `各位创作者、各位嘉宾，大家好。欢迎来到瓦卡奖 AI 视觉创作分赛场分享会。\n\n今天这场活动，我们希望用比较轻松但有效的方式，把瓦卡奖的征集方向、优秀案例和投稿方式介绍给大家，也希望让深圳龙岗及周边的 AI 视觉创作者有一个面对面交流的机会。\n\n首先，请允许我简要介绍本次活动背景。【瓦卡奖介绍内容待补充】\n\n接下来进入优秀案例分享环节。我们希望通过具体作品，让大家看到 AI 视觉创作在短片、广告、影像实验和故事表达中的更多可能。\n\n随后是创作者交流和投稿说明环节，也欢迎大家围绕作品方向、工具流程和参赛准备提出问题。\n\n最后，再次感谢大家来到现场。也期待更多优秀作品从这里出发，被更多人看见。` },
    ],
  },
  {
    id: "camp",
    name: "AI精品短剧创作营",
    desc: "创作营招募、开营、课程和成果展示类材料样例",
    icon: "🎬",
    input: ["活动名称：瓦卡奖 AI 精品短剧创作营", "对象：AI视频创作者、短剧创作者、导演、编剧、视觉设计师", "目标：招募学员、完成短剧项目孵化、形成成果展示", "形式：线上课程+线下工作坊+结营展映"],
    materials: [
      { type: "招募推文", title: "瓦卡奖 AI 精品短剧创作营招募文案", summary: "短段落、高吸引力、不过度承诺", riskLevel: "low", content: `AI 短剧不只是工具实验，而是一套新的创作方法。\n\n瓦卡奖 AI 精品短剧创作营面向 AI 视频创作者、短剧创作者、导演、编剧、视觉设计师和内容团队开放招募。创作营将围绕选题开发、故事结构、AI 视觉生成、镜头表达、后期整合和作品打磨，帮助创作者完成可展示、可交流、可参赛的短剧作品。\n\n你将获得：\n1. 系统课程与案例拆解\n2. 导师点评与作品打磨\n3. 创作者社群交流\n4. 结营成果展示机会\n\n报名方式：【待补充】\n开营时间：【待确认】\n名额设置：【待确认】\n\n提示：创作营不承诺商业收益、奖项结果或变现效果，最终作品质量需根据个人投入和项目执行情况确定。` },
      { type: "开营主持词", title: "AI 精品短剧创作营开营仪式主持词", summary: "有仪式感但不过度行政化", riskLevel: "low", content: `各位导师、各位学员、各位创作者，大家好。欢迎来到瓦卡奖 AI 精品短剧创作营开营仪式。\n\n这一次创作营，我们希望把 AI 视频工具、短剧叙事、视觉表达和项目实战结合起来，不只是学习软件操作，而是围绕一个完整作品，从想法、剧本、画面、声音到最终成片进行系统打磨。\n\n接下来，我们将依次介绍创作营安排、导师阵容、课程节奏和作品提交要求。相关导师和课程信息请以现场发布为准。\n\n希望大家在接下来的学习和创作中，保持实验精神，也保持作品意识。工具只是起点，真正重要的是你想表达什么，以及如何把它完成。` },
      { type: "结营总结", title: "AI 精品短剧创作营结营总结", summary: "突出过程、作品、交流和后续计划", riskLevel: "low", content: `一、基本情况\n本次 AI 精品短剧创作营围绕 AI 影像创作和精品短剧项目孵化开展，通过课程学习、案例拆解、作品打磨和成果展示，帮助学员完成从创意到作品的实践训练。\n\n二、主要做法\n一是设置从选题到成片的课程路径；二是组织导师点评和小组交流；三是推动学员围绕具体作品持续优化。\n\n三、阶段成果\n创作营形成了一批短剧项目初稿和视觉片段，具体作品数量、学员名单和展示链接需补充。\n\n四、存在不足\n部分作品在叙事完整度、角色一致性、镜头衔接和声音设计方面仍有提升空间。\n\n五、下一步计划\n后续将继续组织作品复盘、优秀作品展示和瓦卡奖投稿辅导。` },
    ],
  },
];

export default function SampleDemoPage() {
  const [activeSample, setActiveSample] = useState("anti-fraud");
  const [selectedCard, setSelectedCard] = useState<string|null>(null);
  const demo = useMemo(() => cases.find(s => s.id === activeSample) || cases[0], [activeSample]);

  return (
    <div className="container-app py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b]">🎬 样例演示</h1>
        <p className="text-sm text-[#64748b] mt-1">用真实公测场景展示生成效果：社区活动、瓦卡奖分赛场、AI创作营</p>
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">{cases.map(s => <button key={s.id} onClick={() => { setActiveSample(s.id); setSelectedCard(null); }} className={"px-5 py-3 rounded-xl text-sm font-medium transition-all " + (activeSample === s.id ? "bg-[#1a56db] text-white shadow-md" : "bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#94a3b8]")}>{s.icon} {s.name}</button>)}</div>
        <p className="text-xs text-[#64748b]">{demo.desc}</p>
      </div>
      <div className="mb-4 p-4 bg-white border border-[#e2e8f0] rounded-xl">
        <h2 className="font-semibold text-sm mb-2 text-[#1e293b]">用户输入示例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">{demo.input.map((i, idx) => <div key={idx} className="text-xs text-[#475569] bg-[#f8fafc] rounded-lg p-2">{i}</div>)}</div>
      </div>
      <div className="mb-4 p-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e]">以下内容为演示样例，展示材料结构和表达方式。正式使用时，平台会根据用户填写的信息生成定制化初稿，发布前仍需人工审核。</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{demo.materials.map((result, idx) => <div key={result.title} className={"card p-5 border-2 transition-all " + (selectedCard === String(idx) ? "border-[#3b82f6] card-active" : "border-transparent hover:border-[#e2e8f0]")}><div className="flex items-start justify-between mb-3"><span className="tag tag-blue">{result.type}</span><span className={"flex items-center gap-1 text-xs px-2 py-0.5 rounded-full " + (result.riskLevel === "low" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#fffbeb] text-[#92400e]")}><span className={"risk-dot " + result.riskLevel}></span>{result.riskLevel === "low" ? "低风险" : "中风险"}</span></div><h3 className="font-semibold text-sm mb-2 line-clamp-2">{result.title}</h3><p className="text-xs text-[#64748b] mb-3 line-clamp-2">{result.summary}</p><div className="flex gap-1.5 mb-3"><button onClick={() => setSelectedCard(selectedCard === String(idx) ? null : String(idx))} className={"btn-sm text-xs " + (selectedCard === String(idx) ? "btn-primary" : "btn-secondary")}>{selectedCard === String(idx) ? "收起" : "预览"}</button><button className="btn-sm text-xs btn-secondary" onClick={() => { navigator.clipboard.writeText(result.content); alert("已复制"); }}>复制</button></div>{selectedCard === String(idx) && <div className="mt-3 pt-3 border-t border-[#e2e8f0]"><div className="max-h-[400px] overflow-y-auto slim-scrollbar text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">{result.content}</div></div>}</div>)}</div>
      <div className="mt-8 p-5 bg-white rounded-xl border border-[#e2e8f0] text-center"><h3 className="font-semibold text-sm mb-2">💡 想亲自试一试？</h3><p className="text-xs text-[#64748b] mb-4">选择您需要的任务或活动模板，填写信息，一键生成多版本材料</p><div className="flex flex-col sm:flex-row gap-3 justify-center"><Link href="/quick-write" className="btn-primary text-sm">去写一个材料</Link><Link href="/run-activity" className="btn-secondary text-sm">去办一场活动</Link><Link href="/contact" className="btn-secondary text-sm">申请机构试用</Link></div></div>
    </div>
  );
}
