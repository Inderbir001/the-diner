"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { adminApi } from "@/lib/admin/client";
import { formatDate } from "@/lib/utils";
import { PageTitle } from "@/components/admin/shell";
import { useAdmin, type AdminRole } from "@/components/admin/auth";

interface Member {
  user_id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  created_at: string;
}

const ROLE_HELP: Record<AdminRole, string> = {
  owner: "Everything, including managing the team",
  admin: "Everything except the team",
  staff: "Bookings and enquiries only",
};

export default function TeamPage() {
  const { me } = useAdmin();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [inviting, setInviting] = useState(false);

  const load = useCallback(() => {
    adminApi<{ data: Member[] }>("/users")
      .then((r) => setMembers(r.data))
      .catch((e) => toast.error(e.message));
  }, []);
  useEffect(load, [load]);

  if (me.role !== "owner") return <p className="text-sand">Only owners can manage the team.</p>;

  async function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setInviting(true);
    try {
      await adminApi("/users", { method: "POST", json: { email: f.get("email"), name: f.get("name") || undefined, role: f.get("role") } });
      toast.success("Invite sent. They'll get an email to set a password.");
      form.reset();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setInviting(false);
    }
  }

  async function changeRole(m: Member, role: AdminRole) {
    await adminApi(`/users/${m.user_id}`, { method: "PATCH", json: { role } }).catch((e) => toast.error(e.message));
    load();
  }
  async function remove(m: Member) {
    if (!confirm(`Remove ${m.email}'s admin access?`)) return;
    await adminApi(`/users/${m.user_id}`, { method: "DELETE" }).catch((e) => toast.error(e.message));
    load();
  }

  return (
    <>
      <PageTitle title="Team" description="Give managers and staff their own logins. Staff can only see bookings and enquiries." />
      <form onSubmit={invite} className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-coal p-5 sm:grid-cols-[1fr_1fr_auto_auto]">
        <input name="email" type="email" required placeholder="Email" className="field !py-2" aria-label="Email" />
        <input name="name" placeholder="Name (optional)" className="field !py-2" aria-label="Name" />
        <select name="role" defaultValue="staff" className="field !py-2" aria-label="Role">
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit" disabled={inviting} className="btn-primary">
          {inviting ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />} Invite
        </button>
      </form>
      {!members ? (
        <Loader2 className="size-5 animate-spin text-brass" />
      ) : (
        <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/10 bg-coal">
          {members.map((m) => (
            <li key={m.user_id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-cream">{m.name ?? m.email}</p>
                <p className="truncate text-xs text-muted">
                  {m.email} · added {formatDate(m.created_at)}
                </p>
              </div>
              <div className="text-right">
                <select
                  value={m.role}
                  disabled={m.user_id === me.id}
                  onChange={(e) => changeRole(m, e.target.value as AdminRole)}
                  className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm text-sand"
                  aria-label="Role"
                >
                  {(["owner", "admin", "staff"] as const).map((r) => (
                    <option key={r} value={r} className="bg-coal capitalize">
                      {r}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[0.7rem] text-muted">{ROLE_HELP[m.role]}</p>
              </div>
              {m.user_id !== me.id && (
                <button type="button" onClick={() => remove(m)} className="p-2 text-muted hover:text-ember" aria-label="Remove">
                  <Trash2 className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
