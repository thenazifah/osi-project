import { getAdminAuth, isAdminConfigured } from "@/lib/firebase-admin";

export type VerifiedFirebaseUser = {
  email: string;
  uid: string;
};

function getApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
}

/** Verify ID token via Identity Toolkit (works with only the web API key). */
async function verifyIdTokenViaRest(
  idToken: string
): Promise<VerifiedFirebaseUser | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{ email?: string; localId?: string }>;
  };

  const user = data.users?.[0];
  if (!user?.email || !user.localId) return null;

  return { email: user.email, uid: user.localId };
}

/** Verify ID token with Firebase Admin SDK (requires service account). */
async function verifyIdTokenViaAdmin(
  idToken: string
): Promise<VerifiedFirebaseUser | null> {
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (!decoded.email || !decoded.uid) return null;
    return { email: decoded.email, uid: decoded.uid };
  } catch {
    return null;
  }
}

export async function verifyFirebaseIdToken(
  idToken: string
): Promise<VerifiedFirebaseUser | null> {
  if (!idToken?.trim()) return null;

  if (isAdminConfigured()) {
    const viaAdmin = await verifyIdTokenViaAdmin(idToken);
    if (viaAdmin) return viaAdmin;
  }

  return verifyIdTokenViaRest(idToken);
}
