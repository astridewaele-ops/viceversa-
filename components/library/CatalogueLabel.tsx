import type { Book } from "@/lib/types";

interface CatalogueLabelProps {
  book: Book;
  questionsCount?: number;
}

export function CatalogueLabel({ book, questionsCount }: CatalogueLabelProps) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        lineHeight: 1.55,
        color: "#111",
        letterSpacing: "0.01em",
      }}
    >
      <div>{book.code}</div>
      <div style={{ color: "#666" }}>{book.author.split(" ").slice(-1)[0]}</div>
      <div style={{ color: "#999" }}>
        {book.sourceLanguage}→{book.targetLanguage}
      </div>
      {questionsCount !== undefined && (
        <div
          style={{
            color: questionsCount > 0 ? "#111" : "#bbb",
            marginTop: 2,
          }}
        >
          {questionsCount === 0 ? "—" : `${questionsCount} vr.`}
        </div>
      )}
    </div>
  );
}
