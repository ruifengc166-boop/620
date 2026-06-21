import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/model-router";
import { createGeneration, getAllGenerations, findUserById, findUserByEmail, loadDB, saveDB, addPointsLog } from "@/lib/db";

const planLimits: Record<string, number> = { free: 10, pro: 50, expert: 200, admin: 99999 };
const POINTS_PER_GEN = 1;

export async function POST(req: NextRequest) {
  try {
    const { mode, task_type, input, cards, user_id } = await req.json();
    if (!task_type || !input) return NextResponse.json({ ok: false, msg: "缺少必要参数" }, { status: 400 });

    const styleLabels: Record<string, string> = {
      official: "正式稳妥版", concise: "简洁实用版", promotion: "宣传传播版",
      highlight: "亮点提炼版", creative: "创意策划版",
    };
    const styles = (cards || ["official"]).slice(0, 2);
    const genMode = mode || "official";

    // Admin user check + quota + points
    const isAdmin = user_id === "admin";
    if (user_id && !isAdmin) {
      const user = findUserById(user_id);
      if (!user) {
        return NextResponse.json({ ok: false, msg: "用户不存在，请重新登录" }, { status: 404 });
      }
      const today = new Date().toISOString().slice(0, 10);
      const todayGens = getAllGenerations().filter(g => g.user_id === user_id && g.created_at.startsWith(today));
      const limit = planLimits[user.membership_level] || 10;
      if (todayGens.length >= limit) {
        return NextResponse.json({ ok: false, msg: "今日生成次数已用尽" }, { status: 429 });
      }
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
        if (user_id && !isAdmin) {
          createGeneration({ user_id, task_type, event_type: task_type, generation_mode: genMode, model_provider: result.provider, model_name: result.model, points_used: POINTS_PER_GEN });
          const db = loadDB();
          const uidx = db.users.findIndex((u: any) => u.id === user_id);
          if (uidx >= 0) { db.users[uidx].points_balance = Math.max(0, (db.users[uidx].points_balance || 0) - POINTS_PER_GEN); saveDB(); }
          addPointsLog({ user_id, action_type: "generate", points_change: -POINTS_PER_GEN });
        }
      } catch (e) { continue; }
    }

    if (results.length === 0) return NextResponse.json({ ok: false, msg: "生成失败，请检查模型配置" }, { status: 500 });
    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json({ ok: false, msg: "生成失败" }, { status: 500 });
  }
}
