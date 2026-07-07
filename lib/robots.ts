// ---------------------------------------------------------------------------
// Single source of truth for the professional painting-robot landscape shown
// on the RaaS and SaaS pages. Specs are from each manufacturer's public
// documentation (2024–2026). Each entry is framed around the specific paint-
// shop PROBLEM it addresses and the SOLUTION it represents.
//
// IMPORTANT — these are THIRD-PARTY industrial robots. They are shown as an
// industry reference: the class of professional hardware PaintForge's platform
// is being designed to work with. PaintForge is pre-launch, is NOT affiliated
// with or an authorized distributor of ABB, FANUC, KUKA, Yaskawa, or Kawasaki,
// and does not currently offer these robots for rent or sale. Do not add
// "available via PaintForge RaaS", uptime SLAs, certifications, or field-result
// claims — none of that is true yet. Keep every string factual.
// ---------------------------------------------------------------------------

export interface RobotSpec {
  label: string;
  value: string;
}

export interface Robot {
  id: string;
  manufacturer: string;
  model: string;
  tagline: string;
  category: string;
  specs: RobotSpec[];
  /** The niche problem this class of robot addresses. */
  problem: string;
  /** How this robot solves it — factual. */
  solution: string;
  /** What a vendor-neutral software layer would add on top. */
  softwareAngle: string;
  /** Stylized 3D params for the concept simulator (not vendor livery). */
  viz: { reach: number; thick: number; accent: string };
}

