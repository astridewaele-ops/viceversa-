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
  const backLabel =
    folder.section === "repertorium" ? "← Repertorium" : "← Vademecum";
  const sectionLabel =
    folder.section === "repertorium" ? "Map — repertorium" : "Map — vademecum";

  const questions =
    folder.section === "repertorium"
      ? state.questions.filter((q) => q.folderId === folder.id)
      : [];
  const entries =
    folder.section === "vademecum"
      ? state.vademecum.filter((e) => e.folderId === folder.id)
      : [];
  const count =
    folder.section === "repertorium" ? questions.length : entries.length;
  const noun =
    folder.section === "repertorium"
      ? count === 1
        ? "vraag"
        : "vragen"
      : count === 1
        ? "item"
        : "items";

  return (
    <div className="animate-fadeIn py-12">
      <button onClick={onBack} className="cargo-back mb-12">
        {backLabel}
      </button>

      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="cargo-mono mb-3" style={{ color: "#999" }}>
            {sectionLabel}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            {folder.name}
          </h1>
          <div className="cargo-mono mt-6" style={{ color: "#777" }}>
            {count} {noun}
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
                    "Map verwijderen? Items blijven bestaan, alleen de map verdwijnt."
                  )
                ) {
                  await onDeleteFolder();
                }
              }}
              className="cargo-btn"
            >
              Map verwijderen
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
            Nog niets in deze map. Klik op &quot;+ Toevoegen&quot;.
          </p>
        ) : folder.section === "repertorium" ? (
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
                    if (window.confirm("Uit deze map halen?")) {
                      await onRemoveItem(q.id);
                    }
                  }}
                  title="Uit map halen"
                  className="opacity-40 hover:opacity-100 transition-opacity mt-1"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            );
          })
        ) : (
          entries.map((e) => {
            const adder = state.users.find((u) => u.id === e.addedBy);
            return (
              <div
                key={e.id}
                className="py-6 border-b flex items-start gap-4"
                style={{ borderColor: "#e8e8e3" }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 21,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {e.name}
                  </div>
                  <div className="cargo-mono mt-2" style={{ color: "#777" }}>
                    {e.category}
                    {e.forWhom && ` · ${e.forWhom}`}
                    {e.deadline && ` · deadline: ${e.deadline}`}
                    {adder && ` · door ${adder.name}`}
                  </div>
                </div>
                {e.link && (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cargo-mono flex-shrink-0 flex items-center gap-1 hover:text-black transition-colors"
                    style={{ color: "#111", marginTop: 4 }}
                  >
                    Website <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                  </a>
                )}
                <button
                  onClick={async () => {
                    if (window.confirm("Uit deze map halen?")) {
                      await onRemoveItem(e.id);
                    }
                  }}
                  title="Uit map halen"
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
