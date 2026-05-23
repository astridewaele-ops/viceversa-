"use client";

import { ArrowRight } from "lucide-react";
import type { Question } from "@/lib/types";
import { TAGS } from "@/lib/constants";

interface ArchiveViewProps {
  questions: Question[];
  onOpenCategory: (tag: string) => void;
}

export function ArchiveView({ questions, onOpenCategory }: ArchiveViewProps) {
  const counts = TAGS.reduce<Record<string, number>>((acc, t) => {
    acc[t.id] = questions.filter((q) => q.tags && q.tags.includes(t.id)).length;
    return acc;
  }, {});

  return (
    <div className="animate-fadeIn">
      <section className="pt-20 pb-12">
        <div className="cargo-mono mb-3" style={{ color: "#999" }}>
          Index № 2 — Repertorium · Dossiers
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
            maxWidth: 900,
          }}
        >
          Vertaalvragen per soort.
        </h1>
      </section>

      <section
        className="pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 border-t pt-16"
        style={{ borderColor: "#e8e8e3" }}
      >
        {TAGS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => onOpenCategory(t.id)}
            className="vv-folder text-left animate-fadeIn group"
            style={{ animationDelay: `${idx * 50}ms` }}
            disabled={counts[t.id] === 0}
          >
            <div className="vv-folder-tab" />
            <div className="vv-folder-body">
              <div className="flex items-baseline justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 30,
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t.label}
                </span>
                <span
                  className="cargo-mono"
                  style={{ color: counts[t.id] > 0 ? "#111" : "#bbb" }}
                >
                  {counts[t.id]} {counts[t.id] === 1 ? "vraag" : "vragen"}
                </span>
              </div>
              <div
                className="cargo-mono mt-6 flex items-center gap-1.5"
                style={{ color: counts[t.id] > 0 ? "#666" : "#ccc" }}
              >
                {counts[t.id] > 0 ? "Open map" : "Leeg"}{" "}
                {counts[t.id] > 0 && <ArrowRight className="w-3 h-3" strokeWidth={1.5} />}
              </div>
            </div>
          </button>
        ))}
      </section>

    </div>
  );
}
