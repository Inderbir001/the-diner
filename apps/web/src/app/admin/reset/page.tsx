"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/admin/client";

/** Landing page for password-reset and invite links: Supabase restores the session from the URL. */
export default function ResetPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password"));
    if (password.length < 10) {
      toast.error("Use at least 10 characters.");
      return;
    }
    setSaving(true);
    const { error } = await supabaseBrowser()!.auth.updateUser({ password });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated.");
      router.replace("/admin");
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <form onSubmit={onSubmit} className="glass w-full max-w-sm space-y-5 rounded-[28px] p-8">
        <h1 className="font-display text-3xl">Set a new password</h1>
        <div>
          <label htmlFor="password" className="label">New password</label>
          <input id="password" name="password" type="password" minLength={10} required autoComplete="new-password" className="field" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          Save password
        </button>
      </form>
    </main>
  );
}
