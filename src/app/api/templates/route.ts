import { NextResponse } from "next/server";

const templates = [
  { id: "policy_promotion", name: "政策宣讲会", category: "党政机关活动", description: "面向群众或企业进行政策解读宣讲", materialCount: 10, priority: "P0" },
  { id: "work_promotion", name: "工作推进会", category: "党政机关活动", description: "推动重点工作落实的会议活动", materialCount: 10, priority: "P0" },
  { id: "community_practice", name: "社区文明实践活动", category: "社区活动", description: "社区开展新时代文明实践主题活动", materialCount: 10, priority: "P0" },
  { id: "investment_promotion", name: "招商推介会", category: "招商产业活动", description: "面向企业开展招商引资推介", materialCount: 10, priority: "P0" },
];

export async function GET() {
  return NextResponse.json({ ok: true, templates });
}

