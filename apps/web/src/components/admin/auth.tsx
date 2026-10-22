"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { adminApi, AdminApiError, supabaseBrowser } from "@/lib/admin/client";

export type AdminRole = "owner" | "admin" | "staff";
export interface Me {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
}

const Ctx = createContext<{ me: Me; signOut: () => Promise<void> } | null>(null);

export function useAdmin() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin outside AdminAuth");
  return v;
}

export const can = (me: Me, min: AdminRole) => ({ staff: 1, admin: 2, owner: 3 })[me.role] >= ({ staff: 1, admin: 2, owner: 3 })[min];

/** Redirects to /admin/login unless the signed-in user is in admin_users. */
export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    await supabaseBrowser()?.auth.signOut();
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    const sb = supabaseBrowser();
    if (!sb) {
      setError("Supabase isn't configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    let active = true;
    sb.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      try {
        const res = await adminApi<{ data: Me }>("/me");
        if (active) setMe(res.data);
      } catch (e) {
        if (e instanceof AdminApiError && e.status === 401) router.replace("/admin/login");
        else if (active) setError(e instanceof Error ? e.message : "Could not load your account.");
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/admin/login");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="max-w-md text-sand">{error}</p>
        <button type="button" className="btn-ghost" onClick={signOut}>
          Back to sign in
        </button>
      </div>
    );
  }
  if (!me) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-brass" />
      </div>
    );
  }
  return <Ctx.Provider value={{ me, signOut }}>{children}</Ctx.Provider>;
}
