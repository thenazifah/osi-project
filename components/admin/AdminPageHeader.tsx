type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  compact?: boolean;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: AdminPageHeaderProps) {
  return (
    <div
      className={`admin-page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${compact ? "" : "admin-dashboard-enter admin-dashboard-enter-1"}`}
    >
      <div>
        <p className="admin-page-eyebrow font-mono text-[10px] uppercase tracking-[0.18em] text-sea">
          {eyebrow}
        </p>
        <h1
          className={`mt-2 font-display text-ink ${compact ? "text-2xl" : "text-3xl"}`}
        >
          {title}
        </h1>
        <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      </div>
      {children ? (
        <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
      ) : null}
    </div>
  );
}
