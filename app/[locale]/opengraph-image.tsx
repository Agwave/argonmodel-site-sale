import { ImageResponse } from "next/og";
import { element } from "@/config/site";

/**
 * Deliberately ASCII-only. Satori (the renderer behind ImageResponse) ships no
 * CJK font, so Chinese copy here would render as tofu boxes — and embedding a
 * CJK subset would cost far more than this card is worth. The domain name is the
 * headline anyway, and it is ASCII in both locales.
 *
 * Satori requires an explicit `display: flex` on every element that has more
 * than one child, so every container below declares it rather than relying on
 * the default block layout.
 */
export const alt = "argonmodel.com — premium domain for sale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#f2f6fa";
const MUTED = "#a9b6c5";
const FAINT = "#6f7d8c";
const SURFACE = "#080b10";
const CARD = "#10161d";
const ACCENT = "#22d3ee";
const ACCENT_DIM = "#0891b2";
const GOOD = "#0ca30c";
const HAIRLINE = "rgba(255,255,255,0.09)";

const column = {
  display: "flex",
  flexDirection: "column" as const,
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          ...column,
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: SURFACE,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                ...column,
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                border: `1px solid ${ACCENT_DIM}`,
                borderRadius: 8,
                color: ACCENT,
                fontSize: 22,
              }}
            >
              <div style={{ display: "flex" }}>{element.symbol}</div>
              <div style={{ display: "flex", fontSize: 11, color: FAINT }}>
                {String(element.number)}
              </div>
            </div>

            <div style={column}>
              <div style={{ display: "flex", fontSize: 20, color: INK }}>argonmodel.com</div>
              <div style={{ display: "flex", fontSize: 14, color: FAINT }}>
                element 18 · noble gas
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 16,
              color: MUTED,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 8,
                background: GOOD,
              }}
            />
            <div style={{ display: "flex" }}>For sale</div>
          </div>
        </div>

        {/* The domain is the headline. */}
        <div style={{ ...column, gap: 20 }}>
          <div style={{ display: "flex", fontSize: 84, color: INK, letterSpacing: -2 }}>
            argonmodel.com
          </div>
          <div style={{ display: "flex", fontSize: 30, color: MUTED }}>
            Two dictionary words. One unmistakable meaning.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: 28,
          }}
        >
          <div style={{ ...column, gap: 6 }}>
            <div style={{ display: "flex", fontSize: 14, color: FAINT, letterSpacing: 2 }}>
              ASKING PRICE
            </div>
            {/* No figure is shown unless config/pricing.ts publishes one — the
                card must never state a number the page does not. */}
            <div style={{ display: "flex", fontSize: 40, color: ACCENT }}>
              Price on request
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: FAINT,
              backgroundColor: CARD,
              padding: "12px 20px",
              borderRadius: 8,
            }}
          >
            escrow-only · replies within 24h
          </div>
        </div>
      </div>
    ),
    size,
  );
}
