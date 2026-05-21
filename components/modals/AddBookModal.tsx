"use client";

import { useState } from "react";
import type { CoverStyle, Language } from "@/lib/types";
import { Modal } from "./Modal";
import { Field } from "@/components/ui/Field";
import { FieldLabel } from "@/components/ui/FieldLabel";

export interface BookDraft {
  title: string;
  author: string;
  year: number;
  sourceLanguage: Language;
  targetLanguage: Language;
  coverStyle: CoverStyle;
}

interface AddBookModalProps {
  onClose: () => void;
  onSubmit: (book: BookDraft) => void;
}

const COVER_STYLES: CoverStyle[] = [
  { bg: "#3a2f1f", accent: "#c4a559", pattern: "horizontal" },
  { bg: "#7a1f2b", accent: "#e8d5a8", pattern: "ornate" },
  { bg: "#1f2a3a", accent: "#b89c5a", pattern: "vertical" },
  { bg: "#2a4a3a", accent: "#e8a59f", pattern: "minimal" },
  { bg: "#5a4a6a", accent: "#f0e8d5", pattern: "wavy" },
  { bg: "#d4823a", accent: "#3a1f1a", pattern: "tropical" },
  { bg: "#1a1a1a", accent: "#c4302b", pattern: "modern" },
];

export function AddBookModal({ onClose, onSubmit }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [src, setSrc] = useState<Language>("NL");
  const tgt: Language = src === "NL" ? "FR" : "NL";

  return (
    <Modal title="Boek toevoegen aan de bibliotheek" onClose={onClose} wide>
      <div className="space-y-5">
        <Field label="Titel" value={title} onChange={setTitle} />
        <Field label="Auteur" value={author} onChange={setAuthor} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Jaar" value={year} onChange={setYear} placeholder="2024" />
          <div>
            <FieldLabel>Richting</FieldLabel>
            <select
              value={src}
              onChange={(e) => setSrc(e.target.value as Language)}
              className="cargo-input"
            >
              <option value="NL">Nederlands → Frans</option>
              <option value="FR">Frans → Nederlands</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            if (!title.trim() || !author.trim()) return;
            onSubmit({
              title: title.trim(),
              author: author.trim(),
              year: parseInt(year) || new Date().getFullYear(),
              sourceLanguage: src,
              targetLanguage: tgt,
              coverStyle: COVER_STYLES[Math.floor(Math.random() * COVER_STYLES.length)],
            });
          }}
          disabled={!title.trim() || !author.trim()}
          className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Toevoegen aan de bibliotheek →
        </button>
      </div>
    </Modal>
  );
}
