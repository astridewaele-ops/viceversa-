"use client";

import { ArrowRight } from "lucide-react";
import type { AppState, Question } from "@/lib/types";
import { TAGS } from "@/lib/constants";
import { BookCover } from "@/components/library/BookCover";

interface CategoryViewProps {
  tag: string;
  state: AppState;
  onBack: () => void;
  onOpenQuestion: (q: Question) => void;
}

export function CategoryView({ tag, state, onBack, onOpenQuestion }: CategoryViewProps) {
  const matching = state.questions.filter((q) => q.tags && q.tags.includes(tag));
  const tagLabel = TAGS.find((t) => t.id === tag)?.label || tag;
  const uniqueBookIds = new Set(matching.map((q) => q.bookId));

  return (
    <div className="animate-fadeIn py-12">
      <button onClick={onBack} className="cargo-back mb-12">
        ← Repertorium
      </button>

      <div className="mb-12">
        <div className="cargo-mono mb-3" style={{ color: "#999" }}>
          Map — categorie
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
          {tagLabel}
        </h1>
        <div className="cargo-mono mt-6" style={{ color: "#777" }}>
          {matching.length} {matching.length === 1 ? "vraag" : "vragen"} · over{" "}
          {uniqueBookIds.size} {uniqueBookIds.size === 1 ? "boek" : "boeken"}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "#e8e8e3" }}>
        {matching.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "#666",
              padding: "40px 0",
            }}
          >
            Nog geen vragen in deze map.
          </p>
        ) : (
          <>
            {matching.map((q) => {
              const book = state.books.find((b) => b.id === q.bookId);
              const asker = state.users.find((u) => u.id === q.askerId);
              return (
                <button
                  key={q.id}
                  onClick={() => onOpenQuestion(q)}
                  className="vv-row w-full text-left flex items-start gap-5 py-6 border-b px-2 -mx-2"
                  style={{ borderColor: "#e8e8e3" }}
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
                      {q.tags && q.tags.length > 0 && ` · ${q.tags.join(", ")}`}
                      {" · "}
                      {q.answers.length}{" "}
                      {q.answers.length === 1 ? "antwoord" : "antwoorden"}
                    </div>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 flex-shrink-0 mt-1 opacity-40"
                    strokeWidth={1.5}
                  />
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
