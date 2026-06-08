"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PenLine,
  Share2,
} from "lucide-react";
import { OsiLogo } from "@/components/brand/OsiLogo";
import { logoutAdmin } from "@/lib/admin-actions";
import { signOutFirebase } from "@/lib/firebase-client-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true, countKey: null },
  { href: "/admin/rfq", label: "RFQ Inbox", icon: FileText, countKey: "rfqNew" as const },
  { href: "/admin/products", label: "Products", icon: Package, countKey: "productCount" as const },
  { href: "/admin/content", label: "Site Content", icon: PenLine, countKey: "contentLocales" as const },
  { href: "/admin/site", label: "Site Settings", icon: Share2, countKey: null },
  { href: "/admin/audit", label: "Audit Log", icon: ClipboardList, countKey: null },
] as const;

type NavCounts = {
  rfqNew: number;
  rfqTotal: number;
  productCount: number;
  contentLocales: number;
};

type AdminSidebarProps = {
  email: string | null;
  firebaseReady: boolean;
  navCounts: NavCounts;
};

function userInitial(email: string | null): string {
  if (!email) return "?";
  return (email.charAt(0) || "?").toUpperCase();
}

export function AdminSidebar({ email, firebaseReady, navCounts }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await signOutFirebase();
    } catch {
      /* session cookie cleared even if client auth already signed out */
    }
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-sidebar flex w-full flex-col lg:sticky lg:top-0 lg:min-h-screen lg:w-[17.5rem] lg:shrink-0">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <OsiLogo size={36} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-sea-light/80">
              OSI Admin
            </p>
            <p className="truncate font-display text-base text-bg">Dashboard</p>
          </div>
        </div>

        {email ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-2/25 font-display text-sm text-sea-light">
              {userInitial(email)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-sans text-xs text-bg/90" title={email}>
                {email}
              </p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider",
                  firebaseReady ? "text-emerald-300/90" : "text-amber-300/90"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    firebaseReady ? "bg-emerald-400" : "bg-amber-400"
                  )}
                />
                {firebaseReady ? "Connected" : "Setup required"}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
        {LINKS.map((link) => {
          const { href, label, icon: Icon, countKey } = link;
          const exact = "exact" in link && link.exact;
          const active = exact ? pathname === href : pathname.startsWith(href);
          const count =
            countKey === "rfqNew"
              ? navCounts.rfqNew
              : countKey === "productCount"
                ? navCounts.productCount
                : countKey === "contentLocales"
                  ? navCounts.contentLocales
                  : 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "admin-nav-link flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2.5 font-sans text-sm font-medium transition-all duration-200",
                active
                  ? "admin-nav-link-active bg-white/12 text-bg shadow-[inset_3px_0_0_0_var(--accent-2)]"
                  : "text-bg/65 hover:bg-white/6 hover:text-bg"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </span>
              {countKey && count > 0 ? (
                <span
                  className={cn(
                    "min-w-[1.35rem] rounded-full px-1.5 py-0.5 text-center font-mono text-[10px] tabular-nums",
                    active
                      ? "bg-accent-2/30 text-bg"
                      : "bg-white/10 text-sea-light"
                  )}
                >
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-bg/70 hover:bg-white/8 hover:text-bg"
          asChild
        >
          <a href="/en" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View public site
          </a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-bg/70 hover:bg-white/8 hover:text-bg"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
