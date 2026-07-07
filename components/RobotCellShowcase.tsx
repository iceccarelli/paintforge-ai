"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Layers, Gauge, RotateCcw, Play, Pause, Move3d } from "lucide-react";
import { ROBOTS } from "@/lib/robots";
import type { CellFrame } from "@/components/RobotCell3D";

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

const EMPTY: CellFrame = { coverage: 0, segment: 1, passes: 24, filmMil: 0, status: "Ready - press Start job" };

export function RobotCellShowcase() {
  const [selectedId, setSelectedId] = useState(ROBOTS[0].id);
  const [running, setRunning] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [frame, setFrame] = useState<CellFrame>(EMPTY);

  const robot = useMemo(() => ROBOTS.find((r) => r.id === selectedId)!, [selectedId]);
  const done = frame.coverage >= 100;

  const raf = useRef(0);
  const onFrame = useCallback((f: CellFrame) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setFrame(f));
  }, []);

  function selectRobot(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setReplayKey((k) => k + 1);
    setFrame(EMPTY);
    setRunning(true); // switch machine → it starts a fresh coat
  }
  function primary() {
    if (done) { setReplayKey((k) => k + 1); setFrame(EMPTY); setRunning(true); return; }
    setRunning((r) => !r);
  }
  function reset() {
    setReplayKey((k) => k + 1);
    setFrame(EMPTY);
    setRunning(false);
  }

  const primaryLabel = done ? "Replay coat" : running ? "Pause" : "Start job";
  const PrimaryIcon = done ? RotateCcw : running ? Pause : Play;

  return (
    <div className="rounded-3xl overflow-hidden border border-[#E2E8F0] bg-white shadow-xl">
      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        {/* Viewport */}
        <div className="relative bg-gradient-to-br from-[#0A2540] via-[#0D2B4A] to-[#081C33] min-h-[380px] lg:min-h-[560px]">
          <div className="absolute inset-0">
            <RobotCell3D robot={robot} running={running} replayKey={replayKey} onFrame={onFrame} />
          </div>

          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              InteriorFinish OS
            </span>
            <span
              className="text-[11px] font-mono rounded-full px-3 py-1 border"
              style={{ color: "#FF9A6B", borderColor: "rgba(255,107,53,0.3)", background: "rgba(255,107,53,0.1)" }}
            >
              {frame.status}
            </span>
            <span className="ml-auto text-[11px] text-white/50 inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <Move3d className="w-3.5 h-3.5" /> Drag to rotate
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3 pointer-events-none">
            <Stat icon={<Layers className="w-4 h-4" />} label="Coverage" value={`${frame.coverage.toFixed(0)}%`} />
            <Stat icon={<Gauge className="w-4 h-4" />} label="Film (±2 mil)" value={`${frame.filmMil.toFixed(1)} mil`} />
            <Stat icon={<Activity className="w-4 h-4" />} label="Pass" value={`${frame.segment}/${frame.passes}`} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-[#FF6B35] transition-[width] duration-150" style={{ width: `${frame.coverage}%` }} />
          </div>
        </div>

        {/* Control panel */}
        <div className="p-6 flex flex-col">
          <div className="kicker mb-3">SELECT A ROBOT</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {ROBOTS.map((r) => {
              const active = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRobot(r.id)}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors ${
                    active
                      ? "bg-[#0A2540] text-white border-[#0A2540]"
                      : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: r.viz.accent }} />
                  {r.manufacturer}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono tracking-[2px] uppercase text-[#FF6B35]">{robot.manufacturer}</div>
          <h3 className="font-semibold text-2xl tracking-tight text-[#0A2540] mb-1">{robot.model}</h3>
          <p className="text-sm text-[#475569] mb-4">{robot.tagline}</p>

          <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-sm mb-5">
            {robot.specs.slice(0, 6).map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="text-[10px] uppercase tracking-wider text-[#64748B]">{s.label}</dt>
                <dd className="font-medium text-[#0A2540] tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-sm text-[#475569] mb-5">
            <span className="font-semibold text-[#0A2540]">Solves. </span>
            {robot.solution}
          </div>

          <div className="mt-auto flex gap-3">
            <button
              type="button"
              onClick={primary}
              className="btn-primary flex-1 py-3 inline-flex items-center justify-center gap-2"
            >
              <PrimaryIcon className="w-4 h-4" /> {primaryLabel}
            </button>
            <button
              type="button"
              onClick={reset}
              className="btn-secondary px-4 py-3 inline-flex items-center justify-center gap-2"
              aria-label="Reset coat"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#64748B] px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        Concept simulation. Stylized generic 6-axis arms — proportions vary by the
        selected robot’s class, but these are not authorized vendor models, not a
        specific product, and not a live robot feed. Specs are from each
        manufacturer’s public documentation.
      </p>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
      <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wider">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-white font-semibold tabular-nums text-lg leading-tight">{value}</div>
    </div>
  );
}
