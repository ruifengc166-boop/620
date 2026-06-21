"use client";

export function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options?.headers) {
    const existing = options.headers as Record<string, string>;
    if (existing["Content-Type"]) headers["Content-Type"] = existing["Content-Type"];
  }
  return fetch(url, { ...options, headers, credentials: "include" });
}
