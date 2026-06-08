"use client";

import type { ReactNode } from "react";
import { LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";
import { OsiLogo } from "@/components/brand/OsiLogo";

type LoginShellProps = {
  children: ReactNode;
};

const FEATURES = [
  { icon: LayoutDashboard, label: "Products & catalog" },
  { icon: ShieldCheck, label: "Secure admin access" },
  { icon: Sparkles, label: "Live site sync" },
] as const;

export function LoginShell({ children }: LoginShellProps) {
  return (
    <div className="admin-login relative min-h-screen overflow-hidden">
      <div className="admin-login-bg" aria-hidden>
        <span className="admin-login-orb admin-login-orb-a" />
        <span className="admin-login-orb admin-login-orb-b" />
        <span className="admin-login-orb admin-login-orb-c" />
        <span className="admin-login-grid" />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside className="admin-login-brand hidden flex-col justify-between p-10 lg:flex xl:p-14">
          <div className="admin-login-enter admin-login-enter-1">
            <OsiLogo size={52} priority />
          </div>

          <div className="space-y-8">
            <div className="admin-login-enter admin-login-enter-2 space-y-4">
              <p className="section-label text-sea-light/90">Admin portal</p>
              <h2 className="max-w-sm font-display text-3xl leading-tight text-bg xl:text-4xl">
                Manage your export brand from one place
              </h2>
              <p className="max-w-md font-sans text-sm leading-relaxed text-bg/70">
                Update products, RFQ inquiries, site imagery, and social links —
                changes publish to the live website instantly.
              </p>
            </div>

            <ul className="admin-login-enter admin-login-enter-3 space-y-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-2/20 text-sea-light">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="font-sans text-sm text-bg/85">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="admin-login-enter admin-login-enter-4 font-mono text-[10px] uppercase tracking-[0.2em] text-bg/40">
            Organic Scales International
          </p>
        </aside>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="admin-login-card w-full max-w-[420px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
