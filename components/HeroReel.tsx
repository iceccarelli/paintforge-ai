"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// HERO IMAGE REEL — 8 Unsplash images, construction / painting / robotics.
// Swap any URL below for your own picks (unsplash.com → right-click →
// "Copy image address", or use images.unsplash.com/photo-<ID>?auto=format...).
// Images are preloaded and any URL that fails to load is silently dropped,
// so a dead link can never break the hero — the navy gradient always renders
// underneath as the base layer.
// ---------------------------------------------------------------------------
const HERO_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=70",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=70",
];

const SLIDE_MS = 8000; // time per slide
const FADE_MS = 1800; // crossfade duration

// Fisher–Yates — a fresh random order on every page load
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function preload(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function HeroReel() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mount: preload all candidates, keep the ones that load, shuffle them.
  useEffect(() => {
    let cancelled = false;
    Promise.all(HERO_IMAGES.map(preload)).then((results) => {
      if (cancelled) return;
      const ok = results.filter((u): u is string => u !== null);
      if (ok.length === 0) return; // gradient-only hero, still looks intentional
      setImages(shuffle(ok));
      setVisible(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rotation
  useEffect(() => {
    if (images.length < 2) return;
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      SLIDE_MS
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base layer: brand navy gradient — always present */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0D2B4A] to-[#081C33]" />

      {/* Image layers: current + previous kept mounted for crossfade */}
      {images.map((src, i) => {
        const isActive = i === index;
        const isPrev = i === (index - 1 + images.length) % images.length;
        if (!isActive && !isPrev) return null;
        return (
          <div
            key={src}
            className={`absolute inset-0 kb kb-${i % 4}`}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: visible && isActive ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
        );
      })}

      {/* Legibility overlay: navy wash + vignette so white text always reads */}
      <div className="absolute inset-0 bg-[#0A2540]/78" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-[#0A2540]/60" />
    </div>
  );
}
