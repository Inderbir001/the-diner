import cron from "node-cron";
import { env } from "./env";
import { logger } from "./lib/logger";
import { createApp } from "./app";
import { syncSocial } from "./services/sync";

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info(`API listening on :${env.PORT}`);
});

if (env.ENABLE_CRON) {
  cron.schedule(env.SYNC_CRON, () => {
    void syncSocial();
  });
  // first sync shortly after boot so a fresh deploy shows the latest posts
  setTimeout(() => void syncSocial(), 10_000);
  logger.info(`social sync scheduled (${env.SYNC_CRON})`);
}

function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
