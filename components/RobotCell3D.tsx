"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface CellFrame {
  coverage: number;
  segment: number;
  passes: number;
  filmMil: number;
  status: string;
}

// A generic 6-axis articulated painting arm, built from primitives (no CAD /
// no vendor models), sweeping a spray path across a panel while "coverage"
// fills in. Drag to orbit. Concept simulation — not a specific product and
// not a live robot feed.
export function RobotCell3D({
  onFrame,
  replayKey = 0,
}: {
  onFrame?: (f: CellFrame) => void;
  replayKey?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    const NAVY = 0x0a2540;
    const ORANGE = 0xff6b35;
    const STEEL = 0x9fb3c8;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(6, 10, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: 0xeef2f7, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Target panel
    const PANEL_W = 3.2;
    const PANEL_H = 2.4;
    const panelGroup = new THREE.Group();
    panelGroup.position.set(-2.6, 1.7, 0);
    scene.add(panelGroup);
    const panelBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, PANEL_H, PANEL_W),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.9 })
    );
    panelBack.castShadow = true;
    panelBack.receiveShadow = true;
    panelGroup.add(panelBack);

    const STRIPS = 24;
    const strips: THREE.Mesh[] = [];
    for (let i = 0; i < STRIPS; i++) {
      const s = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, PANEL_H * 0.96, (PANEL_W / STRIPS) * 0.96),
        new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.35, metalness: 0.1 })
      );
      s.position.set(0.08, 0, -PANEL_W / 2 + (i + 0.5) * (PANEL_W / STRIPS));
      s.scale.y = 0.001;
      s.visible = false;
      panelGroup.add(s);
      strips.push(s);
    }

    // Arm
    const matBody = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, metalness: 0.2 });
    const matJoint = new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.4, metalness: 0.5 });
    const matTool = new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.3, metalness: 0.2 });

    function lnk(len: number, r: number, mat: THREE.Material) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(r, len, r), mat);
      m.castShadow = true;
      m.position.y = len / 2;
      return m;
    }
    function jnt(r: number) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, r * 1.2, 20), matJoint);
      m.castShadow = true;
      return m;
    }

    const base = new THREE.Group();
    base.position.set(1.4, 0, 0);
    base.rotation.y = Math.PI * 0.5;
    scene.add(base);
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.5, 28), matJoint);
    plinth.position.y = 0.25;
    plinth.castShadow = true;
    base.add(plinth);

    const shoulder = new THREE.Group();
    shoulder.position.y = 0.5;
    base.add(shoulder);
    const j1 = jnt(0.4);
    j1.rotation.x = Math.PI / 2;
    shoulder.add(j1);

    const upper = new THREE.Group();
    shoulder.add(upper);
    upper.add(lnk(2.0, 0.34, matBody));

    const elbow = new THREE.Group();
    elbow.position.y = 2.0;
    upper.add(elbow);
    const j2 = jnt(0.32);
    j2.rotation.x = Math.PI / 2;
    elbow.add(j2);

    const fore = new THREE.Group();
    elbow.add(fore);
    fore.add(lnk(1.7, 0.26, matBody));

    const wrist = new THREE.Group();
    wrist.position.y = 1.7;
    fore.add(wrist);
    const j3 = jnt(0.22);
    j3.rotation.x = Math.PI / 2;
    wrist.add(j3);

    const tool = new THREE.Group();
    wrist.add(tool);
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), matTool);
    gun.position.y = 0.25;
    gun.castShadow = true;
    tool.add(gun);
    const coneMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0 });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.9, 20, 1, true), coneMat);
    cone.position.y = 1.05;
    cone.rotation.x = Math.PI;
    tool.add(cone);

    function setPose(t: number) {
      shoulder.rotation.y = -0.15 + Math.sin(t * Math.PI * 2) * 0.02;
      upper.rotation.x = -0.55 + Math.sin(t * Math.PI) * -0.15;
      elbow.rotation.x = 1.0 + Math.sin(t * Math.PI) * 0.25;
      fore.rotation.x = -0.2;
      wrist.rotation.x = -0.25;
      upper.rotation.z = (t - 0.5) * 0.5;
    }

    // Camera orbit (spherical around target) + pointer drag
    const target = new THREE.Vector3(-0.4, 1.7, 0);
    let theta = 0.9;
    let phi = 1.15;
    const radius = 9.2;
    let userInteracted = false;
    let dragging = false;
    let px = 0;
    let py = 0;

    function applyCamera() {
      camera.position.x = target.x + radius * Math.sin(phi) * Math.cos(theta);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.lookAt(target);
    }

    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      userInteracted = true;
      px = e.clientX;
      py = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      theta -= (e.clientX - px) * 0.008;
      phi = Math.min(1.45, Math.max(0.35, phi - (e.clientY - py) * 0.006));
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      el.style.cursor = "grab";
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    const clock = new THREE.Clock();
    let painted = 0;
    let raf = 0;
    let lastEmit = 0;

    function render() {
      const elapsed = clock.getElapsedTime();
      if (!reduced && !userInteracted) theta += 0.0016;
      applyCamera();

      const passDuration = 0.55;
      const totalProgress = reduced ? STRIPS : elapsed / passDuration;
      const currentPass = Math.min(STRIPS, Math.floor(totalProgress));
      const within = totalProgress - Math.floor(totalProgress);
      setPose(reduced ? 0.5 : within);

      while (painted < currentPass && painted < STRIPS) {
        strips[painted].visible = true;
        painted++;
      }
      if (painted > 0 && painted <= STRIPS) {
        const grow = reduced ? 1 : Math.min(1, within * 1.4);
        const s = strips[painted - 1];
        if (s) s.scale.y = 0.001 + grow * 0.999;
      }
      coneMat.opacity = reduced ? 0.25 : painted < STRIPS ? 0.18 + within * 0.12 : 0;

      const coverage = Math.min(100, (painted / STRIPS) * 100);
      const done = painted >= STRIPS;
      if (onFrame && elapsed - lastEmit > 0.12) {
        lastEmit = elapsed;
        onFrame({
          coverage,
          segment: Math.min(painted + 1, STRIPS),
          passes: STRIPS,
          filmMil: 2.0 + Math.sin(elapsed * 3) * 0.4,
          status: done ? "Coat complete - report ready" : "Spraying - closed-loop",
        });
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    }
    render();

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
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
  }, [onFrame, replayKey]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
