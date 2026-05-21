"use client";

import type { Book, Question, User } from "@/lib/types";
import { LANG_LABELS } from "@/lib/constants";
import { Modal } from "./Modal";

export interface EmailPreviewInfo {
  question: Question;
  book: Book;
  targets: User[];
}

interface EmailPreviewModalProps {
  info: EmailPreviewInfo;
  onClose: () => void;
}

export function EmailPreviewModal({ info, onClose }: EmailPreviewModalProps) {
  const { question, book, targets } = info;
  return (
    <Modal title="E-mail verstuurd ✓" onClose={onClose} wide>
      {targets.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 15,
            color: "#444",
          }}
        >
          Geen leden met{" "}
          <strong>{LANG_LABELS[book.sourceLanguage]}</strong> als moedertaal — niemand
          kreeg bericht. De vraag staat wel in de bibliotheek.
        </p>
      ) : (
        <>
          <div className="cargo-mono mb-4" style={{ color: "#777" }}>
            Verzonden aan {targets.length} {LANG_LABELS[book.sourceLanguage]}-moedertaalspreker
            {targets.length > 1 ? "s" : ""}:
          </div>
          <div className="cargo-mono mb-6" style={{ color: "#111" }}>
            {targets.map((t) => t.email).join(" · ")}
          </div>

          <div
            className="border p-6"
            style={{ borderColor: "#d8d8d0", backgroundColor: "#fff" }}
          >
            <div
              className="cargo-mono mb-4 pb-4 border-b"
              style={{ color: "#777", borderColor: "#e8e8e3" }}
            >
              Van: ¿ vice versa ? &lt;noreply@viceversa.be&gt;
              <br />
              Onderwerp: Vraag over een {LANG_LABELS[book.sourceLanguage]}e tekst
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 15,
                lineHeight: 1.55,
                color: "#222",
              }}
            >
              <p>Beste collega,</p>
              <p className="mt-3">
                Een lid heeft een vraag gesteld bij <em>{book.title}</em> van {book.author}{" "}
                — een tekst in jouw moedertaal ({LANG_LABELS[book.sourceLanguage]}).
                Misschien kun je iets bijdragen.
              </p>
              <div
                className="mt-4 p-4 border-l-2"
                style={{ borderColor: "#c4a559", backgroundColor: "#faf7ee" }}
              >
                <div className="cargo-mono mb-2" style={{ color: "#777" }}>
                  {book.code} · {book.title}
                  {question.tags && question.tags.length > 0 &&
                    ` · ${question.tags.join(", ")}`}
                </div>
                <div style={{ fontWeight: 500 }}>{question.title}</div>
              </div>
              <p className="mt-4">
                <span style={{ textDecoration: "underline" }}>
                  Lees de vraag en antwoord →
                </span>
              </p>
              <p className="mt-6 text-sm" style={{ color: "#777" }}>
                Vriendelijke groet,
                <br />¿ vice versa ?
              </p>
            </div>
          </div>
        </>
      )}
      <button onClick={onClose} className="cargo-btn-primary w-full mt-6">
        Sluiten
      </button>
    </Modal>
  );
}
