"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import type { Language, User } from "@/lib/types";
import { ViceVersa } from "@/components/brand/ViceVersa";
import { Field } from "@/components/ui/Field";
import { FieldLabel } from "@/components/ui/FieldLabel";

type Mode = "intro" | "signup" | "verify" | "choose";

interface AuthScreenProps {
  users: User[];
  onLogin: (id: string) => void;
  onCreateUser: (user: User) => void;
}

export function AuthScreen({ users, onLogin, onCreateUser }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("intro");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [native, setNative] = useState<Language>("NL");
  const [code, setCode] = useState("");
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!email.includes("@")) {
      setError("Geldig e-mailadres invullen.");
      return;
    }
    if (!name.trim()) {
      setError("Naam invullen.");
      return;
    }
    setError("");
    const other: Language = native === "NL" ? "FR" : "NL";
    setPendingUser({
      id: "u" + Date.now(),
      name: name.trim(),
      email: email.trim(),
      nativeLanguage: native,
      translates: [other],
      verified: false,
      joined: new Date().toISOString().slice(0, 10),
      bio: "",
      emailNotifications: true,
    });
    setMode("verify");
  };

  const handleVerify = () => {
    if (code !== "123456") {
      setError("Onjuiste code. Demo-code: 123456");
      return;
    }
    setError("");
    if (pendingUser) {
      onCreateUser({ ...pendingUser, verified: true });
    }
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
              <button onClick={() => setMode("signup")} className="cargo-btn-primary">
                aanmelden →
              </button>
              <button onClick={() => setMode("choose")} className="cargo-btn">
                Inloggen
              </button>
            </div>

            <div
              className="mt-32"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "#999",
                maxWidth: 480,
              }}
            >
              Demo · &quot;Inloggen&quot; om als bestaand lid rond te kijken · nieuw
              account: verificatiecode is 123456
            </div>
          </div>
        )}

        {mode === "signup" && (
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
                label="Naam"
                value={name}
                onChange={setName}
                placeholder="Voor- en achternaam"
              />
              <Field
                label="E-mailadres"
                value={email}
                onChange={setEmail}
                placeholder="naam@domein.be"
                type="email"
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
                  Je krijgt bericht wanneer iemand een vraag stelt over een tekst in
                  deze taal.
                </div>
              </div>

              {error && (
                <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>
              )}

              <button onClick={handleSignup} className="cargo-btn-primary w-full">
                Verificatie versturen
              </button>
            </div>
          </div>
        )}

        {mode === "verify" && (
          <div className="animate-fadeIn max-w-md mt-24">
            <Mail className="w-7 h-7 mb-6" style={{ color: "#666" }} strokeWidth={1.2} />
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
              We stuurden een verificatiecode naar{" "}
              <span style={{ color: "#111" }}>{pendingUser?.email}</span>
            </p>

            <FieldLabel>Verificatiecode</FieldLabel>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="cargo-input"
              style={{
                fontSize: 24,
                letterSpacing: "0.4em",
                fontFamily: "var(--font-mono)",
                textAlign: "center",
              }}
              placeholder="••••••"
            />

            {error && (
              <p style={{ fontSize: 12, color: "#a02020", marginTop: 8 }}>{error}</p>
            )}

            <button onClick={handleVerify} className="cargo-btn-primary w-full mt-8">
              Bevestigen
            </button>
            <p className="cargo-meta mt-6" style={{ fontSize: 10 }}>
              Demo-code: 123456
            </p>
          </div>
        )}

        {mode === "choose" && (
          <div className="animate-fadeIn max-w-md">
            <button onClick={() => setMode("intro")} className="cargo-back">
              ← Terug
            </button>
            <h2
              className="mt-12 mb-2"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              Kies een profiel.
            </h2>
            <p className="cargo-meta mb-8">Demo: log in als bestaand lid.</p>
            <div className="space-y-0">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => onLogin(u.id)}
                  className="vv-row w-full flex items-center justify-between py-4 border-t px-2"
                  style={{ borderColor: "#e5e5e0" }}
                >
                  <div className="text-left">
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 15 }}>
                      {u.name}
                    </div>
                    <div className="cargo-mono mt-0.5">
                      {u.nativeLanguage}-moedertaal · vertaalt naar{" "}
                      {u.translates.join(", ")}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-30" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