export const ROBOTS: Robot[] = [
  {
    id: "abb-irb-5500",
    manufacturer: "ABB",
    model: "IRB 5500 FlexPainter",
    tagline: "Exterior automotive body painting with the paint process built into the arm.",
    category: "Automotive exterior body",
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "13 kg" },
      { label: "Repeatability", value: "0.15 mm" },
      { label: "Protection", value: "IP66/IP67, ATEX" },
      { label: "Controller", value: "IRC5P" },
      { label: "Mounting", value: "Floor, wall, rail, inverted" },
    ],
    problem:
      "High-speed body lines waste paint and solvent on every color change, and manual spraying can't hold an even film build at line rate.",
    solution:
      "Pumps sit ~15 cm from the wrist and the IRC5P unifies motion and process control, so color changes waste less and two units can cover what previously took four.",
    softwareAngle:
      "Normalize its IRC5P job and consumption data into one fleet view alongside every other vendor.",
    viz: { reach: 1.12, thick: 1.05, accent: "#E4002B" },
  },
  {
    id: "fanuc-p-250ib",
    manufacturer: "FANUC",
    model: "P-250iB/15",
    tagline: "Large-envelope six-axis painter with a patented hollow wrist.",
    category: "Automotive body & large parts",
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "15 kg" },
      { label: "Reach", value: "2,800 mm" },
      { label: "Protection", value: "ATEX Zone 1 / Class I Div 1" },
      { label: "Controller", value: "R-30iB Plus" },
      { label: "Programming", value: "ROBOGUIDE offline" },
    ],
    problem:
      "Large parts and car bodies need dependable coverage and uptime — an unplanned paint-line stop is expensive, and exposed hoses cause contamination.",
    solution:
      "A 2,800 mm reach, patented hollow wrist for clean hose routing, and one of the largest service/spares networks in North America keep the line predictable.",
    softwareAngle:
      "Version-control offline-generated paths and A/B-compare them centrally instead of on the pendant.",
    viz: { reach: 1.10, thick: 1.05, accent: "#F2B705" },
  },
  {
    id: "yaskawa-mpx3500",
    manufacturer: "Yaskawa",
    model: "Motoman MPX3500",
    tagline: "Fast, compact painter with a 70 mm hollow wrist for big applicators.",
    category: "Automotive body & components",
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "15 kg wrist / 25 kg arm" },
      { label: "Reach", value: "2,700 mm (3,500 wall)" },
      { label: "Repeatability", value: "±0.15 mm" },
      { label: "Protection", value: "FM Class I Div 1 / ATEX" },
      { label: "Controller", value: "DX200-FM" },
    ],
    problem:
      "Contoured and recessed parts are hard to coat evenly, and paint cells often can't talk cleanly to existing line and process controllers.",
    solution:
      "A 70 mm hollow wrist carries large rotary bells for tricky geometry, and the DX200-FM speaks EtherNet/IP, PROFINET, and EtherCAT out of the box.",
    softwareAngle:
      "Its open fieldbus is a clean tap point for live process telemetry into cloud analytics.",
    viz: { reach: 1.06, thick: 1.0, accent: "#1E5BFF" },
  },
  {
    id: "kawasaki-kj264",
    manufacturer: "Kawasaki",
    model: "KJ264",
    tagline: "Explosion-proof painter with a 3R hollow wrist and slim, wide-reaching body.",
    category: "Automotive body",
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "15 kg" },
      { label: "Reach", value: "2,640 mm" },
      { label: "Wrist", value: "3R hollow, 70 mm ID" },
      { label: "Protection", value: "Explosion-proof" },
      { label: "Mounting", value: "Floor, wall, shelf" },
    ],
    problem:
      "Rejects from dust and debris falling off exposed paint hoses quietly erode first-pass yield on body lines.",
    solution:
      "A 3R hollow wrist routes hoses internally and mounts equipment on the upper arm, cutting contamination while keeping a slim, wide motion range.",
    softwareAngle:
      "Feed its reject/defect capture into the same quality dataset as every other line.",
    viz: { reach: 1.04, thick: 1.0, accent: "#17A2A2" },
  },
  {
    id: "kuka-ready2-spray",
    manufacturer: "KUKA + Dürr",
    model: "ready2_spray (KR AGILUS EX)",
    tagline: "Compact general-industry package: KUKA arm + Dürr paint technology.",
    category: "General industry (metal, plastics, wood)",
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "10 kg" },
      { label: "Reach", value: "1,101 mm" },
      { label: "Repeatability", value: "0.03 mm" },
      { label: "Protection", value: "ATEX 3G/3D" },
      { label: "Controller", value: "KR C4 + Dürr EcoAUC" },
    ],
    problem:
      "Smaller GTA metal-fab, appliance, and job shops can't justify the cost and integration time of a full custom paint line.",
    solution:
      "A pre-configured, pre-tested cell with 0.03 mm repeatability lowers the barrier — 1K/2K, high/low pressure, water- or solvent-based on small and medium parts.",
    softwareAngle:
      "Even a packaged cell benefits from centralized recipe management and consumption tracking once several are deployed.",
    viz: { reach: 0.82, thick: 0.88, accent: "#FF7A1A" },
  },
];

export const ROBOTS_DISCLAIMER =
  "These are third-party industrial robots from ABB, FANUC, Yaskawa, Kawasaki, and KUKA/Dürr, shown to illustrate the professional painting-robot category. PaintForge is a pre-launch company, is not affiliated with or an authorized distributor of these manufacturers, and does not currently offer them for rent or sale. Specifications are from each manufacturer's public documentation.";

// Niche-level problem → solution pairs used on both pages.
export const NICHE_PROBLEMS: { problem: string; solution: string }[] = [
  {
    problem: "A deepening shortage of skilled sprayers caps how much a shop can coat.",
    solution: "Robotic cells run fatigue-free through breaks and shifts, so throughput stops tracking headcount.",
  },
  {
    problem: "Manual film build varies operator to operator, driving rework and warranty risk.",
    solution: "Closed-loop process control holds thickness to target on every part, logged for traceability.",
  },
  {
    problem: "Overspray wastes expensive coating and pushes VOC emissions toward compliance limits.",
    solution: "Optimized paths and high-transfer atomizers cut waste and the emissions that come with it.",
  },
  {
    problem: "A six-figure robot purchase is hard to justify against uncertain volume.",
    solution: "A service model converts capex into a monthly cost that scales up and down with the pipeline.",
  },
];
