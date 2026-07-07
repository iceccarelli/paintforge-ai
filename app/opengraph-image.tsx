import { renderOgCard, OG_SIZE, OG_ALT } from "@/lib/og-card";

// Dynamically generated social-share card. When a contractor or partner
// pastes a PaintForge link into email, Slack, LinkedIn, or a text, this is
// what renders — a branded, professional preview instead of a bare URL.
export const runtime = "edge";
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard();
}
