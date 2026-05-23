"use client";

import type { Folder, VademecumCategory, VademecumEntry } from "@/lib/types";
import { VADEMECUM_CATEGORIES, VERTICAL_RHYTHM } from "@/lib/constants";
import { ArchiveCardCover } from "@/components/folders/ArchiveCardCover";

interface VademecumViewProps {
  vademecum: VademecumEntry[];
  folders: Folder[];
  onOpenCategory: (vcat: VademecumCategory) => void;
  onOpenFolder: (folderId: string) => void;
  onNewFolder: () => void;
}

export function VademecumView({
  vademecum,
  folders,
  onOpenCategory,
  onOpenFolder,
  onNewFolder,
}: VademecumViewProps) {
  const counts = VADEMECUM_CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = vademecum.filter((e) => e.category === c.id).length;
    return acc;
  }, {});
  const myFolders = folders.filter((f) => f.section === "vademecum");
  const folderCounts = myFolders.reduce<Record<string, number>>((acc, f) => {
    acc[f.id] = vademecum.filter((e) => e.folderId === f.id).length;
    return acc;
  }, {});

  return (
    <div className="animate-fadeIn">
      <section className="pt-20 pb-12">
        <div className="cargo-mono mb-3" style={{ color: "#999" }}>
          Index № 3 — Vademecum · Wegwijzers
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
          Praktische vragen
        </h1>
      </section>

      <section className="pb-24 border-t pt-16" style={{ borderColor: "#e8e8e3" }}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-24">
          {VADEMECUM_CATEGORIES.map((c, idx) => {
            const offset = VERTICAL_RHYTHM[idx % VERTICAL_RHYTHM.length];
            return (
              <button
                key={c.id}
                onClick={() => onOpenCategory(c.id)}
                className="flex flex-col items-start text-left animate-fadeIn group"
                style={{ marginTop: offset, animationDelay: `${idx * 40}ms` }}
              >
                <div className="transition-transform duration-300 group-hover:scale-105">
                  <ArchiveCardCover
                    name={c.label}
                    seed={`vcat:${c.id}`}
                    count={counts[c.id]}
                    itemLabel={{ singular: "item", plural: "items" }}
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
            Nog geen eigen mappen. Maak er één aan om items te ordenen.
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
                      itemLabel={{ singular: "item", plural: "items" }}
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
