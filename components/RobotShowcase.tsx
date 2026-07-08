"use client";

/**
 * RobotShowcase — the "transparent, alive" web digital-twin preview.
 *
 * This is PaintForge's OWN concept machine (PF-1 InteriorFinish unit): a mobile
 * base + vertical lift mast + articulated spray head. It is deliberately NOT one
 * of the third-party reference arms in lib/robots.ts. Everything shown here is a
 * concept/target — no hardware is deployed. Keep it labelled that way.
 *
 * What you can inspect:
 *   • Solid   — normal shells.
 *   • Cutaway — a real clipping plane slices only the OUTER shells, exposing the
 *               drive motors, lift screw, gearbox and paint pump in cross-section.
 *   • Exploded— every subassembly translates along its own axis.
 *   • Slow-mo — internal animation (rotors, gears, pump piston) runs at 0.15×.
 *
 * Requires: @react-three/fiber @react-three/drei three (three is already in deps).
 *   npm i @react-three/fiber @react-three/drei
 *
 * Import it dynamically with ssr:false (see /raas, /saas, /dashboard).
 */

import { useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html, Edges } from "@react-three/drei";
import * as THREE from "three";
import {
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Layers,
  Gauge,
  Tag,
  Boxes,
} from "lucide-react";

/* ---------------------------------------------------------------- palette */
const NAVY = "#0A2540";
const ORANGE = "#FF6B35";
const STEEL = "#8A97A8";
const COPPER = "#C77B3B";
const PAINT = "#3B7DD8";

type Mode = "solid" | "cutaway" | "exploded";

/* A single vertical clipping plane. In cutaway mode it is attached ONLY to the
 * outer-shell materials, so the internals are never clipped — you look straight
 * into the machine. Normal (-1,0,0), constant 0 → removes the x>0 half of shells. */
function useCutPlane() {
  return useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), []);
}

/* --------------------------------------------------------------- primitives */

/** Outer shell: clippable, ghost-edged, so it reads as a housing you see through. */
function Shell({
  mode,
  plane,
  color = STEEL,
  opacity = 1,
  children,
  ...mesh
}: {
  mode: Mode;
  plane: THREE.Plane;
  color?: string;
  opacity?: number;
  children: React.ReactNode;
} & React.ComponentProps<"mesh">) {
  const cut = mode === "cutaway";
  return (
    <mesh castShadow receiveShadow {...mesh}>
      {children}
      <meshStandardMaterial
        color={color}
        metalness={0.65}
        roughness={0.35}
        transparent={cut || opacity < 1}
        opacity={cut ? 0.9 : opacity}
        side={cut ? THREE.DoubleSide : THREE.FrontSide}
        clippingPlanes={cut ? [plane] : []}
        clipShadows
      />
      <Edges threshold={22} color={cut ? ORANGE : "#40506A"} />
    </mesh>
  );
}

/** Internal metal part — never clipped, so it stays visible in cutaway. */
function Part({
  color = STEEL,
  metalness = 0.9,
  roughness = 0.35,
  children,
  ...mesh
}: {
  color?: string;
  metalness?: number;
  roughness?: number;
  children: React.ReactNode;
} & React.ComponentProps<"mesh">) {
  return (
    <mesh castShadow {...mesh}>
      {children}
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/** BLDC-style motor: stator can (shell) + spinning rotor with visible windings. */
function Motor({
  mode,
  plane,
  rpm,
  showLabels,
  label,
  ...group
}: {
  mode: Mode;
  plane: THREE.Plane;
  rpm: number;
  showLabels: boolean;
  label?: string;
} & React.ComponentProps<"group">) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rotor.current) rotor.current.rotation.z += rpm * dt;
  });
  return (
    <group {...group}>
      {/* stator can */}
      <Shell mode={mode} plane={plane} color="#5B6675" rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.34, 28]} />
      </Shell>
      {/* rotor + laminations + winding pegs */}
      <group ref={rotor}>
        <Part color={COPPER} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.36, 24]} />
        </Part>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <Part
              key={i}
              color="#3A2A18"
              position={[Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <boxGeometry args={[0.03, 0.34, 0.05]} />
            </Part>
          );
        })}
        {/* shaft */}
        <Part color="#C9D2DE" rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
        </Part>
      </group>
      {showLabels && label && <Pin y={0.28}>{label}</Pin>}
    </group>
  );
}

