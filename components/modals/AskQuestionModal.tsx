"use client";

import { useState } from "react";
import type { AppState, Book, Language } from "@/lib/types";
import { LANG_LABELS, TAGS } from "@/lib/constants";
import { Modal } from "./Modal";
import { Field } from "@/components/ui/Field";
import { FieldLabel } from "@/components/ui/FieldLabel";

export interface QuestionDraft {
  title: string;
  passage: string;
  page: string;
  text: string;
  tags: string[];
  targetAudience: Language[];
}

interface AskQuestionModalProps {
  book: Book;
  state: AppState;
  onClose: () => void;
  onSubmit: (q: QuestionDraft) => void;
}

export function AskQuestionModal({ book, state, onClose, onSubmit }: AskQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [passage, setPassage] = useState("");
  const [page, setPage] = useState("");
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<Language[]>(["NL", "FR"]);

  const toggleTag = (id: string) =>
    setSelectedTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  const toggleAudience = (lang: Language) =>
    setTargetAudience((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  const nativeSpeakers = state.users.filter(
    (u) => targetAudience.includes(u.nativeLanguage) && u.emailNotifications
  );

  return (
    <Modal title={`Vraag stellen — ${book.code}`} onClose={onClose} wide>
      <div className="mb-5 pb-5 border-b" style={{ borderColor: "#e8e8e3" }}>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 20,
            letterSpacing: "-0.01em",
          }}
        >
          {book.title}
        </div>
        <div className="cargo-mono mt-1" style={{ color: "#777" }}>
          {book.author} · {book.sourceLanguage}→{book.targetLanguage}
        </div>
      </div>

      <div className="space-y-6">
        <Field
          label="Korte titel"
          value={title}
          onChange={setTitle}
          placeholder="Hoe vertaal je…?"
        />

        <div className="vv-grid-passage">
          <div>
            <FieldLabel>Passage uit het origineel (optioneel)</FieldLabel>
            <textarea
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              rows={2}
              className="cargo-input"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 14,
              }}
              placeholder="De passage waar het om gaat…"
            />
          </div>
          <Field label="Pagina" value={page} onChange={setPage} placeholder="—" />
        </div>

        <div>
          <FieldLabel>Je vraag</FieldLabel>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="cargo-input"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 14,
              lineHeight: 1.55,
            }}
            placeholder="Wat dwarsboomt je, wat heb je al geprobeerd?"
          />
        </div>

        <div>
          <FieldLabel>Tags · gelijkaardige vragen bundelen</FieldLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {TAGS.map((t) => {
              const active = selectedTags.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className="vv-tag-chip"
                  style={{
                    backgroundColor: active ? "#111" : "transparent",
                    color: active ? "#fafaf8" : "#666",
                    borderColor: active ? "#111" : "#c8c8c0",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel>Voor wie is deze vraag bedoeld?</FieldLabel>
          <div className="flex flex-wrap gap-5 mt-2">
            {(["NL", "FR"] as Language[]).map((lang) => (
              <label
                key={lang}
                className="flex items-center gap-2 cursor-pointer cargo-mono"
                style={{ fontSize: 13, color: "#444" }}
              >
                <input
                  type="checkbox"
                  checked={targetAudience.includes(lang)}
                  onChange={() => toggleAudience(lang)}
                  style={{ accentColor: "#111" }}
                />
                Moedertaalsprekers {LANG_LABELS[lang]}
              </label>
            ))}
          </div>
          {targetAudience.length === 0 && (
            <p
              className="cargo-mono mt-1"
              style={{ color: "#c0392b", fontSize: 11 }}
            >
              Kies minstens één doelgroep.
            </p>
          )}
        </div>

        {nativeSpeakers.length > 0 && (
          <div
            className="p-4 border"
            style={{ backgroundColor: "#f0eee5", borderColor: "#d8d8d0" }}
          >
            <div className="cargo-mono mb-2" style={{ color: "#111" }}>
              ↳ Notificatie
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 13,
                lineHeight: 1.55,
                color: "#444",
              }}
            >
              {nativeSpeakers.length} {nativeSpeakers.length === 1 ? "lid" : "leden"} uit de gekozen doelgroep ontvangt automatisch een e-mail:
              <div className="cargo-mono mt-2" style={{ color: "#555", fontSize: 10 }}>
                {nativeSpeakers.map((u) => u.name).join(" · ")}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (title.trim() && text.trim() && targetAudience.length > 0) {
              onSubmit({
                title: title.trim(),
                passage: passage.trim(),
                page: page.trim(),
                text: text.trim(),
                tags: selectedTags,
                targetAudience,
              });
            }
          }}
          disabled={!title.trim() || !text.trim() || targetAudience.length === 0}
          className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Vraag plaatsen →
        </button>
      </div>
    </Modal>
  );
}
