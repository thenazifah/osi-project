"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdminWithFirebase } from "@/lib/admin-actions";
import {
  signInWithEmailPassword,
  signInWithGoogle,
  signOutFirebase,
} from "@/lib/firebase-client-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function firebaseAuthErrorMessage(code: string | undefined): string {
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    default:
      return "Sign-in failed. Check your email and password.";
  }
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const completeLogin = async (getUser: () => Promise<{ getIdToken: () => Promise<string> }>) => {
    setError(null);
    try {
      const user = await getUser();
      const idToken = await user.getIdToken();
      const result = await loginAdminWithFirebase(idToken);

      if (result.success) {
        router.push("/admin");
        router.refresh();
        return;
      }

      setError(result.error ?? "Sign in failed");
      await signOutFirebase().catch(() => undefined);
    } catch (err: unknown) {
      const code =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof (err as { code: unknown }).code === "string"
          ? (err as { code: string }).code
          : undefined;
      setError(firebaseAuthErrorMessage(code));
      await signOutFirebase().catch(() => undefined);
    }
  };

  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() =>
      completeLogin(() => signInWithEmailPassword(email, password))
    );
  };

  const onGoogleSignIn = () => {
    startTransition(() => completeLogin(signInWithGoogle));
  };

  return (
    <div className="mt-8 space-y-6">
      <form onSubmit={onEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Gmail / email</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in with email"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 font-mono tracking-widest text-ink-muted">
            or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isPending}
        onClick={onGoogleSignIn}
      >
        Continue with Google
      </Button>

      {error ? (
        <p className="font-sans text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
