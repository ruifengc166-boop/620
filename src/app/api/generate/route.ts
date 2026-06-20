import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/model-router";
import { createGeneration, getAllGenerations, findUserById, findUserByEmail, loadDB, saveDB, addPointsLog } from "@/lib/db";

const planLimits: Record<string, number> = { free: 10, pro: 50, expert: 200, admin: 99999 };
const POINTS_PER_GEN = 1;

export async function POST(req: NextRequest) {
  try {
    const { mode, task_type, input, cards, user_id } = await req.json();
    if (!task_type || !input) return NextResponse.json({ ok: false, msg: "缺少必要参数" }, { status: 400 });

    // Check daily usage limit and deduct points if user_id provided
    if (user_id) {
      const user = findUserById(user_id);
      if (!user) return NextResponse.json({ ok: false, msg: "用户不存在" }, { status: 404 });
      
      const today = new Date().toISOString().slice(0, 10);
      const todayGens = getAllGenerations().filter(g => g.user_id === user_id && g.created_at.startsWith(today));
      const limit = planLimits[user.membership_level] || 10;
      
      if (todayGens.length >= limit) {
        return NextResponse.json({ ok: false, msg: "今日生成次数已用尽，请明天再来或升级套餐" }, { status: 429 });
      }

      // Check and deduct points
      if (user.points_balance < POINTS_PER_GEN) {
        return NextResponse.json({ ok: false, msg: "积分不足，请充值或升级套餐获取更多积分" }, { status: 402 });
      }
    }

    const results = [];
    // Limit to first 3 modes to avoid timeout on slower APIs
    const modes = (cards || [mode || "official"]).slice(0, 3);

    for (const m of modes) {
      try {
        const result = await generateContent(m as any, task_type, input);
        results.push({
          id: Math.random().toString(36).slice(2, 8),
          title: `${task_type}（${m}模式）`,
          style: m, styleLabel: m,
          content: result.content,
          summary: `基于${task_type}任务，使用${result.provider}模型生成`,
          riskLevel: "low", provider: result.provider, model: result.model,
        });
        if (user_id) {
          createGeneration({ user_id, task_type, event_type: task_type, generation_mode: m, model_provider: result.provider, model_name: result.model, points_used: POINTS_PER_GEN });
          const db = loadDB();
          const uidx = db.users.findIndex((u: any) => u.id === user_id);
          if (uidx >= 0) {
            db.users[uidx].points_balance = Math.max(0, (db.users[uidx].points_balance || 0) - POINTS_PER_GEN);
            saveDB();
          }
          addPointsLog({ user_id, action_type: "generate", points_change: -POINTS_PER_GEN });
        }
      } catch (e) {
        // Skip failed modes, continue with next
        continue;
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json({ ok: false, msg: "生成失败" }, { status: 500 });
  }
}