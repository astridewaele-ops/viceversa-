import type { Language } from "./types";

export const TAGS: { id: string; label: string }[] = [
  { id: "lexicaal", label: "Lexicaal" },
  { id: "syntactisch", label: "Syntactisch" },
  { id: "stilistisch", label: "Stilistisch" },
  { id: "pragmatisch", label: "Pragmatisch" },
  { id: "cultureel", label: "Cultureel" },
];

export const LANG_LABELS: Record<Language, string> = {
  NL: "Nederlands",
  FR: "Frans",
};

export const VERTICAL_RHYTHM = [0, 32, 8, 48, 16, 24, 56, 4, 40, 12];
