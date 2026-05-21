"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ViceVersa } from "@/components/brand/ViceVersa";
import { Field } from "@/components/ui/Field";
import { FieldLabel } from "@/components/ui/FieldLabel";

type Mode = "intro" | "signin" | "sent";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("intro");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSendLink = async () => {
    if (!email.includes("@")) {
      setError("Geldig e-mailadres invullen.");
      return;
    }
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setMode("sent");
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
                onClick={() => setMode("signin")}
                className="cargo-btn-primary"
              >
                aanmelden →
              </button>
            </div>
          </div>
        )}

        {mode === "signin" && (
          <div className="animate-fadeIn max-w-md">
            <button onClick={() => setMode("intro")} className="cargo-back">
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
              Meld je aan.
            </h2>

            <div className="space-y-7">
              <Field
                label="E-mailadres"
                value={email}
                onChange={setEmail}
                placeholder="naam@domein.be"
                type="email"
              />

              <div className="cargo-meta" style={{ fontSize: 12, color: "#666" }}>
                Je krijgt een e-mail met een klikbare link. Geen wachtwoord nodig.
              </div>

              {error && (
                <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>
              )}

              <button
                onClick={handleSendLink}
                disabled={busy}
                className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {busy ? "Versturen…" : "Stuur me een link"}
              </button>
            </div>
          </div>
        )}

        {mode === "sent" && (
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
              We stuurden een aanmeldlink naar{" "}
              <span style={{ color: "#111" }}>{email}</span>. Klik op de link in
              die e-mail om binnen te komen.
            </p>

            <FieldLabel>Geen mail ontvangen?</FieldLabel>
            <p className="cargo-meta mt-2" style={{ fontSize: 12 }}>
              Kijk in je spam-folder. Of probeer het over een paar minuten
              opnieuw — Supabase verstuurt maximaal 4 mails per uur op het
              gratis abonnement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
