type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">{title}</h1>
        <p className="mt-2 max-w-2xl font-sans text-sm text-ink-muted">
          {description}
        </p>
      </div>
      {children ? <div className="flex shrink-0 flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}
