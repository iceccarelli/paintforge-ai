// Layered architecture diagram for the planned InteriorFinish OS platform.
// Pure Tailwind — no JS, no images, no layout shift. Framed as target
// architecture (design intent), consistent with the site's roadmap language.

const LAYERS: {
  tier: string;
  title: string;
  detail: string;
  tone: "hw" | "mid" | "core" | "cloud" | "ui";
}[] = [
  {
    tier: "Layer 5",
    title: "Dashboards & AI",
    detail:
      "Fleet view, digital-twin playback, defect review, consumption & OEE analytics, alerts.",
    tone: "ui",
  },
  {
    tier: "Layer 4",
    title: "Cloud Platform",
    detail:
      "Multi-site data store, recipe/version management, model training for vision & predictive maintenance.",
    tone: "cloud",
  },
  {
    tier: "Layer 3",
    title: "PaintForge Orchestration Layer",
    detail:
      "Vendor-neutral job model, path scheduling, telemetry normalization, role-based access.",
    tone: "core",
  },
  {
    tier: "Layer 2",
    title: "Middleware / Vendor SDK / Fieldbus",
    detail:
      "ROS 2 or vendor APIs; OPC-UA, MQTT, EtherNet/IP, PROFINET, EtherCAT bridges to line & paint controllers.",
    tone: "mid",
  },
  {
    tier: "Layer 1",
    title: "Robot Controller (per vendor)",
    detail:
      "ABB IRC5P · FANUC R-30iB Plus · Yaskawa DX200-FM · Kawasaki · KUKA KR C4 + Dürr EcoAUC.",
    tone: "hw",
  },
];

const TONE: Record<string, string> = {
  ui: "bg-[#FF6B35] text-white border-[#E85D04]",
  cloud: "bg-[#1E3A5F] text-white border-[#0A2540]",
  core: "bg-[#0A2540] text-white border-[#0A2540]",
  mid: "bg-[#F1F5F9] text-[#0A2540] border-[#E2E8F0]",
  hw: "bg-white text-[#0A2540] border-[#E2E8F0]",
};

export function IntegrationDiagram() {
  return (
    <div className="relative">
      <ul className="space-y-3" aria-label="Execution stack, top to bottom">
        {LAYERS.map((l) => (
          <li
            key={l.tier}
            className={`rounded-2xl border p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 ${TONE[l.tone]}`}
          >
            <div className="flex items-center gap-3 md:w-64 flex-shrink-0">
              <span className="text-[11px] font-mono tracking-widest opacity-70">
                {l.tier}
              </span>
              <span className="font-semibold text-lg tracking-tight">
                {l.title}
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{l.detail}</p>
          </li>
        ))}
      </ul>

      {/* Data-flow caption */}
      <p className="mt-5 text-xs text-[#64748B]">
        Bidirectional: job programs and recipes flow down; telemetry, images,
        and status flow up. Edge buffering keeps a booth running if the cloud
        link drops. This is the target architecture PaintForge is building
        toward — not a shipped, certified deployment.
      </p>
    </div>
  );
}
