interface ArchiveCardCoverProps {
  name: string;
  seed: string;
  count: number;
  itemLabel: { singular: string; plural: string };
  w?: number;
  h?: number;
}

interface ManilaTone {
  bg: string;
  tab: string;
  text: string;
  rule: string;
  ruleSpacing: number;
  ruleOpacity: number;
}

const MANILA_PALETTE: ManilaTone[] = [
  { bg: "#f0e3c0", tab: "#dec79a", text: "#5a3a1f", rule: "#c8a978", ruleSpacing: 14, ruleOpacity: 0.28 }, // bleek manila
  { bg: "#ead0a2", tab: "#d4b485", text: "#4a3320", rule: "#b89868", ruleSpacing: 16, ruleOpacity: 0.26 }, // warm manila
  { bg: "#e8d6b2", tab: "#cfae7e", text: "#4a3320", rule: "#b48a60", ruleSpacing: 12, ruleOpacity: 0.30 }, // tan
  { bg: "#dec19a", tab: "#bf9a70", text: "#3a2718", rule: "#9c7d52", ruleSpacing: 18, ruleOpacity: 0.24 }, // kraft
  { bg: "#f0d8b0", tab: "#dabd8e", text: "#4a3320", rule: "#c0a070", ruleSpacing: 13, ruleOpacity: 0.30 }, // beige
  { bg: "#e6cda0", tab: "#caa978", text: "#3a2718", rule: "#a88858", ruleSpacing: 20, ruleOpacity: 0.24 }, // gedempt goud
  { bg: "#f2dbab", tab: "#d8b884", text: "#3a2718", rule: "#c09858", ruleSpacing: 11, ruleOpacity: 0.32 }, // bleek goud
];

function paletteFor(seed: string): ManilaTone {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return MANILA_PALETTE[Math.abs(h) % MANILA_PALETTE.length];
}

export function ArchiveCardCover({
  name,
  seed,
  count,
  itemLabel,
  w = 140,
  h = 210,
}: ArchiveCardCoverProps) {
  const { bg, tab, text, rule, ruleSpacing, ruleOpacity } = paletteFor(seed);

  return (
    <div
      style={{
        position: "relative",
        width: w,
        paddingTop: 10,
      }}
    >
      {/* Tab — steekt 10px boven de kaart uit, linksboven */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 14,
          width: 54,
          height: 14,
          backgroundColor: tab,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      />
      {/* Kaart-body */}
      <div
        style={{
          width: w,
          height: h,
          backgroundColor: bg,
          color: text,
          position: "relative",
          overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: 6,
                height: 1,
                backgroundColor: rule,
                opacity: 0.7,
              }}
            />
            {/* Tone-on-tone horizontale lijntjes — varieert per kaart */}
            <div
              style={{
                marginTop: 10,
                height: 110,
                backgroundImage: `repeating-linear-gradient(0deg, ${rule}, ${rule} 1px, transparent 1px, transparent ${ruleSpacing}px)`,
                opacity: ruleOpacity,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 9,
              opacity: 0.85,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            {count} {count === 1 ? itemLabel.singular : itemLabel.plural}
          </div>
        </div>
      </div>
    </div>
  );
}
