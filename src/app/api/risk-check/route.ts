import { NextRequest, NextResponse } from "next/server";

function sanitize(input: string): string {
  // Strip HTML tags and script injections
  return input.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { content, usage_context } = await req.json();
    if (!content) return NextResponse.json({ ok: false, msg: "请粘贴材料内容" }, { status: 400 });
    
    // Sanitize input to prevent XSS
    const safe = sanitize(content);

    const risks: any[] = [];
    const pendingVerif = [];
    let riskLevel = "low";
    let highFound = false, medFound = false;

    const sensitive = [
      { words: ["绝密", "机密", "秘密"], type: "泄密风险", human: true },
      { words: ["内部资料", "不得外传", "内部传阅"], type: "泄密风险", human: true },
      { words: ["领导批示"], type: "泄密风险", human: true },
    ];
    for (const s of sensitive) {
      for (const w of s.words) {
        if (safe.includes(w)) {
          risks.push({ type: s.type, text: w, reason: "检测到疑似" + s.type + "关键词", suggestion: "请立即删除或脱敏", requiresHumanReview: s.human }); highFound = true; break;
        }
      }
    }
    if (/居民名单|银行账号|投诉举报|患者|病历/.test(safe)) { risks.push({ type: "个人隐私风险", text: "检测到敏感信息", reason: "可能包含个人敏感信息", suggestion: "请脱敏处理", requiresHumanReview: true }); highFound = true; }
    if (/效果显著|多方好评|一致认可|最|第一|首个|唯一|顶级/.test(safe)) { risks.push({ type: "夸大表述", text: "检测到绝对化表述", reason: "可能违反广告法", suggestion: "建议修改或加限定条件", requiresHumanReview: false }); medFound = true; }

    pendingVerif.push("参与人数【待核实】", "领导姓名和职务【待确认】", "政策依据需核对原文【建议核实】");

    if (highFound) riskLevel = "high";
    else if (medFound || risks.length > 0) riskLevel = "medium";

    return NextResponse.json({ ok: true, riskLevel, risks, pendingVerification: pendingVerif });
  } catch (e: any) { return NextResponse.json({ ok: false, msg: "检查失败" }, { status: 500 }); }
}

