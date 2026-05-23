"use client";

import { useState } from "react";
import type { Book, Question, User } from "@/lib/types";
import { LANG_LABELS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "./Modal";
import { DlRow } from "@/components/ui/DlRow";
import { Field } from "@/components/ui/Field";
import { Stat } from "@/components/ui/Stat";

interface ProfileModalProps {
  user: User;
  questions: Question[];
  books: Book[];
  users: User[];
  onClose: () => void;
  onToggleNotifications: () => void;
}

export function ProfileModal({
  user,
  questions,
  onClose,
  onToggleNotifications,
}: ProfileModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  const handleChangePassword = async () => {
    setPwSaved(false);
    if (newPassword.length < 8) {
      setPwError("Wachtwoord moet minimaal 8 tekens lang zijn.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("De wachtwoorden komen niet overeen.");
      return;
    }
    setPwError("");
    setPwBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwBusy(false);
    if (error) {
      setPwError(error.message);
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPwSaved(true);
  };
  const myQuestions = questions.filter((q) => q.askerId === user.id);
  const myAnswers = questions.flatMap((q) =>
    q.answers
      .filter((a) => a.authorId === user.id)
      .map((a) => ({ ...a, question: q }))
  );
  const helped = new Set<string>();
  questions.forEach((q) =>
    q.answers.forEach((a) => {
      if (a.authorId === user.id) helped.add(q.askerId);
    })
  );

  return (
    <Modal title={`Profiel — ${user.name}`} onClose={onClose} wide>
      <div className="space-y-8">
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {user.name}
          </div>
          {user.bio && (
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 15,
                fontStyle: "italic",
                color: "#555",
              }}
            >
              {user.bio}
            </p>
          )}
        </div>
        <dl
          className="grid grid-cols-2 gap-y-3 gap-x-8 pt-6 border-t"
          style={{ borderColor: "#e8e8e3" }}
        >
          <DlRow label="Moedertaal" value={LANG_LABELS[user.nativeLanguage]} />
          <DlRow
            label="Vertaalt naar"
            value={user.translates.map((l) => LANG_LABELS[l]).join(", ") || "—"}
          />
          <DlRow label="Lid sinds" value={user.joined} />
          <DlRow label="E-mail" value={user.email} />
        </dl>
        <div
          className="grid grid-cols-3 gap-4 pt-6 border-t"
          style={{ borderColor: "#e8e8e3" }}
        >
          <Stat label="Vragen gesteld" value={myQuestions.length} />
          <Stat label="Antwoorden gegeven" value={myAnswers.length} />
          <Stat label="Mensen geholpen" value={helped.size} />
        </div>

        <div
          className="pt-6 border-t flex items-start justify-between gap-6"
          style={{ borderColor: "#e8e8e3" }}
        >
          <div className="flex-1 min-w-0">
            <div className="cargo-mono" style={{ color: "#777" }}>
              E-mailmeldingen
            </div>
            <p
              className="mt-1.5"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 14,
                lineHeight: 1.55,
                color: "#444",
              }}
            >
              {user.emailNotifications
                ? "Je krijgt bericht bij nieuwe vragen."
                : "Je krijgt geen bericht bij nieuwe vragen."}
            </p>
          </div>
          <button
            onClick={onToggleNotifications}
            className={user.emailNotifications ? "cargo-btn-primary" : "cargo-btn"}
          >
            {user.emailNotifications ? "Aan" : "Uit"}
          </button>
        </div>

        <div
          className="pt-6 border-t space-y-4"
          style={{ borderColor: "#e8e8e3" }}
        >
          <div className="cargo-mono" style={{ color: "#777" }}>
            Wachtwoord wijzigen
          </div>
          <Field
            label="Nieuw wachtwoord"
            value={newPassword}
            onChange={(v) => {
              setNewPassword(v);
              setPwSaved(false);
            }}
            placeholder="Minstens 8 tekens"
            type="password"
          />
          <Field
            label="Herhaal nieuw wachtwoord"
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v);
              setPwSaved(false);
            }}
            placeholder="••••••••"
            type="password"
          />
          {pwError && (
            <p style={{ fontSize: 12, color: "#a02020" }}>{pwError}</p>
          )}
          {pwSaved && (
            <p style={{ fontSize: 12, color: "#2a7a2a" }}>
              Wachtwoord bijgewerkt.
            </p>
          )}
          <button
            onClick={handleChangePassword}
            disabled={pwBusy || !newPassword || !confirmPassword}
            className="cargo-btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {pwBusy ? "Opslaan…" : "Wachtwoord opslaan"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
