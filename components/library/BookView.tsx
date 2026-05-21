"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import type { Book, Question, User } from "@/lib/types";
import { LANG_LABELS, TAGS } from "@/lib/constants";
import { BookCover } from "./BookCover";
import { CatalogueLabel } from "./CatalogueLabel";
import { DlRow } from "@/components/ui/DlRow";
import { FieldLabel } from "@/components/ui/FieldLabel";

interface BookViewProps {
  book: Book;
  questions: Question[];
  users: User[];
  currentUserId: string;
  onBack: () => void;
  onAsk: () => void;
  onAnswer: (questionId: string, text: string) => void;
  focusQuestionId?: string;
}

export function BookView({
  book,
  questions,
  users,
  onBack,
  onAsk,
  onAnswer,
  focusQuestionId,
}: BookViewProps) {
  const [expandedQ, setExpandedQ] = useState<string | null>(
    focusQuestionId || questions[0]?.id || null
  );
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [tagFilter, setTagFilter] = useState<string>("all");
  const translator = users.find((u) => u.id === book.translator);

  const filteredQuestions =
    tagFilter === "all"
      ? questions
      : questions.filter((q) => q.tags && q.tags.includes(tagFilter));
  const tagCounts = TAGS.reduce<Record<string, number>>((acc, t) => {
    acc[t.id] = questions.filter((q) => q.tags && q.tags.includes(t.id)).length;
    return acc;
  }, {});

  return (
    <div className="animate-fadeIn py-12">
      <button onClick={onBack} className="cargo-back mb-12">
        ← Bibliotheek
      </button>

      <div className="vv-grid-book-detail mb-20">
        <div>
          <BookCover book={book} w={240} h={360} />
          <div className="mt-5">
            <CatalogueLabel book={book} />
          </div>
        </div>

        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 300,
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
            }}
          >
            {book.title}
          </h1>
          <div
            className="mt-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "#444",
            }}
          >
            {book.author} · {book.year}
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-y-4 gap-x-8 max-w-md">
            <DlRow label="Brontaal" value={LANG_LABELS[book.sourceLanguage]} />
            <DlRow label="Doeltaal" value={LANG_LABELS[book.targetLanguage]} />
            {translator && <DlRow label="Vertaler" value={translator.name} />}
            <DlRow label="Vragen" value={`${questions.length}`} />
          </dl>

          <button onClick={onAsk} className="cargo-btn-primary mt-12">
            + Vraag stellen bij dit boek
          </button>
        </div>
      </div>

      <div className="border-t pt-10" style={{ borderColor: "#e8e8e3" }}>
        <div className="cargo-mono mb-5" style={{ color: "#999" }}>
          № {questions.length.toString().padStart(2, "0")} —{" "}
          {questions.length === 1 ? "Vraag" : "Vragen"}
        </div>

        {questions.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-6 mb-2 border-b"
            style={{ borderColor: "#e8e8e3" }}
          >
            <div className="cargo-mono" style={{ color: "#999" }}>
              Tag:
            </div>
            <button
              onClick={() => setTagFilter("all")}
              className={`cargo-mono transition-colors ${
                tagFilter === "all" ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              Alle ({questions.length})
            </button>
            {TAGS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTagFilter(t.id)}
                disabled={tagCounts[t.id] === 0}
                className={`cargo-mono transition-colors ${
                  tagFilter === t.id ? "text-black" : "text-gray-400 hover:text-black"
                }`}
                style={
                  tagCounts[t.id] === 0
                    ? { opacity: 0.3, cursor: "not-allowed" }
                    : undefined
                }
              >
                {t.label} ({tagCounts[t.id]})
              </button>
            ))}
          </div>
        )}

        {filteredQuestions.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "#666",
              padding: "40px 0",
            }}
          >
            {questions.length === 0
              ? "Nog geen vragen bij dit boek."
              : "Geen vragen met deze tag."}
          </p>
        ) : (
          <div>
            {filteredQuestions.map((q, idx) => {
              const asker = users.find((u) => u.id === q.askerId);
              const isExpanded = expandedQ === q.id;
              return (
                <div key={q.id} className="border-t" style={{ borderColor: "#e8e8e3" }}>
                  <button
                    onClick={() => setExpandedQ(isExpanded ? null : q.id)}
                    className="vv-row vv-grid-question-row w-full text-left py-6 px-2 -mx-2"
                  >
                    <span className="cargo-mono" style={{ color: "#999" }}>
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 22,
                          lineHeight: 1.2,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {q.title}
                      </div>
                      <div className="cargo-mono mt-2" style={{ color: "#777" }}>
                        {asker?.name} · {q.createdAt}
                        {q.page && ` · p. ${q.page}`}
                        {q.tags && q.tags.length > 0 && ` · ${q.tags.join(", ")}`} ·{" "}
                        {q.answers.length}{" "}
                        {q.answers.length === 1 ? "antwoord" : "antwoorden"}
                      </div>
                    </div>
                    <span className="cargo-mono" style={{ color: "#999" }}>
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="pb-10 pl-2 animate-fadeIn">
                      <div className="vv-grid-question-body">
                        <div />
                        <div>
                          {q.passage && (
                            <blockquote
                              style={{
                                borderLeft: "1px solid #ccc",
                                paddingLeft: 16,
                                fontFamily: "var(--font-serif)",
                                fontSize: 15,
                                fontStyle: "italic",
                                color: "#444",
                                marginBottom: 16,
                                lineHeight: 1.55,
                              }}
                            >
                              <Quote
                                className="w-3 h-3 opacity-40 mb-1"
                                strokeWidth={1.5}
                              />
                              {q.passage}
                            </blockquote>
                          )}
                          <p
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: 16,
                              lineHeight: 1.55,
                              color: "#222",
                              marginBottom: 32,
                            }}
                          >
                            {q.text}
                          </p>

                          {q.answers.length > 0 && (
                            <div className="space-y-7 mb-8">
                              {q.answers.map((a) => {
                                const author = users.find((u) => u.id === a.authorId);
                                return (
                                  <div
                                    key={a.id}
                                    className="pl-5 border-l"
                                    style={{ borderColor: "#ddd" }}
                                  >
                                    <div
                                      className="cargo-mono mb-2"
                                      style={{ color: "#777" }}
                                    >
                                      <span style={{ color: "#111" }}>{author?.name}</span>{" "}
                                      · {a.createdAt}
                                    </div>
                                    <p
                                      style={{
                                        fontFamily: "var(--font-serif)",
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                        color: "#222",
                                      }}
                                    >
                                      {a.text}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="border-t pt-6" style={{ borderColor: "#e8e8e3" }}>
                            <FieldLabel>Antwoord toevoegen</FieldLabel>
                            <textarea
                              value={answerText[q.id] || ""}
                              onChange={(e) =>
                                setAnswerText({ ...answerText, [q.id]: e.target.value })
                              }
                              rows={3}
                              placeholder="Wat zou jij doen met deze passage?"
                              className="cargo-input"
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: 15,
                                lineHeight: 1.5,
                              }}
                            />
                            <button
                              onClick={() => {
                                const text = (answerText[q.id] || "").trim();
                                if (!text) return;
                                onAnswer(q.id, text);
                                setAnswerText({ ...answerText, [q.id]: "" });
                              }}
                              disabled={!(answerText[q.id] || "").trim()}
                              className="cargo-btn-primary mt-3 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Antwoord versturen
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t" style={{ borderColor: "#e8e8e3" }} />
          </div>
        )}
      </div>
    </div>
  );
}
