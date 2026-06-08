import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Package,
  PenLine,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MODULES: {
  href: string;
  title: string;
  text: string;
  icon: LucideIcon;
  tone: "sea" | "teal" | "ink" | "gold";
}[] = [
  {
    href: "/admin/rfq",
    title: "RFQ Inbox",
    text: "Review and update quote request status.",
    icon: FileText,
    tone: "sea",
  },
  {
    href: "/admin/products",
    title: "Products",
    text: "Full CRUD for catalog items, specs, and images.",
    icon: Package,
    tone: "teal",
  },
  {
    href: "/admin/content",
    title: "Site Content",
    text: "Edit hero, about, and trust copy per locale.",
    icon: PenLine,
    tone: "ink",
  },
  {
    href: "/admin/site",
    title: "Site Settings",
    text: "Social links, Meta Pixel, and homepage images.",
    icon: Share2,
    tone: "gold",
  },
  {
    href: "/admin/audit",
    title: "Audit Log",
    text: "Review admin sign-ins, edits, uploads, and sync actions.",
    icon: ClipboardList,
    tone: "ink",
  },
];

export function DashboardModules() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {MODULES.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-module admin-module-${item.tone} admin-dashboard-enter admin-dashboard-enter-${Math.min(index + 5, 8)} group`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="admin-module-icon">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <ArrowRight className="h-4 w-4 text-ink-muted/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-sea" />
            </div>
            <h3 className="mt-4 font-display text-base text-ink">{item.title}</h3>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink-muted">
              {item.text}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs font-semibold text-sea opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Open module
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function DashboardModulesFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {MODULES.slice(0, 3).map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.href}
            className={`admin-module admin-module-${item.tone}`}
          >
            <span className="admin-module-icon">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-display text-base text-ink">{item.title}</h3>
            <p className="mt-1.5 font-sans text-sm text-ink-muted">{item.text}</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href={item.href}>
                Open
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
