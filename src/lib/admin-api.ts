"use client";

export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const sessionStr = typeof window !== "undefined" ? localStorage.getItem("banhui_session") : null;
  let email = "";
  if (sessionStr) {
    try { email = JSON.parse(sessionStr).email || ""; } catch {}
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (email) {
    headers["x-admin-auth"] = email;
  }
  // Copy any existing Content-Type from options
  if (options?.headers) {
    const existing = options.headers as Record<string, string>;
    if (existing["Content-Type"]) headers["Content-Type"] = existing["Content-Type"];
    if (existing["content-type"]) headers["content-type"] = existing["content-type"];
  }
  return fetch(url, { ...options, headers });
}