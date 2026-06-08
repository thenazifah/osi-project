import { FieldValue } from "firebase-admin/firestore";
import { getAdminSessionEmail } from "@/lib/admin-auth";
import type { AuditCategory, AuditLogEntry } from "@/lib/admin-types";
import { getAdminDb, isAdminConfigured } from "@/lib/firebase-admin";

export const AUDIT_LOG_COLLECTION = "audit_logs";

export type AuditLogInput = {
  action: string;
  category: AuditCategory;
  summary: string;
  actor?: string | null;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, string | number | boolean>;
};

function timestampToIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  if (!isAdminConfigured()) return;

  try {
    const db = getAdminDb();
    const actor =
      input.actor?.trim() ||
      (await getAdminSessionEmail()) ||
      "unknown";

    await db.collection(AUDIT_LOG_COLLECTION).add({
      action: input.action,
      category: input.category,
      summary: input.summary,
      actor: actor.toLowerCase(),
      targetId: input.targetId ?? null,
      targetLabel: input.targetLabel ?? null,
      metadata: input.metadata ?? null,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch {
    /* never block admin actions if audit write fails */
  }
}

export async function listAuditLogs(limit = 200): Promise<AuditLogEntry[]> {
  const db = getAdminDb();
  let snap;

  try {
    snap = await db
      .collection(AUDIT_LOG_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
  } catch {
    snap = await db.collection(AUDIT_LOG_COLLECTION).limit(limit).get();
  }

  const rows = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      action: String(data.action ?? ""),
      category: (data.category as AuditCategory) ?? "sync",
      summary: String(data.summary ?? ""),
      actor: String(data.actor ?? "unknown"),
      targetId: data.targetId ? String(data.targetId) : undefined,
      targetLabel: data.targetLabel ? String(data.targetLabel) : undefined,
      metadata:
        data.metadata && typeof data.metadata === "object"
          ? (data.metadata as Record<string, string | number | boolean>)
          : undefined,
      createdAt: timestampToIso(data.createdAt),
    } satisfies AuditLogEntry;
  });

  return rows.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
}
