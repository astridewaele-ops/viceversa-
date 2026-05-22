"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ViceVersa } from "@/components/brand/ViceVersa";
import { Field } from "@/components/ui/Field";
import { FieldLabel } from "@/components/ui/FieldLabel";

type Mode =
  | "intro"
  | "signin"
  | "signup"
  | "confirm-email"
  | "forgot"
  | "forgot-sent";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("intro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setError("");
    setPassword("");
  };

  const handleSignIn = async () => {
    if (!email.includes("@")) {
      setError("Geldig e-mailadres invullen.");
      return;
    }
    if (password.length < 1) {
      setError("Wachtwoord invullen.");
      return;
    }
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    // De sessie wordt door @supabase/ssr in cookies opgeslagen;
    // page.tsx pikt dit op via onAuthStateChange.
  };

  const handleSignUp = async () => {
    if (!email.includes("@")) {
      setError("Geldig e-mailadres invullen.");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens lang zijn.");
      return;
    }
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // Als e-mailbevestiging aanstaat in Supabase, is er nog geen session.
    // Anders is de gebruiker meteen ingelogd.
    if (!data.session) {
      setMode("confirm-email");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.includes("@")) {
      setError("Geldig e-mailadres invullen.");
      return;
    }
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      }
    );
    setBusy(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMode("forgot-sent");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#fafaf8", color: "#111" }}
    >
      <div className="w-full max-w-3xl mx-auto px-8 py-16">
        {mode === "intro" && (
          <div className="animate-fadeIn">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#999",
              }}
            >
              appeler un.e ami.e
            </div>
            <h1
              className="mt-12 mb-10"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(56px, 9vw, 120px)",
                fontWeight: 300,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              <ViceVersa />
            </h1>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: 700,
              }}
            >
              Vragen van en voor vertalers.
            </h2>

            <div className="mt-12 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setMode("signin");
                }}
                className="cargo-btn-primary"
              >
                inloggen →
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setMode("signup");
                }}
                className="cargo-btn-primary"
                style={{ backgroundColor: "transparent", color: "#111" }}
              >
                nieuw account →
              </button>
            </div>
          </div>
        )}

        {mode === "signin" && (
          <div className="animate-fadeIn max-w-md">
            <button
              onClick={() => {
                resetForm();
                setMode("intro");
              }}
              className="cargo-back"
            >
              ← Terug
            </button>
            <h2
              className="mt-12 mb-10"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 40,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Log in.
            </h2>

            <div className="space-y-7">
              <Field
                label="E-mailadres"
                value={email}
                onChange={setEmail}
                placeholder="naam@domein.be"
                type="email"
              />
              <Field
                label="Wachtwoord"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                type="password"
              />

              {error && (
                <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>
              )}

              <button
                onClick={handleSignIn}
                disabled={busy}
                className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {busy ? "Inloggen…" : "Inloggen"}
              </button>

              <div className="cargo-meta" style={{ fontSize: 12, color: "#666" }}>
                <button
                  onClick={() => {
                    resetForm();
                    setMode("forgot");
                  }}
                  style={{ textDecoration: "underline", color: "#111" }}
                >
                  Wachtwoord vergeten?
                </button>
              </div>

              <div className="cargo-meta" style={{ fontSize: 12, color: "#666" }}>
                Nog geen account?{" "}
                <button
                  onClick={() => {
                    resetForm();
                    setMode("signup");
                  }}
                  style={{ textDecoration: "underline", color: "#111" }}
                >
                  Registreer hier
                </button>
                .
              </div>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div className="animate-fadeIn max-w-md">
            <button
              onClick={() => {
                resetForm();
                setMode("intro");
              }}
              className="cargo-back"
            >
              ← Terug
            </button>
            <h2
              className="mt-12 mb-10"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 40,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Maak een account.
            </h2>

            <div className="space-y-7">
              <Field
                label="E-mailadres"
                value={email}
                onChange={setEmail}
                placeholder="naam@domein.be"
                type="email"
              />
              <Field
                label="Wachtwoord"
                value={password}
                onChange={setPassword}
                placeholder="Minstens 8 tekens"
                type="password"
              />

              {error && (
                <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>
              )}

              <button
                onClick={handleSignUp}
                disabled={busy}
                className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {busy ? "Registreren…" : "Account aanmaken"}
              </button>

              <div className="cargo-meta" style={{ fontSize: 12, color: "#666" }}>
                Heb je al een account?{" "}
                <button
                  onClick={() => {
                    resetForm();
                    setMode("signin");
                  }}
                  style={{ textDecoration: "underline", color: "#111" }}
                >
                  Log hier in
                </button>
                .
              </div>
            </div>
          </div>
        )}

        {mode === "forgot" && (
          <div className="animate-fadeIn max-w-md">
            <button
              onClick={() => {
                resetForm();
                setMode("signin");
              }}
              className="cargo-back"
            >
              ← Terug
            </button>
            <h2
              className="mt-12 mb-6"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 40,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Wachtwoord vergeten?
            </h2>
            <p className="cargo-meta mb-10">
              Vul je e-mailadres in. We sturen je een link waarmee je een nieuw
              wachtwoord kunt instellen.
            </p>

            <div className="space-y-7">
              <Field
                label="E-mailadres"
                value={email}
                onChange={setEmail}
                placeholder="naam@domein.be"
                type="email"
              />

              {error && (
                <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={busy}
                className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {busy ? "Versturen…" : "Stuur reset-link"}
              </button>
            </div>
          </div>
        )}

        {mode === "forgot-sent" && (
          <div className="animate-fadeIn max-w-md mt-24">
            <Mail
              className="w-7 h-7 mb-6"
              style={{ color: "#666" }}
              strokeWidth={1.2}
            />
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Controleer je inbox.
            </h2>
            <p className="cargo-meta mt-3 mb-12">
              Als er een account bestaat voor{" "}
              <span style={{ color: "#111" }}>{email}</span>, hebben we daar een
              reset-link naartoe gestuurd. Klik op de link in die e-mail om een
              nieuw wachtwoord in te stellen.
            </p>

            <FieldLabel>Geen mail ontvangen?</FieldLabel>
            <p className="cargo-meta mt-2" style={{ fontSize: 12 }}>
              Kijk in je spam-folder. Supabase verstuurt maximaal 4 mails per
              uur op het gratis abonnement, dus probeer het anders over een
              paar minuten opnieuw.
            </p>

            <button
              onClick={() => {
                resetForm();
                setMode("signin");
              }}
              className="cargo-btn-primary mt-10"
            >
              Naar inloggen →
            </button>
          </div>
        )}

        {mode === "confirm-email" && (
          <div className="animate-fadeIn max-w-md mt-24">
            <Mail
              className="w-7 h-7 mb-6"
              style={{ color: "#666" }}
              strokeWidth={1.2}
            />
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Bevestig je e-mailadres.
            </h2>
            <p className="cargo-meta mt-3 mb-12">
              We stuurden een bevestigingsmail naar{" "}
              <span style={{ color: "#111" }}>{email}</span>. Klik op de link in
              die e-mail om je account te activeren. Daarna kun je inloggen met
              je wachtwoord.
            </p>

            <FieldLabel>Geen mail ontvangen?</FieldLabel>
            <p className="cargo-meta mt-2" style={{ fontSize: 12 }}>
              Kijk in je spam-folder, of probeer het over een paar minuten
              opnieuw.
            </p>

            <button
              onClick={() => {
                resetForm();
                setMode("signin");
              }}
              className="cargo-btn-primary mt-10"
            >
              Naar inloggen →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
