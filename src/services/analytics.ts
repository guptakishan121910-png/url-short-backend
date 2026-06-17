import crypto from "node:crypto";

import type { Request } from "express";

export function getReferrer(request: Request) {
  const referrer = request.get("referer") || request.get("referrer");
  if (!referrer) {
    return "Direct";
  }

  try {
    return new URL(referrer).hostname;
  } catch {
    return "Unknown";
  }
}

export function getDeviceFamily(userAgent = "") {
  const ua = userAgent.toLowerCase();

  if (/bot|crawler|spider|slurp/.test(ua)) return "Bot";
  if (/ipad|tablet/.test(ua)) return "Tablet";
  if (/mobile|iphone|android/.test(ua)) return "Mobile";
  if (!ua.trim()) return "Unknown";
  return "Desktop";
}

export function hashIp(ip = "") {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 24);
}
