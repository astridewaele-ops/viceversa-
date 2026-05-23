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
}

const MANILA_PALETTE: ManilaTone[] = [
  { bg: "#ead7a8", tab: "#d4ba80", text: "#4a3320", rule: "#c8a978" }, // licht manila
  { bg: "#d8be8a", tab: "#b89868", text: "#3a2718", rule: "#a88858" }, // warm manila
  { bg: "#dcc095", tab: "#bf9d6b", text: "#4a3320", rule: "#b48a60" }, // tan
  { bg: "#cba87a", tab: "#a48253", text: "#3a2718", rule: "#8c7148" }, // kraft
  { bg: "#e2c89a", tab: "#c5a874", text: "#4a3320", rule: "#b89858" }, // beige
  { bg: "#d4b888", tab: "#b09060", text: "#3a2718", rule: "#a88858" }, // donker manila
  { bg: "#e6cfa0", tab: "#cca77a", text: "#3a2718", rule: "#b89058" }, // bleek goud
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
  const { bg, tab, text, rule } = paletteFor(seed);

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
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: 6,
                height: 1,
                backgroundColor: rule,
                opacity: 0.85,
              }}
            />
            {/* Tone-on-tone horizontale lijntjes — archiefkaart-look */}
            <div
              style={{
                marginTop: 10,
                height: 110,
                backgroundImage: `repeating-linear-gradient(0deg, ${rule}, ${rule} 1px, transparent 1px, transparent 14px)`,
                opacity: 0.35,
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
