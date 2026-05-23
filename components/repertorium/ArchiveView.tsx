"use client";

import type { Folder, Question } from "@/lib/types";
import { TAGS } from "@/lib/constants";

interface ArchiveViewProps {
  questions: Question[];
  folders: Folder[];
  onOpenCategory: (tag: string) => void;
  onOpenFolder: (folderId: string) => void;
  onNewFolder: () => void;
}

interface RowProps {
  index: number;
  name: string;
  count: number;
  onClick: () => void;
}

function ArchiveRow({ index, name, count, onClick }: RowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-baseline gap-3 py-3.5 border-b text-left transition-colors hover:bg-[#f4ecdc]/40 group"
      style={{ borderColor: "rgba(0,0,0,0.14)" }}
    >
      <span
        className="cargo-mono flex-shrink-0"
        style={{ width: 64, color: "#999" }}
      >
        № {String(index).padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 19,
          color: "#222",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
        className="group-hover:text-black transition-colors"
      >
        {name}
      </span>
      <span
        aria-hidden="true"
        style={{
          flex: 1,
          borderBottom: "1px dotted rgba(0,0,0,0.22)",
          alignSelf: "flex-end",
          marginBottom: 6,
        }}
      />
      <span
        className="cargo-mono flex-shrink-0"
        style={{ color: "#999" }}
      >
        {count} {count === 1 ? "vraag" : "vragen"}
      </span>
    </button>
  );
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

      <section
        className="pb-16 border-t pt-2"
        style={{ borderColor: "rgba(0,0,0,0.14)" }}
      >
        {TAGS.map((t, idx) => (
          <ArchiveRow
            key={t.id}
            index={idx + 1}
            name={t.label}
            count={counts[t.id]}
            onClick={() => onOpenCategory(t.id)}
          />
        ))}
      </section>

      <section
        className="pb-24 border-t pt-10"
        style={{ borderColor: "rgba(0,0,0,0.14)" }}
      >
        <div className="flex items-baseline justify-between mb-4">
          <h2
            className="cargo-mono"
            style={{ color: "#999" }}
          >
            Eigen dossiers
          </h2>
          <button onClick={onNewFolder} className="cargo-btn-primary">
            + Nieuw dossier
          </button>
        </div>
        {myFolders.length === 0 ? (
          <p
            className="py-4"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 15,
              fontStyle: "italic",
              color: "#888",
            }}
          >
            Nog geen eigen dossiers.
          </p>
        ) : (
          <div className="border-t" style={{ borderColor: "rgba(0,0,0,0.14)" }}>
            {myFolders.map((f, idx) => (
              <ArchiveRow
                key={f.id}
                index={TAGS.length + idx + 1}
                name={f.name}
                count={folderCounts[f.id]}
                onClick={() => onOpenFolder(f.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
