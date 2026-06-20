"use client";

export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const sessionStr = typeof window !== "undefined" ? localStorage.getItem("banhui_session") : null;
  let email = "";
  if (sessionStr) {
    try { email = JSON.parse(sessionStr).email || ""; } catch {}
  }
  // Fallback: if banhui_admin flag is set, use admin email directly
  if (!email && typeof window !== "undefined" && localStorage.getItem("banhui_admin") === "1") {
    email = "admin@banhui.com";
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (email) {
    headers["x-admin-auth"] = email;
  }
  if (options?.headers) {
    const existing = options.headers as Record<string, string>;
    if (existing["Content-Type"]) headers["Content-Type"] = existing["Content-Type"];
  }
  return fetch(url, { ...options, headers });
}