// Markeerstift-kleuren voor categorieën en aanverwante registers.
// Gebruik via <Highlight color={...}>…</Highlight> of inline als background.

export const categoryColors: Record<string, string> = {
  lexicaal: "rgba(201,116,46,0.40)", // terracotta
  syntactisch: "rgba(217,178,124,0.62)", // zand
  stilistisch: "rgba(185,138,62,0.45)", // oker
  pragmatisch: "rgba(122,92,46,0.32)", // olijfbruin
  cultureel: "rgba(201,168,106,0.55)", // goud
};

// Palet voor entiteiten zonder eigen categorie (events, eigen dossiers).
// Volgt dezelfde toonfamilie zodat de pagina's visueel rijmen.
export const accentPalette: string[] = [
  categoryColors.lexicaal,
  categoryColors.syntactisch,
  categoryColors.stilistisch,
  categoryColors.pragmatisch,
  categoryColors.cultureel,
];

export function colorForSeed(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return accentPalette[Math.abs(h) % accentPalette.length];
}
