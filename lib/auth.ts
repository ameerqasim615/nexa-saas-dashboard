import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("JWT_SECRET must be at least 32 characters long.");
  return new TextEncoder().encode(secret);
}
const COOKIE_NAME = "nexa_session";

export async function createSession(admin: { id: string; email: string; name: string }) {
  const token = await new SignJWT({ email: admin.email, name: admin.name })
    .setProtectedHeader({ alg: "HS256" }).setSubject(admin.id).setIssuedAt()
    .setExpirationTime("7d").sign(getKey());
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey());
    return { id: payload.sub as string, email: payload.email as string, name: payload.name as string };
  } catch { return null; }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}
