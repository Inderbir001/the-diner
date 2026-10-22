/**
 * Create the first owner account.
 *   npm run create-owner --workspace @diner/api -- owner@example.com "a-strong-password" "Owner Name"
 */
import { createClient } from "@supabase/supabase-js";

const [email, password, name] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: create-owner <email> <password> [name]");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Use a password of at least 10 characters.");
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (apps/api/.env).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
let userId = created.data.user?.id;
if (!userId) {
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  if (!userId) {
    console.error(created.error?.message ?? "Could not create user");
    process.exit(1);
  }
  console.log("User already existed — granting owner role.");
}

const { error } = await db.from("admin_users").upsert({ user_id: userId, email, name: name ?? null, role: "owner" });
if (error) {
  console.error(error.message);
  process.exit(1);
}
console.log(`Owner ready: ${email}. Sign in at /admin/login`);
