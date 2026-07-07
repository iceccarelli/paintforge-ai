"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Robot } from "@/lib/robots";

export interface CellFrame {
  coverage: number;
  segment: number;
  passes: number;
  filmMil: number;
  status: string;
}

// Per-robot morphology so each of the five reads as a DIFFERENT machine —
// distinct base, proportions, wrist and applicator. Stylized + class-accurate,
// NOT a trade-dress replica. Colour comes from robot.viz.accent.
type Base = "pedestal" | "wide" | "shelf" | "compact";
type Tool = "bell" | "hollow" | "gun";
interface Morph { L1: number; L2: number; thick: number; base: Base; tool: Tool; process: boolean }

const MORPH: Record<string, Morph> = {
  "abb-irb-5500":      { L1: 2.05, L2: 1.75, thick: 1.08, base: "wide",     tool: "bell",   process: true },
  "fanuc-p-250ib":     { L1: 2.30, L2: 1.90, thick: 1.12, base: "pedestal", tool: "hollow", process: false },
  "yaskawa-mpx3500":   { L1: 2.05, L2: 1.70, thick: 1.05, base: "pedestal", tool: "bell",   process: true },
  "kawasaki-kj264":    { L1: 2.00, L2: 1.62, thick: 0.95, base: "shelf",    tool: "hollow", process: false },
  "kuka-ready2-spray": { L1: 1.35, L2: 1.12, thick: 0.82, base: "compact",  tool: "gun",    process: false },
};
const DEFAULT_MORPH: Morph = { L1: 2.0, L2: 1.7, thick: 1.0, base: "pedestal", tool: "gun", process: false };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function RobotCell3D({
  robot,
  running,
  replayKey = 0,
  onFrame,
}: {
  robot: Robot;
  running: boolean;
  replayKey?: number;
  onFrame?: (f: CellFrame) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(running);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const M = MORPH[robot.id] ?? DEFAULT_MORPH;
    const accent = new THREE.Color(robot.viz?.accent ?? "#FF6B35");
    const L1 = M.L1;
    const L2 = M.L2;
    const reachTotal = L1 + L2;
    const T = M.thick;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    const NAVY = 0x0a2540;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(5, 10, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    scene.add(key);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(reachTotal * 2.4, 48),
      new THREE.MeshStandardMaterial({ color: 0xeef2f7, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ---- Layout: shoulder fixed; panel sized/placed to the robot's reach ----
    const SX = 1.5; // shoulder x
    const SY = 0.55; // shoulder pivot height
    const panelFrontX = SX - reachTotal * 0.62;
    const toolX = panelFrontX + 0.18;
    const panelCenterY = SY + reachTotal * 0.22;
    const panelHalfH = clamp(reachTotal * 0.34, 0.7, 1.25);
    const panelW = reachTotal * 0.82;

    // ---- Panel + coverage strips (along z) ----
    const panelGroup = new THREE.Group();
    panelGroup.position.set(panelFrontX, panelCenterY, 0);
    scene.add(panelGroup);
    panelGroup.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.12, panelHalfH * 2, panelW),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.9 })
      )
    );
    const STRIPS = 24;
    const strips: THREE.Mesh[] = [];
    for (let i = 0; i < STRIPS; i++) {
      const s = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, panelHalfH * 1.9, (panelW / STRIPS) * 0.94),
        new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.35, metalness: 0.1 })
      );
      s.position.set(0.08, 0, -panelW / 2 + (i + 0.5) * (panelW / STRIPS));
      s.visible = false;
      panelGroup.add(s);
      strips.push(s);
    }
    const stripZ = (i: number) => -panelW / 2 + (i + 0.5) * (panelW / STRIPS);

    // ---- Materials ----
    const matBody = new THREE.MeshStandardMaterial({ color: 0xf2f4f7, roughness: 0.5, metalness: 0.2 });
    const matAcc = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.4, metalness: 0.45 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x2a3a4d, roughness: 0.6, metalness: 0.3 });
    const matTool = new THREE.MeshStandardMaterial({ color: 0xff6b35, roughness: 0.35, metalness: 0.25 });

    function box(w: number, h: number, d: number, mat: THREE.Material) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.castShadow = true;
      return m;
    }
    // link extends along +X from origin
    function link(len: number, r: number, mat: THREE.Material) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(len, r, r), mat);
      m.castShadow = true;
      m.position.x = len / 2;
      return m;
    }
    function jointCyl(r: number, mat: THREE.Material) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, r * 1.3, 22), mat);
      m.castShadow = true;
      m.rotation.x = Math.PI / 2; // axis along Z
      return m;
    }

    // ---- Base (distinct per robot) ----
    const base = new THREE.Group();
    base.position.set(SX, 0, 0);
    scene.add(base);
    if (M.base === "pedestal") {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * T, 0.6 * T, SY, 26), matDark);
      col.position.y = SY / 2; col.castShadow = true; base.add(col);
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * T, 0.5 * T, 0.14, 26), matAcc);
      ring.position.y = SY - 0.06; base.add(ring);
    } else if (M.base === "wide") {
      const slab = box(1.5 * T, 0.34, 1.1 * T, matDark);
      slab.position.y = 0.17; base.add(slab);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.4 * T, 0.5 * T, SY - 0.3, 24), matAcc);
      post.position.y = 0.17 + (SY - 0.3) / 2; post.castShadow = true; base.add(post);
    } else if (M.base === "shelf") {
      const bracket = box(0.7 * T, SY, 1.0 * T, matDark);
      bracket.position.y = SY / 2; base.add(bracket);
      const plate = box(0.9 * T, 0.14, 1.2 * T, matAcc);
      plate.position.y = SY - 0.07; base.add(plate);
    } else {
      // compact
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.34 * T, 0.44 * T, SY, 24), matAcc);
      c.position.y = SY / 2; c.castShadow = true; base.add(c);
    }

    // ---- Arm chain (links along +X; pitch about Z; base yaw about Y) ----
    const shoulder = new THREE.Group();
    shoulder.position.y = SY;
    base.add(shoulder);
    shoulder.add(jointCyl(0.34 * T, matAcc));

    const upper = new THREE.Group();
    shoulder.add(upper);
    upper.add(link(L1, 0.3 * T, matBody));
    if (M.process) {
      // bulky process box riding the upper arm (ABB/Yaskawa look)
      const pbox = box(L1 * 0.5, 0.34 * T, 0.5 * T, matAcc);
      pbox.position.set(L1 * 0.5, 0.28 * T, 0);
      upper.add(pbox);
    }

    const elbow = new THREE.Group();
    elbow.position.x = L1;
    upper.add(elbow);
    elbow.add(jointCyl(0.27 * T, matAcc));

    const fore = new THREE.Group();
    elbow.add(fore);
    const foreR = (M.tool === "hollow" ? 0.28 : 0.22) * T; // hollow-wrist arms read thicker
    fore.add(link(L2, foreR, matBody));

    const wrist = new THREE.Group();
    wrist.position.x = L2;
    fore.add(wrist);
    wrist.add(jointCyl(0.18 * T, matAcc));

    // ---- Applicator (distinct per robot) ----
    const tool = new THREE.Group();
    wrist.add(tool);
    if (M.tool === "bell") {
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.3, 16), matDark);
      neck.rotation.z = Math.PI / 2; neck.position.x = 0.15; tool.add(neck);
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.05, 0.16, 22), matTool);
      bell.rotation.z = Math.PI / 2; bell.position.x = 0.36; tool.add(bell);
    } else if (M.tool === "hollow") {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 12, 22), matTool);
      ring.position.x = 0.16; tool.add(ring);
      const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.18, 14), matDark);
      noz.rotation.z = Math.PI / 2; noz.position.x = 0.32; tool.add(noz);
    } else {
      const g = box(0.26, 0.34, 0.16, matTool);
      g.position.x = 0.16; tool.add(g);
      const noz = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.16, 14), matDark);
      noz.rotation.z = Math.PI / 2; noz.position.x = 0.35; tool.add(noz);
    }
    // spray cone points along +X toward the wall
    const coneMat = new THREE.MeshBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0 });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.7, 18, 1, true), coneMat);
    cone.rotation.z = -Math.PI / 2;
    cone.position.x = 0.7;
    tool.add(cone);

    // ---- Inverse kinematics: reach world target with the tool tip ----
    const pivot = new THREE.Vector3(SX, SY, 0);
    function reachTo(tx: number, ty: number, tz: number) {
      const dx = tx - pivot.x;
      const dz = tz - pivot.z;
      base.rotation.y = Math.atan2(-dz, dx);
      const r = Math.sqrt(dx * dx + dz * dz);
      const v = ty - pivot.y;
      const D = Math.min(Math.sqrt(r * r + v * v), reachTotal - 0.04);
      const a = Math.atan2(v, r);
      const cosB = clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1);
      const cosC = clamp((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2), -1, 1);
      upper.rotation.z = a + Math.acos(cosB);
      elbow.rotation.z = -(Math.PI - Math.acos(cosC));
    }

    // serpentine target across the panel for job progress p in [0,1]
    function targetFor(p: number): [number, number, number] {
      const colF = clamp(p, 0, 1) * STRIPS;
      const col = Math.min(STRIPS - 1, Math.floor(colF));
      const frac = colF - Math.floor(colF);
      const top = panelCenterY + panelHalfH * 0.82;
      const bot = panelCenterY - panelHalfH * 0.82;
      const y = col % 2 === 0 ? top + (bot - top) * frac : bot + (top - bot) * frac;
      return [toolX, y, stripZ(col)];
    }

    // ---- Camera orbit + drag ----
    const target = new THREE.Vector3((panelFrontX + SX) / 2 - 0.2, panelCenterY - 0.1, 0);
    let theta = 0.85;
    let phi = 1.12;
    const radius = reachTotal * 2.35;
    let userInteracted = false;
    let dragging = false;
    let px = 0, py = 0;
    function applyCamera() {
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.cos(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(target);
    }
    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => { dragging = true; userInteracted = true; px = e.clientX; py = e.clientY; el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing"; };
    const onMove = (e: PointerEvent) => { if (!dragging) return; theta -= (e.clientX - px) * 0.008; phi = clamp(phi - (e.clientY - py) * 0.006, 0.35, 1.45); px = e.clientX; py = e.clientY; };
    const onUp = (e: PointerEvent) => { dragging = false; el.style.cursor = "grab"; try { el.releasePointerCapture(e.pointerId); } catch {} };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    // rest pose aimed at panel centre
    reachTo(...targetFor(0));

    let progress = 0;
    let painted = 0;
    let raf = 0;
    let lastEmit = 0;
    let last = performance.now();

    function render() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!userInteracted && !reduced) theta += 0.0014;
      applyCamera();

      const isRunning = runningRef.current;
      if (isRunning && progress < 1) progress = Math.min(1, progress + dt / 12); // ~12s full coat
      const [tx, ty, tz] = targetFor(progress);
      reachTo(tx, ty, tz);

      const col = Math.min(STRIPS, Math.floor(progress * STRIPS));
      while (painted < col && painted < STRIPS) {
        strips[painted].visible = true;
        painted++;
      }
      const done = progress >= 1;
      if (done) for (let i = 0; i < STRIPS; i++) strips[i].visible = true;
      coneMat.opacity = isRunning && !done ? 0.22 : 0;

      const coverage = Math.min(100, (done ? STRIPS : painted) / STRIPS * 100);
      if (onFrame && now / 1000 - lastEmit > 0.1) {
        lastEmit = now / 1000;
        onFrame({
          coverage,
          segment: Math.min(col + 1, STRIPS),
          passes: STRIPS,
          filmMil: done ? 2.0 : isRunning ? 2.0 + Math.sin(now / 500) * 0.35 : 0,
          status: done ? "Coat complete - report ready" : isRunning ? "Spraying - closed-loop" : "Ready - press Start job",
        });
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    }
    render();

    const onResize = () => {
      width = mount.clientWidth; height = mount.clientHeight;
      camera.aspect = width / height; camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [robot, replayKey, onFrame]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