/** Two meshing spur gears turning opposite directions. */
function Gearbox({
  mode,
  plane,
  rpm,
  showLabels,
  ...group
}: {
  mode: Mode;
  plane: THREE.Plane;
  rpm: number;
  showLabels: boolean;
} & React.ComponentProps<"group">) {
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += rpm * dt;
    if (b.current) b.current.rotation.z -= rpm * dt * (18 / 12); // ratio
  });
  const gear = (teeth: number, r: number) => (
    <>
      <Part color="#9AA6B4" rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.09, 30]} />
      </Part>
      {Array.from({ length: teeth }).map((_, i) => {
        const t = (i / teeth) * Math.PI * 2;
        return (
          <Part key={i} color="#B7C2CF" position={[Math.cos(t) * (r + 0.02), Math.sin(t) * (r + 0.02), 0]}>
            <boxGeometry args={[0.05, 0.05, 0.09]} />
          </Part>
        );
      })}
    </>
  );
  return (
    <group {...group}>
      {/* gearbox housing (shell, clippable) */}
      <Shell mode={mode} plane={plane} color="#48525F">
        <boxGeometry args={[0.7, 0.5, 0.22]} />
      </Shell>
      <group ref={a} position={[-0.16, 0, 0.14]}>{gear(18, 0.18)}</group>
      <group ref={b} position={[0.18, 0, 0.14]}>{gear(12, 0.12)}</group>
      {showLabels && <Pin y={0.34}>Yaw gearbox 18:12</Pin>}
    </group>
  );
}

/** Positive-displacement paint pump with a reciprocating piston. */
function PaintPump({
  mode,
  plane,
  rpm,
  showLabels,
  ...group
}: {
  mode: Mode;
  plane: THREE.Plane;
  rpm: number;
  showLabels: boolean;
} & React.ComponentProps<"group">) {
  const piston = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (piston.current)
      piston.current.position.y = -0.02 + Math.sin(s.clock.elapsedTime * rpm) * 0.08;
  });
  return (
    <group {...group}>
      <Shell mode={mode} plane={plane} color="#3D4753">
        <cylinderGeometry args={[0.13, 0.13, 0.34, 24]} />
      </Shell>
      <Part ref={piston} color="#E2E8F0">
        <cylinderGeometry args={[0.09, 0.09, 0.16, 20]} />
      </Part>
      {/* fluid section + check valves */}
      <Part color={PAINT} position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
      </Part>
      {showLabels && <Pin y={0.3}>Paint pump (2-ball)</Pin>}
    </group>
  );
}

/** A wiring harness rendered as a tube — small but it makes it read as "alive". */
function Wire({ points, color = "#E4572E", r = 0.012 }: { points: THREE.Vector3[]; color?: string; r?: number }) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 40, r, 8, false);
  }, [points, r]);
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function Pin({ y, children }: { y: number; children: React.ReactNode }) {
  return (
    <Html position={[0, y, 0]} center distanceFactor={7} occlude>
      <div
        style={{
          background: "rgba(10,37,64,0.92)",
          color: "#fff",
          font: "600 11px/1.1 ui-monospace,monospace",
          padding: "3px 7px",
          borderRadius: 6,
          border: `1px solid ${ORANGE}`,
          whiteSpace: "nowrap",
          transform: "translateY(-4px)",
        }}
      >
        {children}
      </div>
    </Html>
  );
}

/* ------------------------------------------------------------- coverage wall */

const COLS = 18;
const ROWS = 11;
// Boustrophedon order: sweep each row, alternating direction.
const ORDER = (() => {
  const o: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) {
    const cols = r % 2 === 0 ? [...Array(COLS).keys()] : [...Array(COLS).keys()].reverse();
    for (const c of cols) o.push([c, r]);
  }
  return o;
})();

