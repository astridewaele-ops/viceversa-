"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ViceVersa } from "@/components/brand/ViceVersa";
import { Field } from "@/components/ui/Field";

type Stage = "checking" | "ready" | "no-session" | "saved";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // De gebruiker moet via de reset-link binnenkomen; dan is er via
  // /auth/callback al een sessie aangemaakt. Zonder sessie sturen we
  // terug naar de homepagina.
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setStage(data.user ? "ready" : "no-session");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens lang zijn.");
      return;
    }
    if (password !== confirm) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setStage("saved");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#fafaf8", color: "#111" }}
    >
      <div className="w-full max-w-3xl mx-auto px-8 py-16">
        <div className="animate-fadeIn max-w-md">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#999",
            }}
          >
            <ViceVersa /> · Wachtwoord opnieuw instellen
          </div>

          {stage === "checking" && (
            <p className="cargo-mono mt-12" style={{ color: "#666" }}>
              Laden…
            </p>
          )}

          {stage === "no-session" && (
            <>
              <h2
                className="mt-12 mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 40,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                Link verlopen.
              </h2>
              <p className="cargo-meta mb-10">
                Deze reset-link is niet meer geldig. Vraag op de inlogpagina een
                nieuwe link aan.
              </p>
              <button
                onClick={() => router.push("/")}
                className="cargo-btn-primary"
              >
                Naar inloggen →
              </button>
            </>
          )}

          {stage === "ready" && (
            <>
              <h2
                className="mt-12 mb-10"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 40,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                Kies een nieuw wachtwoord.
              </h2>

              <div className="space-y-7">
                <Field
                  label="Nieuw wachtwoord"
                  value={password}
                  onChange={setPassword}
                  placeholder="Minstens 8 tekens"
                  type="password"
                />
                <Field
                  label="Herhaal wachtwoord"
                  value={confirm}
                  onChange={setConfirm}
                  placeholder="••••••••"
                  type="password"
                />

                {error && (
                  <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>
                )}

                <button
                  onClick={handleSave}
                  disabled={busy}
                  className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {busy ? "Opslaan…" : "Wachtwoord opslaan"}
                </button>
              </div>
            </>
          )}

          {stage === "saved" && (
            <>
              <h2
                className="mt-12 mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 40,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                Klaar.
              </h2>
              <p className="cargo-meta mb-10">
                Je wachtwoord is bijgewerkt. Je bent automatisch ingelogd.
              </p>
              <button
                onClick={() => router.push("/")}
                className="cargo-btn-primary"
              >
                Verder →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
