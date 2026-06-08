"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { loginAdminWithFirebase } from "@/lib/admin-actions";
import {
  isFirebaseAuthAvailable,
  signInWithEmailPassword,
  signInWithGoogle,
  signOutFirebase,
} from "@/lib/firebase-client-auth";
import { OsiLogo } from "@/components/brand/OsiLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginForm() {
  const firebaseReady = isFirebaseAuthAvailable();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const showError = (message: string) => {
    setError(message);
    setShakeError(true);
    window.setTimeout(() => setShakeError(false), 500);
  };

  const completeLogin = async (
    getUser: () => Promise<{ getIdToken: () => Promise<string> }>
  ) => {
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

      showError(result.error ?? "Sign in failed");
      await signOutFirebase().catch(() => undefined);
    } catch (err: unknown) {
      const code =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof (err as { code: unknown }).code === "string"
          ? (err as { code: string }).code
          : undefined;
      showError(firebaseAuthErrorMessage(code));
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

  const inputClass =
    "h-12 rounded-xl border-border/80 bg-bg/50 pl-11 pr-11 font-sans text-[15px] shadow-[inset_0_1px_2px_rgba(11,31,42,0.04)] transition-all duration-200 placeholder:text-ink-muted/60 focus:border-accent-2/50 focus:bg-surface focus:shadow-[0_0_0_3px_rgba(27,138,138,0.12)] focus-visible:outline-none";

  return (
    <div className="p-8 sm:p-10">
      <div className="admin-login-enter admin-login-enter-1 mb-8 flex items-center gap-3 lg:hidden">
        <OsiLogo size={40} priority />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
            OSI Admin
          </p>
          <p className="font-sans text-xs text-ink-muted">Content dashboard</p>
        </div>
      </div>

      <div className="admin-login-enter admin-login-enter-2 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          Welcome back
        </p>
        <h1 className="font-display text-2xl text-ink sm:text-[1.75rem]">
          Sign in to dashboard
        </h1>
        <p className="font-sans text-sm leading-relaxed text-ink-muted">
          Use your approved email or Google account to manage products, RFQs, and
          site content.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {!firebaseReady ? (
          <div
            className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 backdrop-blur-sm"
            role="alert"
          >
            <ShieldAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              strokeWidth={1.75}
            />
            <div className="space-y-1">
              <p className="font-sans text-sm font-medium text-amber-900">
                Firebase is not configured on this deployment
              </p>
              <p className="font-sans text-sm leading-snug text-amber-800/90">
                Add all <code className="text-xs">NEXT_PUBLIC_FIREBASE_*</code>{" "}
                variables in Vercel, then redeploy so the client bundle is
                rebuilt with them.
              </p>
            </div>
          </div>
        ) : null}

        <form onSubmit={onEmailSubmit} className="space-y-5">
          <div className="admin-login-enter admin-login-enter-3 space-y-2">
            <Label htmlFor="email" className="font-sans text-sm text-ink">
              Email address
            </Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/70"
                strokeWidth={1.75}
              />
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
                disabled={isPending || !firebaseReady}
              />
            </div>
          </div>

          <div className="admin-login-enter admin-login-enter-4 space-y-2">
            <Label htmlFor="password" className="font-sans text-sm text-ink">
              Password
            </Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/70"
                strokeWidth={1.75}
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(inputClass, "pr-12")}
                required
                disabled={isPending || !firebaseReady}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/40"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          <div className="admin-login-enter admin-login-enter-5 pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="admin-login-btn h-12 w-full rounded-xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in with email"
              )}
            </Button>
          </div>
        </form>

        <div className="admin-login-enter admin-login-enter-6 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/80" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface/90 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted backdrop-blur-sm">
              or continue with
            </span>
          </div>
        </div>

        <div className="admin-login-enter admin-login-enter-7">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="admin-login-btn h-12 w-full rounded-xl border-border/80 bg-surface/80 hover:border-accent/30 hover:bg-surface"
            disabled={isPending || !firebaseReady}
            onClick={onGoogleSignIn}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-5 w-5" />
            )}
            Continue with Google
          </Button>
        </div>

        {error ? (
          <div
            className={cn(
              "admin-login-error flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 backdrop-blur-sm",
              shakeError && "admin-login-shake"
            )}
            role="alert"
          >
            <ShieldAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              strokeWidth={1.75}
            />
            <p className="font-sans text-sm leading-snug text-red-700">{error}</p>
          </div>
        ) : null}
      </div>

      <p className="admin-login-enter admin-login-enter-8 mt-8 text-center font-sans text-xs text-ink-muted/80">
        Access restricted to approved administrators only.
      </p>
    </div>
  );
}
