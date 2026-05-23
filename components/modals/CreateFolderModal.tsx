"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Field } from "@/components/ui/Field";

interface CreateFolderModalProps {
  sectionLabel: string;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void> | void;
}

export function CreateFolderModal({
  sectionLabel,
  onClose,
  onSubmit,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setError("Geef de map een naam.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await onSubmit(trimmed);
      onClose();
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Aanmaken mislukt.");
    }
  };

  return (
    <Modal title={`Nieuwe map — ${sectionLabel}`} onClose={onClose}>
      <div className="space-y-6">
        <Field
          label="Naam van de map"
          value={name}
          onChange={setName}
          placeholder="bv. Onderzoek 19e eeuw"
          type="text"
        />
        {error && <p style={{ fontSize: 12, color: "#a02020" }}>{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={busy || !name.trim()}
            className="cargo-btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {busy ? "Aanmaken…" : "Map aanmaken"}
          </button>
          <button onClick={onClose} className="cargo-btn">
            Annuleren
          </button>
        </div>
      </div>
    </Modal>
  );
}
