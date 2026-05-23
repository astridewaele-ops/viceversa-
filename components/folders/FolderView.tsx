"use client";

import { ArrowRight, X } from "lucide-react";
import type { AppState, Folder, Question } from "@/lib/types";
import { BookCover } from "@/components/library/BookCover";

interface FolderViewProps {
  folder: Folder;
  state: AppState;
  currentUserId: string;
  onBack: () => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => Promise<void> | void;
  onDeleteFolder: () => Promise<void> | void;
  onOpenQuestion: (q: Question) => void;
}

export function FolderView({
  folder,
  state,
  currentUserId,
  onBack,
  onAddItem,
  onRemoveItem,
  onDeleteFolder,
  onOpenQuestion,
}: FolderViewProps) {
  const isOwner = folder.userId === currentUserId;
  const questions = state.questions.filter((q) => q.folderId === folder.id);
  const count = questions.length;

  return (
    <div className="animate-fadeIn py-12">
      <button onClick={onBack} className="cargo-back mb-12">
        ← Repertorium
      </button>

      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="cargo-mono mb-3" style={{ color: "#999" }}>
            Dossier — repertorium
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {folder.name}
          </h1>
          <div className="cargo-mono mt-6" style={{ color: "#777" }}>
            {count} {count === 1 ? "vraag" : "vragen"}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onAddItem} className="cargo-btn-primary">
            + Toevoegen
          </button>
          {isOwner && (
            <button
              onClick={async () => {
                if (
                  window.confirm(
                    "Dossier verwijderen? Vragen blijven bestaan, alleen het dossier verdwijnt."
                  )
                ) {
                  await onDeleteFolder();
                }
              }}
              className="cargo-btn"
            >
              Dossier verwijderen
            </button>
          )}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "#e8e8e3" }}>
        {count === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "#666",
              padding: "40px 0",
            }}
          >
            Nog niets in dit dossier. Klik op &quot;+ Toevoegen&quot;.
          </p>
        ) : (
          questions.map((q) => {
            const book = state.books.find((b) => b.id === q.bookId);
            const asker = state.users.find((u) => u.id === q.askerId);
            return (
              <div
                key={q.id}
                className="flex items-start gap-5 py-6 border-b px-2 -mx-2"
                style={{ borderColor: "#e8e8e3" }}
              >
                <button
                  onClick={() => onOpenQuestion(q)}
                  className="vv-row flex-1 flex items-start gap-5 text-left min-w-0"
                >
                  {book && (
                    <div className="flex-shrink-0">
                      <BookCover book={book} w={52} h={78} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="cargo-mono mb-1.5" style={{ color: "#999" }}>
                      {book?.code} · {book?.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 21,
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {q.title}
                    </div>
                    <div className="cargo-mono mt-2" style={{ color: "#777" }}>
                      {asker?.name} · {q.createdAt}
                    </div>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 flex-shrink-0 mt-1 opacity-40"
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Uit dit dossier halen?")) {
                      await onRemoveItem(q.id);
                    }
                  }}
                  title="Uit dossier halen"
                  className="opacity-40 hover:opacity-100 transition-opacity mt-1"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
