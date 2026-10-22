import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError, z } from "zod";
import { logger } from "./logger";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Not found" });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Please check the highlighted fields.", fields: z.flattenError(err).fieldErrors });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  if (err?.type === "entity.too.large" || err?.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({ error: "File too large." });
    return;
  }
  logger.error({ err, path: req.path }, "unhandled error");
  res.status(500).json({ error: "Something went wrong. Please try again." });
};

/**
 * Zod 4 applies `.default()` values even inside `.partial()`, so a PATCH would reset
 * untouched fields. Keep only the keys the client actually sent.
 */
export function onlyProvided<T extends Record<string, unknown>>(parsed: T, body: unknown): Partial<T> {
  const sent = body && typeof body === "object" ? Object.keys(body) : [];
  return Object.fromEntries(Object.entries(parsed).filter(([k]) => sent.includes(k))) as Partial<T>;
}

/** Throw on a Supabase error, returning data otherwise. */
export function unwrap<T>(result: { data: T; error: { message: string; code?: string } | null }): T {
  if (result.error) {
    if (result.error.code === "23505") throw new HttpError(409, "That slug or value is already in use.");
    if (result.error.code === "PGRST116") throw new HttpError(404, "Not found");
    throw new HttpError(500, result.error.message);
  }
  return result.data;
}