function Wall({ paintedRef }: { paintedRef: React.RefObject<number> }) {
  const cw = 3.6 / COLS;
  const ch = 2.4 / ROWS;
  const cells = useRef<(THREE.Mesh | null)[]>([]);
  // Reveal cells imperatively so we never read a ref during render.
  useFrame(() => {
    const p = Math.floor(paintedRef.current);
    for (let i = 0; i < ORDER.length; i++) {
      const m = cells.current[i];
      if (m) m.visible = i < p;
    }
  });
  return (
    <group position={[0, 1.4, -1.15]}>
      <mesh receiveShadow>
        <planeGeometry args={[3.7, 2.5]} />
        <meshStandardMaterial color="#EEF1F5" roughness={0.95} />
      </mesh>
      {ORDER.map(([c, r], i) => (
        <mesh
          key={i}
          ref={(el) => { cells.current[i] = el; }}
          visible={false}
          position={[-1.8 + cw * (c + 0.5), -1.2 + ch * (r + 0.5), 0.01]}
        >
          <planeGeometry args={[cw * 0.98, ch * 0.98]} />
          <meshStandardMaterial color={PAINT} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* --------------------------------------------------------------- the robot */

function Robot({
  mode,
  running,
  slow,
  showLabels,
  onCoverage,
}: {
  mode: Mode;
  running: boolean;
  slow: boolean;
  showLabels: boolean;
  onCoverage: (pct: number) => void;
}) {
  const plane = useCutPlane();
  const speed = slow ? 0.15 : 1;
  const paintedRef = useRef(0);
  const head = useRef<THREE.Group>(null);

  // explode offsets (0 solid, 1 exploded)
  const ex = mode === "exploded" ? 1 : 0;

  useFrame((_, dt) => {
    if (!running) return;
    // advance coverage
    const total = COLS * ROWS;
    paintedRef.current = Math.min(total, paintedRef.current + dt * speed * 6);
    const idx = Math.floor(paintedRef.current);
    onCoverage(Math.min(100, (paintedRef.current / total) * 100));
    // track the current cell with the spray head (yaw + pitch)
    const cell = ORDER[Math.min(idx, total - 1)];
    if (head.current && cell) {
      const tx = -1.8 + (3.6 / COLS) * (cell[0] + 0.5);
      const ty = 1.4 + (-1.2 + (2.4 / ROWS) * (cell[1] + 0.5));
      head.current.rotation.y = Math.atan2(tx, 1.0) * 0.6;
      head.current.rotation.x = -Math.atan2(ty - 1.9, 1.0) * 0.5;
    }
  });

  return (
    <group>
      <Wall paintedRef={paintedRef} />

      {/* ============ BASE (drive + power + control) ============ */}
      <group position={[0, 0.28 - ex * 0.15, 0]}>
        <Shell mode={mode} plane={plane} color={NAVY}>
          <boxGeometry args={[1.3, 0.42, 0.95]} />
        </Shell>
        {/* drive motors */}
        <Motor mode={mode} plane={plane} rpm={running ? 9 * speed : 0} showLabels={showLabels}
          label="Drive rotor" position={[-0.45, -0.02, 0.28 + ex * 0.4]} />
        <Motor mode={mode} plane={plane} rpm={running ? 9 * speed : 0} showLabels={false}
          position={[0.45, -0.02, 0.28 + ex * 0.4]} />
        {/* wheels */}
        {[-0.55, 0.55].map((x) =>
          [-0.42, 0.42].map((z) => (
            <Part key={`${x}${z}`} color="#1B2430" position={[x, -0.24, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 20]} />
            </Part>
          ))
        )}
        {/* battery pack */}
        <Part color="#2E7D46" position={[0, -0.02, -0.28 - ex * 0.35]}>
          <boxGeometry args={[0.8, 0.22, 0.24]} />
        </Part>
        {showLabels && <group position={[0, -0.02, -0.28 - ex * 0.35]}><Pin y={0.22}>48V battery</Pin></group>}
        {/* control PCB */}
        <Part color="#12351F" metalness={0.2} roughness={0.7} position={[0.1, 0.12 + ex * 0.5, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.3]} />
        </Part>
        {showLabels && <group position={[0.1, 0.12 + ex * 0.5, 0]}><Pin y={0.12}>Motion controller</Pin></group>}
        {/* wiring harness */}
        <Wire points={[
          new THREE.Vector3(-0.45, 0.02, 0.28),
          new THREE.Vector3(-0.1, 0.1, 0.1),
          new THREE.Vector3(0.1, 0.13, 0),
          new THREE.Vector3(0.35, 0.15, -0.2),
        ]} />
      </group>

      {/* ============ COLUMN (lift mast + lead screw) ============ */}
      <group position={[0, 1.05 + ex * 0.2, -0.1]}>
        <Shell mode={mode} plane={plane} color="#37414E">
          <boxGeometry args={[0.34, 1.5, 0.34]} />
        </Shell>
        {/* lead screw */}
        <LeadScrew rpm={running ? 6 * speed : 0} />
        {/* carriage */}
        <Part color="#C9D2DE" position={[0, 0.1, 0.2]}>
          <boxGeometry args={[0.4, 0.24, 0.14]} />
        </Part>
        {/* lift motor at top */}
        <Motor mode={mode} plane={plane} rpm={running ? 6 * speed : 0} showLabels={showLabels}
          label="Lift servo" position={[0, 0.85 + ex * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} />
        {showLabels && <Pin y={0.9}>Lift mast · ball-screw</Pin>}
      </group>

      {/* ============ HEAD (gearbox + pump + nozzle) ============ */}
      <group ref={head} position={[0, 1.9, 0.15 + ex * 0.5]}>
        <Gearbox mode={mode} plane={plane} rpm={running ? 5 * speed : 0} showLabels={showLabels}
          position={[0, 0, -0.15]} />
        <PaintPump mode={mode} plane={plane} rpm={running ? 10 * speed : 0} showLabels={showLabels}
          position={[0.15 + ex * 0.3, 0, 0.15]} />
        {/* nozzle */}
        <Part color="#0B1622" position={[0, -0.12, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.05, 0.16, 16]} />
        </Part>
        {/* paint feed hose */}
        <Wire color={PAINT} r={0.018} points={[
          new THREE.Vector3(0.15, -0.1, 0.15),
          new THREE.Vector3(0.08, -0.14, 0.28),
          new THREE.Vector3(0, -0.12, 0.4),
        ]} />
        {/* spray cone (only while running & not exploded) */}
        {running && mode !== "exploded" && (
          <mesh position={[0, -0.12, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.32, 0.9, 20, 1, true]} />
            <meshBasicMaterial color={PAINT} transparent opacity={0.14} side={THREE.DoubleSide} />
          </mesh>
        )}
        {showLabels && <Pin y={0.28}>HVLP spray head</Pin>}
      </group>
    </group>
  );
}

function LeadScrew({ rpm }: { rpm: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += rpm * dt;
  });
  return (
    <group ref={ref}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.4, 16]} />
        <meshStandardMaterial color="#DDE4EC" metalness={0.9} roughness={0.25} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, -0.66 + i * 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.012, 8, 20]} />
          <meshStandardMaterial color="#AEB8C4" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------- panel */

export function RobotShowcase() {
  const [mode, setMode] = useState<Mode>("cutaway");
  const [running, setRunning] = useState(true);
  const [slow, setSlow] = useState(false);
  const [labels, setLabels] = useState(true);
  const [coverage, setCoverage] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const rafPending = useRef(false);
  const onCoverage = useCallback((v: number) => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      setCoverage(v);
    });
  }, []);

  function reset() {
    setResetKey((k) => k + 1);
    setCoverage(0);
    setRunning(true);
  }

  const modeBtn = (m: Mode, icon: React.ReactNode, text: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`text-xs font-semibold rounded-full px-3 py-1.5 border inline-flex items-center gap-1.5 transition-colors ${
        mode === m
          ? "bg-[#0A2540] text-white border-[#0A2540]"
          : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"
      }`}
    >
      {icon}
      {text}
    </button>
  );

  return (
    <div className="rounded-3xl overflow-hidden border border-[#E2E8F0] bg-white shadow-xl">
      <div className="grid lg:grid-cols-[1.7fr_1fr]">
        {/* viewport */}
        <div className="relative bg-gradient-to-br from-[#0A2540] via-[#0D2B4A] to-[#081C33] min-h-[420px] lg:min-h-[600px]">
          <Canvas
            key={resetKey}
            shadows
            dpr={[1, 2]}
            gl={{ localClippingEnabled: true, antialias: true }}
            camera={{ position: [3.4, 2.3, 3.8], fov: 42 }}
          >
            <hemisphereLight intensity={0.7} groundColor="#0A2540" />
            <directionalLight position={[4, 6, 3]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-4, 3, -2]} intensity={0.6} color={ORANGE} />
            <Robot mode={mode} running={running} slow={slow} showLabels={labels} onCoverage={onCoverage} />
            <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={9} blur={2.4} far={4} />
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={9}
              maxPolarAngle={Math.PI / 2.05}
              target={[0, 1.1, 0]}
            />
          </Canvas>

          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/70 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              PF-1 · Digital twin (concept)
            </span>
            <span className="text-[11px] font-mono rounded-full px-3 py-1 border" style={{ color: "#FF9A6B", borderColor: "rgba(255,107,53,0.3)", background: "rgba(255,107,53,0.1)" }}>
              {mode === "cutaway" ? "Cross-section" : mode === "exploded" ? "Exploded" : "Assembled"}
            </span>
            <span className="ml-auto text-[11px] text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              Drag to orbit · scroll to zoom
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
            <div className="h-full bg-[#FF6B35] transition-[width] duration-150" style={{ width: `${coverage}%` }} />
          </div>
          <div className="absolute bottom-4 left-4 text-white/70 text-[11px] font-mono bg-white/5 border border-white/10 rounded-full px-3 py-1">
            Coverage {coverage.toFixed(0)}% · boustrophedon plan
          </div>
        </div>

        {/* controls */}
        <div className="p-6 flex flex-col">
          <div className="kicker mb-3">INSPECT THE MACHINE</div>
          <p className="text-sm text-[#475569] mb-4">
            This is the PaintForge concept unit rendered as an inspectable twin. Slice it open,
            explode it, or watch the internals move. Every part shown is a design target.
          </p>

          <div className="text-[10px] uppercase tracking-wider text-[#64748B] mb-2">View</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {modeBtn("solid", <Boxes className="w-3.5 h-3.5" />, "Assembled")}
            {modeBtn("cutaway", <Scissors className="w-3.5 h-3.5" />, "Cutaway")}
            {modeBtn("exploded", <Layers className="w-3.5 h-3.5" />, "Exploded")}
          </div>

          <div className="text-[10px] uppercase tracking-wider text-[#64748B] mb-2">Motion</div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button type="button" onClick={() => setRunning((r) => !r)}
              className="text-xs font-semibold rounded-full px-3 py-1.5 border inline-flex items-center gap-1.5 bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]">
              {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {running ? "Pause" : "Run"}
            </button>
            <button type="button" onClick={() => setSlow((s) => !s)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 border inline-flex items-center gap-1.5 ${slow ? "bg-[#0A2540] text-white border-[#0A2540]" : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"}`}>
              <Gauge className="w-3.5 h-3.5" /> Slow-mo 0.15×
            </button>
            <button type="button" onClick={() => setLabels((l) => !l)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 border inline-flex items-center gap-1.5 ${labels ? "bg-[#0A2540] text-white border-[#0A2540]" : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]"}`}>
              <Tag className="w-3.5 h-3.5" /> Labels
            </button>
            <button type="button" onClick={reset}
              className="text-xs font-semibold rounded-full px-3 py-1.5 border inline-flex items-center gap-1.5 bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-sm mb-5">
            {[
              ["Drive", "2× BLDC hub"],
              ["Lift", "Ball-screw mast"],
              ["Wrist", "Yaw gearbox 18:12"],
              ["Applicator", "HVLP spray head"],
              ["Power", "48V pack"],
              ["Plan", "Boustrophedon"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="text-[10px] uppercase tracking-wider text-[#64748B]">{k}</dt>
                <dd className="font-medium text-[#0A2540] tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto rounded-xl bg-[#FFF7ED] border border-[#FFD9C2] p-3 text-[12px] text-[#9A4B24]">
            Concept geometry, not a manufactured product or live robot feed. Dimensions and
            components are design targets that pilot partners will help finalise.
          </div>
        </div>
      </div>
    </div>
  );
}

export default RobotShowcase;
