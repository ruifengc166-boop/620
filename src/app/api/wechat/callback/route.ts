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
  const content = parseXmlValue(xml, "Content");

  if (!fromUser || !toUser) return new NextResponse("success", { status: 200 });

  if (msgType === "event" && event.toLowerCase() === "subscribe") {
    return new NextResponse(textReply(fromUser, toUser, "欢迎关注办会助理。请回到网站“我的账户”生成绑定码，然后在公众号回复绑定码，例如：BH123456，即可自动领取内测生成额度。"), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  }

  if (msgType === "text") {
    const code = extractBindCode(content);
    if (!code) {
      return new NextResponse(textReply(fromUser, toUser, "请回复网站生成的绑定码，例如：BH123456。绑定成功后会自动增加内测生成额度。"), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
    }
    const result = bindWechatByCode(code, fromUser);
    return new NextResponse(textReply(fromUser, toUser, result.msg), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
  }

  return new NextResponse("success", { status: 200 });
}
