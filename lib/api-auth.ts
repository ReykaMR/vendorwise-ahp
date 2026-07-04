import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export class AuthenticationError extends Error {
  constructor() {
    super("Tidak terautentikasi");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Akses ditolak") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireApiAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }
  return session.user;
}

export async function requireApiAdmin() {
  const user = await requireApiAuth();
  if (user.role !== "ADMIN") {
    throw new AuthorizationError("Akses ditolak");
  }
  return user;
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}
