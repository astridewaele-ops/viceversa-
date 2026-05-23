"use client";

import type { Folder, Question } from "@/lib/types";
import { TAGS } from "@/lib/constants";
import { FolderCover } from "@/components/folders/FolderCover";

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
        className="pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 border-t pt-16"
        style={{ borderColor: "#e8e8e3" }}
      >
        {TAGS.map((t, idx) => {
          const disabled = counts[t.id] === 0;
          return (
            <button
              key={t.id}
              onClick={() => onOpenCategory(t.id)}
              className="text-left animate-fadeIn group disabled:cursor-not-allowed"
              style={{ animationDelay: `${idx * 50}ms` }}
              disabled={disabled}
            >
              <div className="transition-transform duration-300 group-enabled:group-hover:scale-[1.02]">
                <FolderCover
                  name={t.label}
                  seed={`tag:${t.id}`}
                  count={counts[t.id]}
                  itemLabel={{ singular: "vraag", plural: "vragen" }}
                  disabled={disabled}
                />
              </div>
            </button>
          );
        })}
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
            Eigen mappen
          </h2>
          <button onClick={onNewFolder} className="cargo-btn-primary">
            + Nieuwe map
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
            Nog geen eigen mappen. Maak er één aan om vragen te ordenen.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {myFolders.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => onOpenFolder(f.id)}
                className="text-left animate-fadeIn group"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                  <FolderCover
                    name={f.name}
                    seed={`folder:${f.id}`}
                    count={folderCounts[f.id]}
                    itemLabel={{ singular: "vraag", plural: "vragen" }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
