"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PenLine,
  Share2,
} from "lucide-react";
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
    <aside className="flex w-full flex-col border-b border-border bg-surface lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-border px-5 py-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          OSI Admin
        </p>
        <p className="mt-1 font-display text-lg text-ink">Content Dashboard</p>
        {email ? (
          <p className="mt-2 truncate font-sans text-xs text-ink-muted" title={email}>
            {email}
          </p>
        ) : null}
        <span
          className={cn(
            "mt-2 inline-block rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
            firebaseReady
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          )}
        >
          {firebaseReady ? "Firestore connected" : "Setup required"}
        </span>
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
                "flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-bg"
                  : "text-ink-muted hover:bg-tag-bg hover:text-accent"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </span>
              {countKey && count > 0 ? (
                <span
                  className={cn(
                    "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center font-mono text-[10px] tabular-nums",
                    active ? "bg-bg/20 text-bg" : "bg-tag-bg text-accent"
                  )}
                >
                  {countKey === "rfqNew" ? count : count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <a href="/en" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View public site
          </a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
