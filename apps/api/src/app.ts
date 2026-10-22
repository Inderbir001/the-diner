import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { timingSafeEqual } from "node:crypto";
import { corsOrigins, env } from "./env";
import { logger } from "./lib/logger";
import { errorHandler, HttpError, notFound } from "./lib/http";
import { publicRouter } from "./routes/public";
import { adminRouter } from "./routes/admin";
import { syncSocial } from "./services/sync";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1); // Render sits behind one proxy; needed for rate limiting by IP
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || corsOrigins.includes(origin)),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url === "/health" },
      customLogLevel: (_req, res, err) => (err || res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info"),
    }),
  );

  app.get("/", (_req, res) => {
    res.json({ name: "The Diner API", status: "ok" });
  });
  app.get("/health", (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  app.use("/v1/public", publicRouter);
  app.use("/v1/admin", adminRouter);

  /** Called by the Render cron job (or any scheduler) with `Authorization: Bearer $CRON_SECRET`. */
  app.post("/v1/cron/sync-social", async (req, res) => {
    const given = Buffer.from((req.headers.authorization ?? "").replace(/^Bearer /, ""));
    const expected = Buffer.from(env.CRON_SECRET);
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) throw new HttpError(401, "Unauthorized");
    res.json({ data: await syncSocial() });
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
