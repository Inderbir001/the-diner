import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  /** Public site URL, used for on-demand revalidation and email links */
  WEB_URL: z.url().default("http://localhost:3000"),
  /** Comma-separated list of origins allowed to call the API */
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  REVALIDATE_SECRET: z.string().min(16),
  CRON_SECRET: z.string().min(16),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("The Diner Restobar <bookings@thediner.in>"),
  INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),
  ENABLE_CRON: z
    .string()
    .default("true")
    .transform((v) => v !== "false"),
  SYNC_CRON: z.string().default("*/30 * * * *"),
  LOG_LEVEL: z.string().default("info"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
