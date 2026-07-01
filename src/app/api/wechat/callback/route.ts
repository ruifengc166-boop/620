import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { bindWechatByCode } from "@/lib/wechat-binding";

function xmlEscape(s: string) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function parseXmlValue(xml: string, tag: string) {
  const reg = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(reg);
  return m ? (m[1] || m[2] || "").trim() : "";
}

function verifyWechatSignature(searchParams: URLSearchParams) {
  const token = process.env.WECHAT_TOKEN;
  if (!token) return false;
  const signature = searchParams.get("signature") || "";
  const timestamp = searchParams.get("timestamp") || "";
  const nonce = searchParams.get("nonce") || "";
  const raw = [token, timestamp, nonce].sort().join("");
  const digest = crypto.createHash("sha1").update(raw).digest("hex");
  return digest === signature;
}

function textReply(toUser: string, fromUser: string, content: string) {
  const now = Math.floor(Date.now() / 1000);
  return `<xml><ToUserName><![CDATA[${xmlEscape(toUser)}]]></ToUserName><FromUserName><![CDATA[${xmlEscape(fromUser)}]]></FromUserName><CreateTime>${now}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${xmlEscape(content)}]]></Content></xml>`;
}

function extractBindCode(text: string) {
  const normalized = String(text || "").trim().toUpperCase();
  const match = normalized.match(/BH[A-Z0-9]{6}/);
  return match ? match[0] : "";
}

function publicTestReply() {
  return [
    "欢迎体验「办会助理」免费公测。",
    "",
    "这是一个给活动组织者用的 AI 办会材料助手，可以一次生成：活动方案、主持词、新闻稿、公众号推文、活动总结、任务分工表等材料。",
    "",
    "免费公测入口：",
    "https://www.banhuizhuli.cn/beta",
    "",
    "使用方式：",
    "1. 注册账号，获得基础体验额度",
    "2. 进入“我的账户”生成绑定码",
    "3. 回公众号回复绑定码，自动解锁更多生成额度",
    "",
    "提示：生成内容为 AI 初稿，正式发布前请人工审核。",
  ].join("\n");
}

function quotaReply() {
  return [
    "如何解锁更多生成额度：",
    "",
    "1. 登录办会助理网站",
    "2. 进入“我的账户”",
    "3. 点击“生成绑定码”",
    "4. 回到公众号回复 BH 开头的绑定码",
    "5. 系统会自动为账号增加内测生成额度",
    "",
    "入口：",
    "https://www.banhuizhuli.cn/account",
  ].join("\n");
}

function templateReply() {
  return [
    "办会助理目前支持这些常用材料：",
    "",
    "1. 活动方案",
    "2. 主持词",
    "3. 新闻稿",
    "4. 公众号推文",
    "5. 活动总结",
    "6. 任务分工表",
    "7. 活动流程表",
    "8. 邀请函",
    "",
    "材料包库入口：",
    "https://www.banhuizhuli.cn/templates",
    "",
    "也可以直接回复「办会」进入免费公测。",
  ].join("\n");
}

function activityPlanReply() {
  return [
    "想生成活动方案，可以直接进入：",
    "https://www.banhuizhuli.cn/quick-write/task?id=activity_plan",
    "",
    "建议准备这些信息：",
    "活动名称、时间地点、主办单位、参与对象、活动目的、主要流程、预计人数。",
  ].join("\n");
}

function newsReply() {
  return [
    "想生成新闻稿，可以直接进入：",
    "https://www.banhuizhuli.cn/quick-write/task?id=news_release",
    "",
    "建议准备这些信息：",
    "活动名称、时间地点、出席人员、活动亮点、现场环节、后续安排。",
  ].join("\n");
}

function summaryReply() {
  return [
    "想生成活动总结，可以先进入免费公测：",
    "https://www.banhuizhuli.cn/beta",
    "",
    "建议准备这些信息：",
    "活动基本情况、主要做法、参与人数、现场成效、存在不足、下一步计划。",
  ].join("\n");
}

function resolveKeywordReply(text: string) {
  const t = String(text || "").trim().toLowerCase();
  if (!t) return publicTestReply();
  if (["办会", "公测", "试用", "开始", "入口"].some(k => t.includes(k))) return publicTestReply();
  if (["额度", "绑定", "加额度", "次数"].some(k => t.includes(k))) return quotaReply();
  if (["模板", "材料包", "材料"].some(k => t.includes(k))) return templateReply();
  if (["活动方案", "方案"].some(k => t.includes(k))) return activityPlanReply();
  if (["新闻稿", "通稿", "新闻"].some(k => t.includes(k))) return newsReply();
  if (["总结", "活动总结"].some(k => t.includes(k))) return summaryReply();
  return publicTestReply();
}

function resolveClickMenuReply(eventKey: string) {
  const key = String(eventKey || "").trim().toUpperCase();
  if (["FREE_BETA", "PUBLIC_TEST", "BETA", "MENU_BETA"].includes(key)) return publicTestReply();
  if (["MATERIAL_TEMPLATES", "TEMPLATES", "MENU_TEMPLATES"].includes(key)) return templateReply();
  if (["BIND_QUOTA", "QUOTA", "BIND", "MENU_QUOTA"].includes(key)) return quotaReply();
  return publicTestReply();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (!verifyWechatSignature(url.searchParams)) return new NextResponse("forbidden", { status: 403 });
  return new NextResponse(url.searchParams.get("echostr") || "", { status: 200 });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  if (!verifyWechatSignature(url.searchParams)) return new NextResponse("forbidden", { status: 403 });

  const xml = await req.text();
  const toUser = parseXmlValue(xml, "ToUserName");
  const fromUser = parseXmlValue(xml, "FromUserName");
  const msgType = parseXmlValue(xml, "MsgType");
  const event = parseXmlValue(xml, "Event");
  const eventKey = parseXmlValue(xml, "EventKey");
  const content = parseXmlValue(xml, "Content");

  if (!fromUser || !toUser) return new NextResponse("success", { status: 200 });

  if (msgType === "event" && event.toLowerCase() === "subscribe") {
    return new NextResponse(textReply(fromUser, toUser, "欢迎关注「办会助理」。\n\n如果你经常要写活动方案、主持词、新闻稿、公众号推文、活动总结，可以回复「办会」进入免费公测。\n\n注册后进入“我的账户”生成绑定码，再回公众号回复绑定码，即可自动获得更多生成额度。"), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  }

  if (msgType === "event" && event.toLowerCase() === "click") {
    return new NextResponse(textReply(fromUser, toUser, resolveClickMenuReply(eventKey)), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  }

  if (msgType === "text") {
    const code = extractBindCode(content);
    if (code) {
      const result = bindWechatByCode(code, fromUser);
      return new NextResponse(textReply(fromUser, toUser, result.msg), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
    }
    return new NextResponse(textReply(fromUser, toUser, resolveKeywordReply(content)), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  }

  return new NextResponse("success", { status: 200 });
}
