"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  Lock,
  Mail,
  MailX,
  MapPin,
  MessageSquare,
  Shield,
} from "lucide-react";
import { submitRFQ } from "@/lib/rfq-actions";
import { RFQSchema, type RFQFormData } from "@/lib/rfq-schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSectionObserver } from "@/lib/use-section-observer";
import { cn } from "@/lib/utils";

const PRODUCT_OPTIONS = ["tilapia", "carp", "marine", "custom"] as const;

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Japan",
  "China",
  "Germany",
  "France",
  "South Korea",
  "India",
  "Australia",
  "Canada",
  "Netherlands",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Bangladesh",
  "Other",
];

const STEPS = ["review", "quote", "ship"] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 font-sans text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-sea">{title}</p>
      {children}
    </div>
  );
}

export default function RFQ() {
  const t = useTranslations("rfq");
  const { ref, isVisible } = useSectionObserver();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RFQFormData>({
    resolver: zodResolver(RFQSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      country: "",
      quantityKg: 500,
      productInterest: [],
      message: "",
    },
  });

  const onSubmit = (data: RFQFormData) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitRFQ(data);
      if (result.success) {
        setConfirmId(result.id.slice(0, 6).toUpperCase());
        reset();
      } else {
        setServerError(result.error);
      }
    });
  };

  const resetForm = () => {
    setConfirmId(null);
    setServerError(null);
    reset();
  };

  return (
    <section
      ref={ref}
      id="rfq"
      className={cn(
        "section-animate rfq-section border-t border-border",
        isVisible && "is-visible"
      )}
      style={{ animationDelay: "240ms" }}
    >
      <div className="page-container py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Badge variant="export">{t("badge")}</Badge>
            <p className="section-label mt-6">{t("label")}</p>
            <h2 className="mt-4 whitespace-pre-line font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-ink-muted">
              {t("subtitle")}
            </p>

            {confirmId ? (
              <Card className="mt-10 overflow-hidden border-accent-2/30 bg-surface shadow-[0_12px_40px_rgba(27,138,138,0.12)]">
                <div className="bg-gradient-to-r from-accent/10 to-accent-2/10 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className="h-8 w-8 text-accent-2"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="font-display text-lg text-ink">
                        {t("successTitle")}
                      </p>
                      <p className="font-mono text-sm text-sea">
                        {t("referenceLabel")}: {confirmId}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="space-y-4 p-6">
                  <p className="font-sans text-sm leading-relaxed text-ink-muted">
                    {t("successBody")}
                  </p>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t("submitAnother")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mt-10 border-border bg-surface shadow-[0_8px_30px_rgba(11,31,42,0.06)]">
                <CardHeader className="border-b border-border bg-tag-bg/40 pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-normal">
                    <MessageSquare
                      className="h-4 w-4 text-accent-2"
                      strokeWidth={1.75}
                    />
                    {t("formTitle")}
                  </CardTitle>
                  <p className="font-sans text-xs text-ink-muted">{t("formHint")}</p>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                    noValidate
                  >
                    <FormSection title={t("sections.company")}>
                      <div>
                        <Label htmlFor="companyName">{t("companyName")} *</Label>
                        <Input
                          id="companyName"
                          className="mt-2"
                          placeholder={t("placeholders.companyName")}
                          {...register("companyName")}
                        />
                        <FieldError message={errors.companyName?.message} />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="contactPerson">
                            {t("contactPerson")} *
                          </Label>
                          <Input
                            id="contactPerson"
                            className="mt-2"
                            {...register("contactPerson")}
                          />
                          <FieldError message={errors.contactPerson?.message} />
                        </div>
                        <div>
                          <Label htmlFor="email">{t("email")} *</Label>
                          <Input
                            id="email"
                            type="email"
                            className="mt-2"
                            placeholder="procurement@company.com"
                            {...register("email")}
                          />
                          <FieldError message={errors.email?.message} />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection title={t("sections.order")}>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="country">{t("country")} *</Label>
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="mt-2 w-full">
                                  <SelectValue placeholder={t("countryPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {COUNTRIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {c}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FieldError message={errors.country?.message} />
                        </div>
                        <div>
                          <Label htmlFor="quantityKg">{t("quantity")} *</Label>
                          <Input
                            id="quantityKg"
                            type="number"
                            min={100}
                            step={50}
                            className="mt-2"
                            {...register("quantityKg")}
                          />
                          <p className="mt-1.5 font-sans text-xs text-ink-muted">
                            {t("moqHint")}
                          </p>
                          <FieldError message={errors.quantityKg?.message} />
                        </div>
                      </div>

                      <div>
                        <Label>{t("productInterest")} *</Label>
                        <Controller
                          name="productInterest"
                          control={control}
                          render={({ field }) => (
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {PRODUCT_OPTIONS.map((product) => {
                                const checked = field.value?.includes(product);
                                return (
                                  <label
                                    key={product}
                                    className={cn(
                                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200",
                                      checked
                                        ? "border-accent-2 bg-accent/[0.06] shadow-sm"
                                        : "border-border bg-bg hover:border-sea/40 hover:bg-tag-bg/50"
                                    )}
                                  >
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(isChecked) => {
                                        const next = isChecked
                                          ? [...(field.value ?? []), product]
                                          : (field.value ?? []).filter(
                                              (v) => v !== product
                                            );
                                        field.onChange(next);
                                      }}
                                    />
                                    <span className="font-sans text-sm font-medium text-ink">
                                      {t(`products.${product}`)}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        />
                        <FieldError message={errors.productInterest?.message} />
                      </div>

                      <div>
                        <Label htmlFor="message">{t("message")}</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          placeholder={t("messagePlaceholder")}
                          className="mt-2"
                          {...register("message")}
                        />
                      </div>
                    </FormSection>

                    {serverError ? (
                      <p
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
                        role="alert"
                      >
                        {serverError}
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      variant="cta"
                      disabled={isPending}
                      size="lg"
                      className="group h-12 w-full"
                    >
                      {isPending ? t("submitting") : t("submit")}
                      {!isPending ? (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      ) : null}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4 lg:col-span-5">
            <Card className="overflow-hidden border-border bg-surface">
              <div className="bg-gradient-to-br from-accent to-ink px-6 py-5 text-bg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent-2" strokeWidth={1.75} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-bg/70">
                    {t("sla")}
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl">{t("slaValue")}</p>
                <p className="mt-1 font-sans text-sm text-bg/75">{t("slaNote")}</p>
              </div>
              <CardContent className="p-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-sea">
                  {t("stepsTitle")}
                </p>
                <ol className="mt-4 space-y-4">
                  {STEPS.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tag-bg font-mono text-xs text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-display text-sm text-ink">
                          {t(`steps.${step}.title`)}
                        </p>
                        <p className="mt-0.5 font-sans text-xs leading-relaxed text-ink-muted">
                          {t(`steps.${step}.text`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="card-interactive border-border bg-surface">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("officeLabel")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-2"
                    strokeWidth={1.75}
                  />
                  <address className="not-italic font-sans text-sm leading-relaxed text-ink-muted">
                    {t("address")}
                  </address>
                </div>
                <a
                  href={`mailto:${t("emailContact")}`}
                  className="flex items-center gap-3 font-sans text-sm font-medium text-accent transition-colors hover:text-accent-2"
                >
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {t("emailContact")}
                </a>
                <p className="font-sans text-xs text-ink-muted">
                  <span className="font-mono uppercase tracking-wider">
                    {t("timezone")}:{" "}
                  </span>
                  {t("timezoneValue")}
                </p>
                <Separator />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {(
                    [
                      { key: "trustSsl", icon: Lock },
                      { key: "trustGdpr", icon: Shield },
                      { key: "trustNoSpam", icon: MailX },
                    ] as const
                  ).map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-2"
                    >
                      <Icon className="h-3.5 w-3.5 text-accent-2" strokeWidth={1.75} />
                      <span className="font-sans text-xs text-ink-muted">
                        {t(key)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border bg-tag-bg/50 p-3">
                  <FileCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-2"
                    strokeWidth={1.75}
                  />
                  <p className="font-sans text-xs leading-relaxed text-ink-muted">
                    {t("docsNote")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
