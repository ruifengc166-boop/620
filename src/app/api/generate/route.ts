import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/model-router";
import { createGeneration, getAllGenerations, findUserById, loadDB, saveDB, addPointsLog } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/server-auth";
import { checkRequestRateLimit } from "@/lib/rate-limit";

const planLimits: Record<string, number> = { free: 10, pro: 50, expert: 200, admin: 99999 };
const POINTS_PER_GEN = 1;
const ALLOWED_STYLES = new Set(["official", "concise", "promotion", "highlight", "creative"]);
const MAX_INPUT_CHARS = 12000;

function inputSize(input: any) {
  try { return JSON.stringify(input || {}).length; } catch { return MAX_INPUT_CHARS + 1; }
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, msg: "请先登录" }, { status: 401 });

  const limited = checkRequestRateLimit(req, `generate:${session.userId}`, session.role === "admin" ? 120 : 30, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, msg: "生成请求过于频繁，请稍后再试" }, { status: 429, headers: { "Retry-After": String(limited.retryAfter) } });
  }

  try {
    const { mode, task_type, input, cards } = await req.json();
    if (!task_type || !input) return NextResponse.json({ ok: false, msg: "缺少必要参数" }, { status: 400 });
    if (inputSize(input) > MAX_INPUT_CHARS) return NextResponse.json({ ok: false, msg: "输入内容过长，请删减后再试" }, { status: 413 });

    const styleLabels: Record<string, string> = {
      official: "正式稳妥版", concise: "简洁实用版", promotion: "宣传传播版",
      highlight: "亮点提炼版", creative: "创意策划版",
    };
    const requestedStyles = Array.isArray(cards) && cards.length ? cards : ["official"];
    const styles = requestedStyles.filter((s: string) => ALLOWED_STYLES.has(s)).slice(0, 3);
    if (styles.length === 0) styles.push("official");
    const genMode = mode || "official";

    const isAdmin = session.role === "admin";
    const user_id = session.userId;
    let user: any = null;

    if (!isAdmin) {
      user = findUserById(user_id);
      if (!user) return NextResponse.json({ ok: false, msg: "用户不存在，请重新登录" }, { status: 404 });
      const today = new Date().toISOString().slice(0, 10);
      const todayGens = getAllGenerations().filter(g => g.user_id === user_id && g.created_at.startsWith(today));
      const limit = planLimits[user.membership_level] || 10;
      if (todayGens.length >= limit) return NextResponse.json({ ok: false, msg: "今日生成次数已用尽" }, { status: 429 });
      const requiredPoints = styles.length * POINTS_PER_GEN;
      if (user.points_balance < requiredPoints) {
        return NextResponse.json({ ok: false, msg: `积分不足，需要${requiredPoints}点，剩余${user.points_balance}点` }, { status: 402 });
      }
    }

    const results = [];
    for (const style of styles) {
      try {
        const result = await generateContent(genMode as any, task_type, { ...input, output_style: style });
        results.push({
          id: Math.random().toString(36).slice(2, 8),
          title: `${task_type}（${styleLabels[style] || style}）`,
          style, styleLabel: styleLabels[style] || style,
          content: result.content,
          summary: `基于${task_type}任务生成的${styleLabels[style] || style}`,
          riskLevel: "low", provider: result.provider, model: result.model,
        });
        if (!isAdmin) {
          createGeneration({ user_id, task_type, event_type: task_type, generation_mode: genMode, model_provider: result.provider, model_name: result.model, points_used: POINTS_PER_GEN });
          const db = loadDB();
          const uidx = db.users.findIndex((u: any) => u.id === user_id);
          if (uidx >= 0) { db.users[uidx].points_balance = Math.max(0, (db.users[uidx].points_balance || 0) - POINTS_PER_GEN); saveDB(); }
          addPointsLog({ user_id, action_type: "generate", points_change: -POINTS_PER_GEN });
        }
      } catch {
        continue;
      }
    }

    if (results.length === 0) return NextResponse.json({ ok: false, msg: "生成失败，请检查模型配置" }, { status: 500 });
    return NextResponse.json({ ok: true, results });
  } catch {
    return NextResponse.json({ ok: false, msg: "生成失败" }, { status: 500 });
  }
}
