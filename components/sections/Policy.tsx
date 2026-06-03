"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Scale, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSectionObserver } from "@/lib/use-section-observer";
import { cn } from "@/lib/utils";

const POLICY_TABS = [
  { id: "privacy", icon: Shield },
  { id: "terms", icon: FileText },
  { id: "quality", icon: Scale },
] as const;

type PolicyTab = (typeof POLICY_TABS)[number]["id"];

function PolicyBody({ tab }: { tab: PolicyTab }) {
  const t = useTranslations(`policy.${tab}`);
  const sectionKeys = ["s1", "s2", "s3", "s4"] as const;

  return (
    <div className="space-y-8">
      <p className="font-sans text-sm leading-relaxed text-ink-muted">{t("intro")}</p>
      {sectionKeys.map((key) => (
          <div key={key} id={`policy-${tab}-${key}`}>
            <h3 className="font-display text-base text-ink">
              {t(`sections.${key}.title`)}
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
              {t(`sections.${key}.body`)}
            </p>
          </div>
      ))}
      <p className="border-t border-border pt-6 font-sans text-xs text-ink-muted">
        {t("updated")}
      </p>
    </div>
  );
}

function tabFromHash(hash: string): PolicyTab {
  if (hash.includes("terms")) return "terms";
  if (hash.includes("quality")) return "quality";
  return "privacy";
}

export default function Policy() {
  const t = useTranslations("policy");
  const { ref, isVisible } = useSectionObserver();
  const [activeTab, setActiveTab] = useState<PolicyTab>("privacy");

  useEffect(() => {
    const sync = () => setActiveTab(tabFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section
      ref={ref}
      id="policy"
      className={cn(
        "section-animate section-divider bg-bg",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container py-16 lg:py-24">
        <div className="max-w-3xl">
          <Badge variant="outline">{t("badge")}</Badge>
          <p className="section-label mt-6">{t("label")}</p>
          <h2 className="mt-4 whitespace-pre-line font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink">
            {t("title")}
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink-muted">
            {t("subtitle")}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as PolicyTab)}
          className="mt-12"
        >
          <TabsList className="!flex !h-auto !w-auto !flex-wrap !items-center !justify-start !gap-2 !border-0 !bg-transparent !p-0 !shadow-none">
            {POLICY_TABS.map(({ id, icon: Icon }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="rounded-lg border border-border bg-surface px-4 py-2.5 data-[state=active]:border-accent data-[state=active]:bg-accent data-[state=active]:text-bg"
              >
                <Icon className="mr-2 h-4 w-4" strokeWidth={1.75} />
                {t(`tabs.${id}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {POLICY_TABS.map(({ id }) => (
            <TabsContent key={id} value={id} className="mt-6">
              <Card className="border-border bg-surface">
                <CardContent className="p-6 md:p-8">
                  <PolicyBody tab={id} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
