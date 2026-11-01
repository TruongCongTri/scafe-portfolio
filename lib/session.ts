import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "scafe-manager";
const MAX_AGE = 60 * 60 * 12;

// Without SESSION_SECRET a random one is used, so sign-ins end when the server restarts.
const store = globalThis as typeof globalThis & { scafeSessionSecret?: string };
const secret = () => (process.env.SESSION_SECRET ?? (store.scafeSessionSecret ??= randomBytes(32).toString("hex")));

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

export const isManagerPhone = (phone: string) =>
  phone.replace(/\D/g, "") === (process.env.MANAGER_PHONE ?? "090123456");

export async function startSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function hasSession() {
  const [expires, signature] = (await cookies()).get(COOKIE)?.value.split(".") ?? [];
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
