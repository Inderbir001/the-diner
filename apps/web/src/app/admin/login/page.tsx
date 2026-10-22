"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/admin/client";
import { Logo } from "@/components/site/logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"password" | "reset">("password");
  const sb = supabaseBrowser();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sb) return;
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/reset` });
        if (error) throw error;
        toast.success("Check your email for a reset link.");
        setMode("password");
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: String(f.get("password")) });
        if (error) throw error;
        const next = params.get("next");
        router.replace(next?.startsWith("/admin") ? next : "/admin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass w-full max-w-sm space-y-5 rounded-[28px] p-8">
      <div className="mb-2 text-center">
        <Logo />
        <p className="mt-4 text-sm text-muted">{mode === "reset" ? "Reset your password" : "Admin sign in"}</p>
      </div>
      {!sb && <p className="rounded-xl bg-ember/15 p-3 text-xs text-ember">Supabase environment variables are missing.</p>}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      {mode === "password" && (
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
        </div>
      )}
      <button type="submit" disabled={loading || !sb} className="btn-primary w-full">
        {loading && <Loader2 className="size-4 animate-spin" />}
        {mode === "reset" ? "Send reset link" : "Sign in"}
      </button>
      <button type="button" onClick={() => setMode(mode === "reset" ? "password" : "reset")} className="w-full text-center text-xs text-muted hover:text-cream">
        {mode === "reset" ? "Back to sign in" : "Forgot password?"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(ellipse_at_50%_0%,rgb(232_71_62/0.15),transparent_60%)] p-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
