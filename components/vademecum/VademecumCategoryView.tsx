"use client";

import { ArrowRight } from "lucide-react";
import type { User, VademecumCategory, VademecumEntry } from "@/lib/types";
import { VADEMECUM_CATEGORIES } from "@/lib/constants";

interface VademecumCategoryViewProps {
  vcat: VademecumCategory;
  vademecum: VademecumEntry[];
  users: User[];
  onBack: () => void;
  onAdd: () => void;
}

export function VademecumCategoryView({
  vcat,
  vademecum,
  users,
  onBack,
  onAdd,
}: VademecumCategoryViewProps) {
  const cat = VADEMECUM_CATEGORIES.find((c) => c.id === vcat);
  const entries = vademecum.filter((e) => e.category === vcat);

  return (
    <div className="animate-fadeIn py-12">
      <button onClick={onBack} className="cargo-back mb-12">
        ← Vademecum
      </button>

      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="cargo-mono mb-3" style={{ color: "#999" }}>
            Map — vademecum
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            {cat?.label}
          </h1>
          <div className="cargo-mono mt-6" style={{ color: "#777" }}>
            {entries.length} {entries.length === 1 ? "item" : "items"}
          </div>
        </div>
        <button onClick={onAdd} className="cargo-btn-primary">
          + Toevoegen
        </button>
      </div>

      <div className="border-t" style={{ borderColor: "#e8e8e3" }}>
        {entries.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "#666",
              padding: "40px 0",
            }}
          >
            Nog niets in deze map. Voeg het eerste item toe.
          </p>
        ) : (
          entries.map((e) => {
            const adder = users.find((u) => u.id === e.addedBy);
            return (
              <div
                key={e.id}
                className="py-6 border-b"
                style={{ borderColor: "#e8e8e3" }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 21,
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {e.name}
                    </div>
                    <div className="cargo-mono mt-2" style={{ color: "#777" }}>
                      {e.forWhom && `Voor ${e.forWhom}`}
                      {e.deadline && `${e.forWhom ? " · " : ""}deadline: ${e.deadline}`}
                      {adder &&
                        `${(e.forWhom || e.deadline) ? " · " : ""}toegevoegd door ${adder.name}`}
                    </div>
                  </div>
                  {e.link && (
                    <a
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cargo-mono flex-shrink-0 flex items-center gap-1 hover:text-black transition-colors"
                      style={{ color: "#111", marginTop: 4 }}
                    >
                      Website <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
