import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { LogOut, FilePlus2, FileText, User, LayoutDashboard, Home } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoAsset from "@/assets/claim-for-sure-logo.png.asset.json";

export function DashboardShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.invalidate();
    navigate({ to: "/auth/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="Claim For Sure" className="h-9 w-9 rounded-md object-cover" />
            <span className="font-display text-base font-bold tracking-tight text-primary">Claim For Sure</span>
          </Link>
          <nav className="hidden gap-5 text-sm text-muted-foreground md:flex">
            <Link to="/dashboard" className="hover:text-foreground inline-flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
            <Link to="/dashboard/claims" className="hover:text-foreground inline-flex items-center gap-1.5"><FileText className="h-4 w-4" /> My Claims</Link>
            <Link to="/dashboard/profile" className="hover:text-foreground inline-flex items-center gap-1.5"><User className="h-4 w-4" /> Profile</Link>
            <Link to="/" className="hover:text-foreground inline-flex items-center gap-1.5"><Home className="h-4 w-4" /> Site</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/claims/new" className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
              <FilePlus2 className="h-4 w-4" /> New Claim
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
