"use client";

import { ArrowRight } from "lucide-react";
import type { AppState, Notification, User } from "@/lib/types";
import { LANG_LABELS } from "@/lib/constants";
import { Modal } from "./Modal";
import { BookCover } from "@/components/library/BookCover";

interface InboxModalProps {
  user: User;
  notifications: Notification[];
  state: AppState;
  onClose: () => void;
  onOpenQuestion: (bookId: string) => void;
  onMarkRead: (questionId: string) => void;
}

export function InboxModal({
  user,
  notifications,
  state,
  onClose,
  onOpenQuestion,
  onMarkRead,
}: InboxModalProps) {
  return (
    <Modal
      title={`Inbox — ${LANG_LABELS[user.nativeLanguage]} (moedertaal)`}
      onClose={onClose}
      wide
    >
      {notifications.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 15,
            fontStyle: "italic",
            color: "#666",
            padding: "20px 0",
          }}
        >
          Geen nieuwe meldingen.
        </p>
      ) : (
        <div>
          {notifications.map((n) => {
            const q = state.questions.find((qq) => qq.id === n.questionId);
            const book = state.books.find((b) => b.id === n.bookId);
            const asker = state.users.find((u) => u.id === q?.askerId);
            if (!q || !book) return null;
            return (
              <button
                key={n.id}
                onClick={() => {
                  onMarkRead(n.questionId);
                  onOpenQuestion(book.id);
                }}
                className="vv-row w-full text-left flex items-start gap-4 py-4 border-t px-2 -mx-2"
                style={{ borderColor: "#e8e8e3" }}
              >
                <div className="flex-shrink-0">
                  <BookCover book={book} w={48} h={72} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="cargo-mono mb-1" style={{ color: "#999" }}>
                    {n.createdAt} · {asker?.name} · {book.code}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 17,
                      lineHeight: 1.25,
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
                <ArrowRight
                  className="w-3.5 h-3.5 flex-shrink-0 mt-1 opacity-40"
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
          <div className="border-t" style={{ borderColor: "#e8e8e3" }} />
        </div>
      )}
    </Modal>
  );
}
