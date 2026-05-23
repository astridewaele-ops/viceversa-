"use client";

import { ArrowRight, X } from "lucide-react";
import type { CalendarEvent, User } from "@/lib/types";

interface CalendarViewProps {
  events: CalendarEvent[];
  users: User[];
  currentUserId: string;
  onAdd: () => void;
  onDelete: (eventId: string) => Promise<void> | void;
}

const MONTHS_NL = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: MONTHS_NL[d.getMonth()],
    year: d.getFullYear(),
    key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    monthLabel: `${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`,
  };
}

export function CalendarView({
  events,
  users,
  currentUserId,
  onAdd,
  onDelete,
}: CalendarViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().slice(0, 10);

  // Sorted by date ascending; partition past vs upcoming
  const sorted = [...events].sort((a, b) =>
    a.eventDate.localeCompare(b.eventDate)
  );
  const upcoming = sorted.filter((e) => e.eventDate >= todayIso);
  const past = sorted.filter((e) => e.eventDate < todayIso).reverse();

  const groupByMonth = (list: CalendarEvent[]) => {
    const groups: { key: string; label: string; items: CalendarEvent[] }[] = [];
    list.forEach((e) => {
      const f = formatDate(e.eventDate);
      const existing = groups.find((g) => g.key === f.key);
      if (existing) existing.items.push(e);
      else groups.push({ key: f.key, label: f.monthLabel, items: [e] });
    });
    return groups;
  };

  const upcomingByMonth = groupByMonth(upcoming);
  const pastByMonth = groupByMonth(past);

  const renderRow = (e: CalendarEvent, isPast: boolean) => {
    const adder = users.find((u) => u.id === e.addedBy);
    const f = formatDate(e.eventDate);
    const isOwn = e.addedBy === currentUserId;
    return (
      <div
        key={e.id}
        className="py-5 border-b flex items-start gap-5"
        style={{
          borderColor: "#e8e8e3",
          opacity: isPast ? 0.55 : 1,
        }}
      >
        <div
          className="flex-shrink-0 text-center"
          style={{
            width: 56,
            fontFamily: "var(--font-serif)",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 300, lineHeight: 1 }}>
            {f.day}
          </div>
          <div
            className="cargo-mono"
            style={{ fontSize: 9, color: "#777", marginTop: 4, textTransform: "uppercase" }}
          >
            {f.month.slice(0, 3)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 19,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            {e.title}
          </div>
          <div className="cargo-mono mt-1.5" style={{ color: "#777" }}>
            {f.day} {f.month} {f.year}
            {adder && ` · door ${adder.name}`}
          </div>
        </div>
        {e.link && (
          <a
            href={e.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cargo-mono flex-shrink-0 flex items-center gap-1 hover:text-black transition-colors"
            style={{ color: "#111", marginTop: 6 }}
          >
            Website <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </a>
        )}
        {isOwn && (
          <button
            onClick={async () => {
              if (window.confirm("Dit event verwijderen?")) {
                await onDelete(e.id);
              }
            }}
            title="Verwijderen"
            className="opacity-40 hover:opacity-100 transition-opacity mt-1"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <section className="pt-20 pb-12">
        <div className="cargo-mono mb-3" style={{ color: "#999" }}>
          Index № 3 — Kalender · Agenda
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
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
            Events en subsidieoproepen
          </h1>
          <button onClick={onAdd} className="cargo-btn-primary">
            + Event toevoegen
          </button>
        </div>
      </section>

      <section className="border-t pt-10 pb-20" style={{ borderColor: "#e8e8e3" }}>
        {upcoming.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontStyle: "italic",
              color: "#666",
              padding: "20px 0 40px",
            }}
          >
            Nog niets in de kalender. Voeg het eerste event toe.
          </p>
        ) : (
          upcomingByMonth.map((group) => (
            <div key={group.key} className="mb-10">
              <div
                className="cargo-mono mb-3"
                style={{ color: "#999", textTransform: "uppercase" }}
              >
                {group.label}
              </div>
              {group.items.map((e) => renderRow(e, false))}
            </div>
          ))
        )}

        {past.length > 0 && (
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "#e8e8e3" }}>
            <div className="cargo-mono mb-6" style={{ color: "#999" }}>
              Voorbij
            </div>
            {pastByMonth.map((group) => (
              <div key={group.key} className="mb-8">
                <div
                  className="cargo-mono mb-3"
                  style={{ color: "#999", textTransform: "uppercase" }}
                >
                  {group.label}
                </div>
                {group.items.map((e) => renderRow(e, true))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
