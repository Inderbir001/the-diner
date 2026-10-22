import type { RequestHandler } from "express";
import { db } from "../lib/supabase";
import { HttpError } from "../lib/http";

export type AdminRole = "owner" | "admin" | "staff";
export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
}

declare module "express-serve-static-core" {
  interface Request {
    admin?: AdminUser;
  }
}

// Short cache so every admin request doesn't round-trip to Supabase Auth.
const cache = new Map<string, { user: AdminUser; expires: number }>();
const CACHE_MS = 60_000;

/** Verifies the Supabase access token and checks the user is in admin_users. */
export const requireAdmin: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new HttpError(401, "Sign in required");

  const cached = cache.get(token);
  if (cached && cached.expires > Date.now()) {
    req.admin = cached.user;
    return next();
  }

  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, "Session expired. Please sign in again.");

  const { data: row } = await db
    .from("admin_users")
    .select("user_id, email, name, role")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!row) throw new HttpError(403, "This account doesn't have admin access.");

  const user: AdminUser = { id: row.user_id, email: row.email, name: row.name, role: row.role };
  cache.set(token, { user, expires: Date.now() + CACHE_MS });
  if (cache.size > 500) cache.delete(cache.keys().next().value!);
  req.admin = user;
  next();
};

const rank: Record<AdminRole, number> = { staff: 1, admin: 2, owner: 3 };

export const requireRole =
  (min: AdminRole): RequestHandler =>
  (req, _res, next) => {
    if (!req.admin || rank[req.admin.role] < rank[min]) {
      throw new HttpError(403, "You don't have permission to do that.");
    }
    next();
  };

export function clearAuthCache() {
  cache.clear();
}
