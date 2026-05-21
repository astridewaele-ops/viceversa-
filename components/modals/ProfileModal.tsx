"use client";

import type { Book, Question, User } from "@/lib/types";
import { LANG_LABELS } from "@/lib/constants";
import { Modal } from "./Modal";
import { DlRow } from "@/components/ui/DlRow";
import { Stat } from "@/components/ui/Stat";

interface ProfileModalProps {
  user: User;
  questions: Question[];
  books: Book[];
  users: User[];
  onClose: () => void;
}

export function ProfileModal({ user, questions, onClose }: ProfileModalProps) {
  const myQuestions = questions.filter((q) => q.askerId === user.id);
  const myAnswers = questions.flatMap((q) =>
    q.answers
      .filter((a) => a.authorId === user.id)
      .map((a) => ({ ...a, question: q }))
  );
  const helped = new Set<string>();
  questions.forEach((q) =>
    q.answers.forEach((a) => {
      if (a.authorId === user.id) helped.add(q.askerId);
    })
  );

  return (
    <Modal title={`Profiel — ${user.name}`} onClose={onClose} wide>
      <div className="space-y-8">
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {user.name}
          </div>
          {user.bio && (
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 15,
                fontStyle: "italic",
                color: "#555",
              }}
            >
              {user.bio}
            </p>
          )}
        </div>
        <dl
          className="grid grid-cols-2 gap-y-3 gap-x-8 pt-6 border-t"
          style={{ borderColor: "#e8e8e3" }}
        >
          <DlRow label="Moedertaal" value={LANG_LABELS[user.nativeLanguage]} />
          <DlRow
            label="Vertaalt naar"
            value={user.translates.map((l) => LANG_LABELS[l]).join(", ") || "—"}
          />
          <DlRow label="Lid sinds" value={user.joined} />
          <DlRow label="E-mail" value={user.email} />
        </dl>
        <div
          className="grid grid-cols-3 gap-4 pt-6 border-t"
          style={{ borderColor: "#e8e8e3" }}
        >
          <Stat label="Vragen gesteld" value={myQuestions.length} />
          <Stat label="Antwoorden gegeven" value={myAnswers.length} />
          <Stat label="Mensen geholpen" value={helped.size} />
        </div>
      </div>
    </Modal>
  );
}
