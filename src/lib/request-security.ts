import { NextRequest } from "next/server";

function splitAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
}

export function isSameOriginRequest(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("host");

    const candidates = new Set<string>();
    candidates.add(req.nextUrl.origin);
    if (host) candidates.add(`${req.nextUrl.protocol}//${host}`);
    if (forwardedHost) candidates.add(`${forwardedProto}://${forwardedHost}`);
    for (const allowed of splitAllowedOrigins()) candidates.add(allowed);

    for (const candidate of candidates) {
      try {
        const candidateUrl = new URL(candidate);
        if (originUrl.origin === candidateUrl.origin) return true;
      } catch {}
    }
    return false;
  } catch {
    return false;
  }
}
