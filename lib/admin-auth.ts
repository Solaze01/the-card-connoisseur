import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";

const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.ADMIN_PASSWORD;
const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? adminPassword;
const sessionLifetimeSeconds = 60 * 60 * 12;

function toBase64Url(value: Uint8Array) {
  let binary = "";
  value.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value: string) {
  if (!sessionSecret) return null;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(sessionSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

function safelyEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left[index] ^ right[index];
  return result === 0;
}

export function isAdminAuthenticationConfigured() { return Boolean(adminPassword && sessionSecret); }

export async function createAdminSession() {
  if (!sessionSecret) return null;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ expiresAt: Date.now() + sessionLifetimeSeconds * 1000 })));
  const signature = await sign(payload);
  return signature ? `${payload}.${signature}` : null;
}

export async function isValidAdminSession(session?: string) {
  if (!session || !sessionSecret) return false;
  const [payload, providedSignature, ...extra] = session.split(".");
  if (!payload || !providedSignature || extra.length > 0) return false;
  try {
    const expectedSignature = await sign(payload);
    if (!expectedSignature || !safelyEqual(fromBase64Url(providedSignature), fromBase64Url(expectedSignature))) return false;
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { expiresAt?: unknown };
    return typeof data.expiresAt === "number" && data.expiresAt > Date.now();
  } catch { return false; }
}

export async function hasAdminSession(request: NextRequest | Request) {
  if ("cookies" in request) {
    const nextRequest = request as NextRequest;
    return isValidAdminSession(nextRequest.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  }

  const session = request.headers.get("cookie")?.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${ADMIN_SESSION_COOKIE}=`))?.slice(ADMIN_SESSION_COOKIE.length + 1);
  return isValidAdminSession(session);
}

export function adminSessionCookie(value: string) {
  return { name: ADMIN_SESSION_COOKIE, value, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: sessionLifetimeSeconds };
}

export function unauthorizedResponse() { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

export async function credentialsAreValid(username: string, password: string) {
  if (!adminPassword) return false;
  const encoder = new TextEncoder();
  return safelyEqual(encoder.encode(username), encoder.encode(adminUsername)) && safelyEqual(encoder.encode(password), encoder.encode(adminPassword));
}
