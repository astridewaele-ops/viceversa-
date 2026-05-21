import type { Language, VademecumCategory } from "./types";

export const TAGS: { id: string; label: string }[] = [
  { id: "lexicaal", label: "lexicaal" },
  { id: "syntactisch", label: "syntactisch" },
  { id: "stilistisch", label: "stilistisch" },
  { id: "pragmatisch", label: "pragmatisch" },
  { id: "cultureel", label: "cultureel" },
];

export const VADEMECUM_CATEGORIES: { id: VademecumCategory; label: string }[] = [
  { id: "subsidies", label: "subsidies" },
  { id: "workshops", label: "workshops" },
  { id: "uitgeverijen", label: "uitgeverijen" },
];

export const LANG_LABELS: Record<Language, string> = {
  NL: "Nederlands",
  FR: "Frans",
};

export const VERTICAL_RHYTHM = [0, 32, 8, 48, 16, 24, 56, 4, 40, 12];
