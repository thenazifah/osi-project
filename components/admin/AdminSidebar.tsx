"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PenLine,
} from "lucide-react";
import { logoutAdmin } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/rfq", label: "RFQ Inbox", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/content", label: "Site Content", icon: PenLine },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
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
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
        {LINKS.map((link) => {
          const { href, label, icon: Icon } = link;
          const exact = "exact" in link && link.exact;
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 font-sans text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-bg"
                  : "text-ink-muted hover:bg-tag-bg hover:text-accent"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
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
