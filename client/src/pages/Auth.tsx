import { ArrowLeft, ArrowRight, Check, CircleAlert, Fingerprint, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

const callbackMessages: Record<string, string> = {
  cancelled: "Sign-in was cancelled. You can safely try again whenever you’re ready.",
  invalid_state: "We couldn’t verify this sign-in request. Please start again from CAPVY.",
  oauth_response: "The sign-in provider did not return a complete response. Please try again.",
  unavailable: "Secure sign-in is temporarily unavailable. Please try again in a moment.",
};

function readCallbackMessage() {
  if (typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("error");
  return code ? callbackMessages[code] ?? callbackMessages.unavailable : null;
}

export default function AuthPage() {
  const [path] = useLocation();
  const isSignup = path === "/signup";
  const { loading, error: sessionError, isAuthenticated, logout } = useAuth();
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const callbackMessage = readCallbackMessage();

  const continueToManus = () => {
    setLaunchError(null);
    setIsRedirecting(true);
    try {
      startLogin();
    } catch {
      setIsRedirecting(false);
      setLaunchError("Secure sign-in is not configured right now. Please try again later.");
    }
  };

  const signOut = async () => {
    setSignOutError(null);
    setIsSigningOut(true);
    try {
      await logout();
    } catch {
      setSignOutError("We couldn’t sign you out just now. Please retry.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const selectedError = launchError ?? signOutError ?? callbackMessage;

  return (
    <div className="page-stack auth-page">
      <section className="auth-editorial" aria-labelledby="auth-page-title">
        <p className="eyebrow"><span className="eyebrow-line" /> CAPVY ACCOUNT ACCESS</p>
        <h2 id="auth-page-title">Build confidence before the next money move.</h2>
        <p className="auth-editorial-copy">Sign in to CAPVY through Manus and return to a space built for thoughtful financial practice.</p>
        <div className="auth-assurance-list">
          <div><ShieldCheck size={17} aria-hidden="true" /><span>Learning and simulation only—no real trades.</span></div>
          <div><LockKeyhole size={17} aria-hidden="true" /><span>No bank or brokerage credentials are requested.</span></div>
          <div><Fingerprint size={17} aria-hidden="true" /><span>Secure account creation and sign-in happen with Manus.</span></div>
        </div>
        <p className="auth-editorial-note">CAPVY does not yet sync learning progress across devices. No separate CAPVY password is stored.</p>
      </section>

      <section className="auth-card panel" aria-labelledby="auth-card-title">
        <div className="auth-card-topline">
          <span className="panel-label"><UserRound size={14} aria-hidden="true" /> ACCOUNT</span>
          <span className="auth-provider-chip"><span /> MANUS SECURE SIGN-IN</span>
        </div>

        {isAuthenticated ? (
          <div className="auth-success-state" role="status" aria-live="polite">
            <span className="auth-success-mark"><Check size={20} aria-hidden="true" /></span>
            <p className="eyebrow">SESSION ACTIVE</p>
            <h2 id="auth-card-title">You’re signed in.</h2>
            <p>Your CAPVY account is connected through Manus.</p>
            <div className="auth-card-actions">
              <Link href="/" className="button-primary">Continue to overview <ArrowRight size={15} /></Link>
              <button type="button" className="button-secondary" onClick={() => void signOut()} disabled={isSigningOut}>
                {isSigningOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
            {signOutError && <p className="auth-error" role="alert"><CircleAlert size={15} />{signOutError}</p>}
          </div>
        ) : (
          <>
            <nav className="auth-mode-switch" aria-label="Choose account access mode">
              <Link href="/signup" className={`auth-mode-link ${isSignup ? "selected" : ""}`} aria-current={isSignup ? "page" : undefined}>Create account</Link>
              <Link href="/login" className={`auth-mode-link ${!isSignup ? "selected" : ""}`} aria-current={!isSignup ? "page" : undefined}>Log in</Link>
            </nav>
            <p className="eyebrow">{isSignup ? "A CLEARER START" : "GOOD TO SEE YOU AGAIN"}</p>
            <h2 id="auth-card-title">{isSignup ? "Create your account" : "Log in to CAPVY"}</h2>
            <p className="auth-card-description">
              {isSignup
                ? "Continue to Manus to create or connect your account. New to Manus? You can create an account securely on the next screen."
                : "Continue to Manus to securely verify your account and return to your financial practice space."}
            </p>

            {loading && <p className="auth-session-check" role="status">Checking for an existing CAPVY session…</p>}
            {!loading && sessionError && <p className="auth-session-check" role="status">We couldn’t confirm an existing session, but you can still continue securely.</p>}
            {selectedError && <p className="auth-error" role="alert"><CircleAlert size={15} />{selectedError}</p>}

            <button type="button" className="button-primary auth-provider-button" onClick={continueToManus} disabled={isRedirecting}>
              {isRedirecting ? "Opening Manus…" : isSignup ? "Continue to create account" : "Continue to sign in"}
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <p className="auth-provider-note">Your sign-up or sign-in is handled by Manus. CAPVY never asks for a separate password, bank login or broker login.</p>
            <div className="auth-card-footer">
              <Link href="/" className="auth-back-link"><ArrowLeft size={14} /> Back to overview</Link>
              <span>EDUCATION · NOT TRADING</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
