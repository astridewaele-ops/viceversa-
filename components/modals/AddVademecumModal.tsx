"use client";

import { useState } from "react";
import type { VademecumCategory } from "@/lib/types";
import { VADEMECUM_CATEGORIES } from "@/lib/constants";
import { Modal } from "./Modal";
import { Field } from "@/components/ui/Field";

export interface VademecumDraft {
  category: VademecumCategory;
  name: string;
  forWhom: string;
  deadline: string;
  link: string;
}

interface AddVademecumModalProps {
  category: VademecumCategory;
  onClose: () => void;
  onSubmit: (entry: VademecumDraft) => void;
}

export function AddVademecumModal({ category, onClose, onSubmit }: AddVademecumModalProps) {
  const cat = VADEMECUM_CATEGORIES.find((c) => c.id === category);
  const [name, setName] = useState("");
  const [forWhom, setForWhom] = useState("");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");

  return (
    <Modal title={`Toevoegen — ${cat?.label}`} onClose={onClose} wide>
      <div className="space-y-5">
        <Field
          label="Naam"
          value={name}
          onChange={setName}
          placeholder="bv. naam van de subsidie, workshop of uitgeverij"
        />
        <Field
          label="Voor wie"
          value={forWhom}
          onChange={setForWhom}
          placeholder="bv. vertalers van en naar het Nederlands"
        />
        <Field
          label="Deadline (optioneel)"
          value={deadline}
          onChange={setDeadline}
          placeholder="bv. 15 maart 2026, of 'doorlopend'"
        />
        <Field
          label="Link (optioneel)"
          value={link}
          onChange={setLink}
          placeholder="https://…"
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSubmit({
              category,
              name: name.trim(),
              forWhom: forWhom.trim(),
              deadline: deadline.trim(),
              link: link.trim(),
            });
          }}
          disabled={!name.trim()}
          className="cargo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Toevoegen →
        </button>
      </div>
    </Modal>
  );
}
