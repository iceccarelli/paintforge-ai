"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Layers, Gauge, RotateCcw, Move3d } from "lucide-react";
import type { CellFrame } from "@/components/RobotCell3D";

// Lazy-load the WebGL scene so three.js never touches the server bundle or the
// initial page load — it downloads only when this component mounts.
const RobotCell3D = dynamic(
  () => import("@/components/RobotCell3D").then((m) => m.RobotCell3D),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
        Loading cell…
      </div>
    ),
  }
);

export function RobotCellShowcase() {
  const [frame, setFrame] = useState<CellFrame>({
    coverage: 0,
    segment: 1,
    passes: 24,
    filmMil: 2,
    status: "Initializing",
  });
  const [replayKey, setReplayKey] = useState(0);

  const raf = useRef(0);
  const onFrame = useCallback((f: CellFrame) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setFrame(f));
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0A2540] via-[#0D2B4A] to-[#081C33]">
      <div className="relative h-[380px] sm:h-[460px] md:h-[520px]">
        <RobotCell3D onFrame={onFrame} replayKey={replayKey} />

        {/* HUD — the "SaaS" driving the robot */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2 pointer-events-none">
          <span className="text-[11px] font-mono tracking-widest uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            InteriorFinish OS · live path
          </span>
          <span className="text-[11px] font-mono text-[#FF9A6B] bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full px-3 py-1">
            {frame.status}
          </span>
          <span className="ml-auto text-[11px] text-white/50 inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <Move3d className="w-3.5 h-3.5" /> Drag to rotate
          </span>
        </div>

        {/* Replay control */}
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="absolute top-14 right-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#E85D04] rounded-full px-3.5 py-1.5 transition-colors shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Replay coat
        </button>

        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3 pointer-events-none">
          <Stat icon={<Layers className="w-4 h-4" />} label="Coverage" value={`${frame.coverage.toFixed(0)}%`} />
          <Stat icon={<Gauge className="w-4 h-4" />} label="Film (target ±2 mil)" value={`${frame.filmMil.toFixed(1)} mil`} />
          <Stat icon={<Activity className="w-4 h-4" />} label="Pass" value={`${frame.segment}/${frame.passes}`} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div className="h-full bg-[#FF6B35] transition-[width] duration-150" style={{ width: `${frame.coverage}%` }} />
        </div>
      </div>

      <p className="text-[11px] text-white/45 px-4 py-3 border-t border-white/10">
        Concept simulation. A generic 6-axis arm illustrating how the platform
        would plan and drive a spray path with closed-loop film-thickness
        targeting. Not a specific product, not an authorized vendor model, and
        not a live robot feed.
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
      <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wider">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-white font-semibold tabular-nums text-lg leading-tight">
        {value}
      </div>
    </div>
  );
}
