"use client";

import { useState } from "react";
import type { Language } from "@/lib/types";
import { Field } from "@/components/ui/Field";
import { FieldLabel } from "@/components/ui/FieldLabel";

interface ProfileSetupProps {
  email: string;
  onSubmit: (name: string, nativeLanguage: Language) => Promise<void>;
}

export function ProfileSetup({ email, onSubmit }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [native, setNative] = useState<Language>("NL");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Vul je naam in.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await onSubmit(name.trim(), native);
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Er ging iets mis.");
    }
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
            Welkom · {email}
          </div>
          <h2
            className="mt-12 mb-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 40,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Stel je profiel in.
          </h2>
          <p className="cargo-meta mb-10">
            Twee dingen die we van je willen weten.
          </p>

          <div className="space-y-7">
            <Field
              label="Naam"
              value={name}
              onChange={setName}
              placeholder="Voor- en achternaam"
            />

            <div>
              <FieldLabel>Moedertaal</FieldLabel>
              <select
                value={native}
                onChange={(e) => setNative(e.target.value as Language)}
                className="cargo-input"
              >
                <option value="NL">Nederlands</option>
                <option value="FR">Frans</option>
              </select>
              <div className="cargo-meta mt-2" style={{ fontSize: 10 }}>
                Je krijgt bericht wanneer iemand een vraag stelt over vertalen
                vanuit deze taal.
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={busy || !name.trim()}
              className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {busy ? "Opslaan…" : "Profiel aanmaken"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
