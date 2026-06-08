"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getClientDb, isFirebaseClientConfigured } from "./firebase";
import { RFQSchema, type RFQFormData, type RFQResult } from "./rfq-schema";

export async function submitRFQ(data: RFQFormData): Promise<RFQResult> {
  const parsed = RFQSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid form data",
    };
  }

  if (!isFirebaseClientConfigured()) {
    return {
      success: false,
      error:
        "RFQ submissions are temporarily unavailable. Firebase is not configured on this deployment.",
    };
  }

  try {
    const docRef = await addDoc(collection(getClientDb(), "rfq_submissions"), {
      ...parsed.data,
      createdAt: serverTimestamp(),
      status: "new",
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    const { formatFirestoreError } = await import("@/lib/firestore-errors");
    return { success: false, error: formatFirestoreError(error) };
  }
}
