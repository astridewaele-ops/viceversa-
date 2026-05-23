"use client";

import { useState } from "react";
import type { Book, Question } from "@/lib/types";
import { Modal } from "./Modal";

interface AddToFolderModalProps {
  folderName: string;
  questions: Question[];
  books: Book[];
  onClose: () => void;
  onPick: (itemId: string) => Promise<void> | void;
}

export function AddToFolderModal({
  folderName,
  questions,
  books,
  onClose,
  onPick,
}: AddToFolderModalProps) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const handlePick = async (id: string) => {
    setBusyId(id);
    try {
      await onPick(id);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Modal title={`Toevoegen aan: ${folderName}`} onClose={onClose} wide>
      {questions.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 15,
            fontStyle: "italic",
            color: "#666",
          }}
        >
          Geen vragen meer om aan dit dossier toe te voegen.
        </p>
      ) : (
        <div className="divide-y" style={{ borderColor: "#e8e8e3" }}>
          {questions.map((q) => {
            const book = books.find((b) => b.id === q.bookId);
            return (
              <button
                key={q.id}
                onClick={() => handlePick(q.id)}
                disabled={busyId !== null}
                className="w-full text-left py-4 px-2 -mx-2 hover:bg-black/[0.02] transition-colors disabled:opacity-40"
                style={{ borderColor: "#e8e8e3" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 17,
                    lineHeight: 1.25,
                  }}
                >
                  {q.title}
                </div>
                <div className="cargo-mono mt-1.5" style={{ color: "#888" }}>
                  {book ? `${book.code} · ${book.title}` : ""} · {q.createdAt}
                  {busyId === q.id && " · toevoegen…"}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
