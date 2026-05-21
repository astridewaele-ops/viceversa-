"use client";

import { ArrowRight } from "lucide-react";
import type { AppState, OpenHelperQuestion } from "@/lib/types";
import { BookCover } from "./BookCover";

interface ReciprocitySectionProps {
  questions: OpenHelperQuestion[];
  state: AppState;
  onOpen: (bookId: string) => void;
}

export function ReciprocitySection({ questions, state, onOpen }: ReciprocitySectionProps) {
  return (
    <section className="py-10 border-t" style={{ borderColor: "#e8e8e3" }}>
      <div className="cargo-mono mb-5" style={{ color: "#111" }}>
        ↩ Mensen die jou hebben geholpen, hebben nu zelf een vraag openstaan
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
        {questions.slice(0, 4).map((q) => {
          const book = state.books.find((b) => b.id === q.bookId);
          const helper = state.users.find((u) => u.id === q.helperId);
          return (
            <button
              key={q.id}
              onClick={() => onOpen(q.bookId)}
              className="vv-row flex items-start gap-4 py-4 border-t text-left px-2"
              style={{ borderColor: "#e8e8e3" }}
            >
              {book && (
                <div className="flex-shrink-0">
                  <BookCover book={book} w={48} h={72} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="cargo-mono mb-1" style={{ color: "#999" }}>
                  {helper?.name} · {book?.code}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 16,
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {q.title}
                </div>
                {q.tags && q.tags.length > 0 && (
                  <div className="cargo-mono mt-1" style={{ color: "#999" }}>
                    {q.tags.map((t) => `· ${t}`).join(" ")}
                  </div>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-1 opacity-40" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
