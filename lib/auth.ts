import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback_dev_secret_change_in_prod"
);

// ── Token helpers ──────────────────────────────────────────────────────────
export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

// ── Session helpers ────────────────────────────────────────────────────────
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("northstar_token")?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user ?? null;
  } catch {
    return null;
  }
}

// ── Auth helpers ───────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── Cookie helpers ─────────────────────────────────────────────────────────
export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("northstar_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.set("northstar_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}