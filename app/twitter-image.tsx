import { renderOgCard, OG_SIZE, OG_ALT } from "@/lib/og-card";

// Same branded card for Twitter/X link previews.
export const runtime = "edge";
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return renderOgCard();
}
