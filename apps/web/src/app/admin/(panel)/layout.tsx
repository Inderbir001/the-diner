import { AdminAuth } from "@/components/admin/auth";
import { AdminShell } from "@/components/admin/shell";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuth>
      <AdminShell>{children}</AdminShell>
    </AdminAuth>
  );
}
