const FIRESTORE_DATABASE_SETUP = `Firestore is not set up for this project. In Firebase Console open project "osi-project-da298" → Build → Firestore Database → Create database (start in production mode, pick a region such as asia-south1). Then restart npm run dev.`;

export function isFirestoreNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: number | string; message?: string; details?: string };
  const code = e.code;
  const text = `${e.message ?? ""} ${e.details ?? ""}`;
  return (
    code === 5 ||
    code === "NOT_FOUND" ||
    text.includes("NOT_FOUND") ||
    text.includes("5 NOT_FOUND")
  );
}

export function formatFirestoreError(error: unknown): string {
  if (isFirestoreNotFoundError(error)) {
    return FIRESTORE_DATABASE_SETUP;
  }
  if (error instanceof Error) return error.message;
  return "Firestore request failed.";
}

export { FIRESTORE_DATABASE_SETUP };
