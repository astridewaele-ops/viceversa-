"use client";

import type { Folder, Question } from "@/lib/types";
import { TAGS, VERTICAL_RHYTHM } from "@/lib/constants";
import { ArchiveCardCover } from "@/components/folders/ArchiveCardCover";

interface ArchiveViewProps {
  questions: Question[];
  folders: Folder[];
  onOpenCategory: (tag: string) => void;
  onOpenFolder: (folderId: string) => void;
  onNewFolder: () => void;
}

export function ArchiveView({
  questions,
  folders,
  onOpenCategory,
  onOpenFolder,
  onNewFolder,
}: ArchiveViewProps) {
  const counts = TAGS.reduce<Record<string, number>>((acc, t) => {
    acc[t.id] = questions.filter((q) => q.tags && q.tags.includes(t.id)).length;
    return acc;
  }, {});
  const myFolders = folders.filter((f) => f.section === "repertorium");
  const folderCounts = myFolders.reduce<Record<string, number>>((acc, f) => {
    acc[f.id] = questions.filter((q) => q.folderId === f.id).length;
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
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Vragen per categorie
        </h1>
      </section>

      <section className="pb-24 border-t pt-16" style={{ borderColor: "#e8e8e3" }}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-24">
          {TAGS.map((t, idx) => {
            const offset = VERTICAL_RHYTHM[idx % VERTICAL_RHYTHM.length];
            return (
              <button
                key={t.id}
                onClick={() => onOpenCategory(t.id)}
                className="flex flex-col items-start text-left animate-fadeIn group"
                style={{ marginTop: offset, animationDelay: `${idx * 40}ms` }}
              >
                <div className="transition-transform duration-300 group-hover:scale-105">
                  <ArchiveCardCover
                    name={t.label}
                    seed={`tag:${t.id}`}
                    count={counts[t.id]}
                    itemLabel={{ singular: "vraag", plural: "vragen" }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="pb-24 border-t pt-16" style={{ borderColor: "#e8e8e3" }}>
        <div className="flex items-baseline justify-between mb-8">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            Eigen dossiers
          </h2>
          <button onClick={onNewFolder} className="cargo-btn-primary">
            + Nieuw dossier
          </button>
        </div>
        {myFolders.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              fontStyle: "italic",
              color: "#666",
            }}
          >
            Nog geen eigen dossiers. Maak er één aan om vragen te ordenen.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-24">
            {myFolders.map((f, idx) => {
              const offset = VERTICAL_RHYTHM[idx % VERTICAL_RHYTHM.length];
              return (
                <button
                  key={f.id}
                  onClick={() => onOpenFolder(f.id)}
                  className="flex flex-col items-start text-left animate-fadeIn group"
                  style={{ marginTop: offset, animationDelay: `${idx * 40}ms` }}
                >
                  <div className="transition-transform duration-300 group-hover:scale-105">
                    <ArchiveCardCover
                      name={f.name}
                      seed={`folder:${f.id}`}
                      count={folderCounts[f.id]}
                      itemLabel={{ singular: "vraag", plural: "vragen" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
