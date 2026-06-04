const DEFAULT_ALLOWED_EMAILS = [
  "nazifahanwar693563@gmail.com",
  "sifatali008@gmail.com",
] as const;

function parseEnvAllowlist(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getAllowedAdminEmails(): string[] {
  const fromEnv = parseEnvAllowlist();
  if (fromEnv.length > 0) return fromEnv;
  return DEFAULT_ALLOWED_EMAILS.map((e) => e.toLowerCase());
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAllowedAdminEmails().includes(normalized);
}
