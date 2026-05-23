"use client";

import { ArrowRight } from "lucide-react";
import type { Folder, VademecumCategory, VademecumEntry } from "@/lib/types";
import { VADEMECUM_CATEGORIES } from "@/lib/constants";
import { FolderCover } from "@/components/folders/FolderCover";

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
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
            maxWidth: 900,
          }}
        >
          Praktische vragen.
        </h1>
      </section>

      <section
        className="pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 border-t pt-16"
        style={{ borderColor: "#e8e8e3" }}
      >
        {VADEMECUM_CATEGORIES.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => onOpenCategory(c.id)}
            className="vv-folder text-left animate-fadeIn group"
            style={{ animationDelay: `${idx * 50}ms` }}
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
                  {c.label}
                </span>
                <span
                  className="cargo-mono"
                  style={{ color: counts[c.id] > 0 ? "#111" : "#bbb" }}
                >
                  {counts[c.id]} {counts[c.id] === 1 ? "item" : "items"}
                </span>
              </div>
              <div
                className="cargo-mono mt-6 flex items-center gap-1.5"
                style={{ color: "#666" }}
              >
                Open map <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </div>
            </div>
          </button>
        ))}
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
                    folder={f}
                    count={folderCounts[f.id]}
                    itemLabel={{ singular: "item", plural: "items" }}
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
