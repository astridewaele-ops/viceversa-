"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Field } from "@/components/ui/Field";

export interface EventDraft {
  title: string;
  link: string;
  eventDate: string;
}

interface AddEventModalProps {
  onClose: () => void;
  onSubmit: (draft: EventDraft) => Promise<void> | void;
}

export function AddEventModal({ onClose, onSubmit }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (title.trim().length < 1) {
      setError("Geef het event een titel.");
      return;
    }
    if (!eventDate) {
      setError("Kies een datum.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        link: link.trim(),
        eventDate,
      });
      onClose();
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Toevoegen mislukt.");
    }
  };

  return (
    <Modal title="Nieuw event of subsidieoproep" onClose={onClose}>
      <div className="space-y-6">
        <Field
          label="Titel"
          value={title}
          onChange={setTitle}
          placeholder="bv. Vertalersdagen Antwerpen"
          type="text"
        />
        <Field
          label="Datum"
          value={eventDate}
          onChange={setEventDate}
          placeholder="jjjj-mm-dd"
          type="date"
        />
        <Field
          label="Link (optioneel)"
          value={link}
          onChange={setLink}
          placeholder="https://…"
          type="url"
        />
        {error && <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={busy || !title.trim() || !eventDate}
            className="cargo-btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {busy ? "Toevoegen…" : "Toevoegen"}
          </button>
          <button onClick={onClose} className="cargo-btn">
            Annuleren
          </button>
        </div>
      </div>
    </Modal>
  );
}
