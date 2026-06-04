"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { RFQSchema, type RFQFormData, type RFQResult } from "./rfq-schema";

export async function submitRFQ(data: RFQFormData): Promise<RFQResult> {
  const parsed = RFQSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid form data",
    };
  }

  try {
    const docRef = await addDoc(collection(db, "rfq_submissions"), {
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
