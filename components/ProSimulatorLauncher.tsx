"use client";

/**
 * ProSimulatorLauncher — the bridge from the Next.js site into the Godot 4
 * high-fidelity "Pro Simulator".
 *
 * Two targets:
 *   • Web player  — the Godot HTML5 export, served from /pro-sim/ (static),
 *                   opened in a new tab with job params in the query string.
 *   • Desktop app — a signed download (Win/macOS/Linux) that reads the same
 *                   params from a deep link (paintforge://sim?...) or a dropped
 *                   .pfjob file.
 *
 * Set NEXT_PUBLIC_PRO_SIM_URL to the deployed web build (e.g. a Vercel static
 * route or an itch.io/CDN URL). If unset, the button shows an honest
 * "in development" state instead of 404-ing — pre-launch discipline.
 *
 * Job params let the same scenario the visitor just configured (sqft, coats,
 * surface, robot) carry straight into the Pro sim. Passed as URL params the
 * Godot build parses via JavaScriptBridge / OS.get_cmdline_args().
 */

import { useState } from "react";
import { Rocket, Monitor, Download, ChevronDown, Info } from "lucide-react";

export interface SimJob {
  sqft?: number;
  coats?: number;
  surface?: "wall" | "ceiling" | "both";
  robotId?: string;
  source?: string; // which page launched it, for analytics
}

const WEB_URL = process.env.NEXT_PUBLIC_PRO_SIM_URL; // undefined until built
const DESKTOP_BASE = process.env.NEXT_PUBLIC_PRO_SIM_DESKTOP; // release folder/URL

function toQuery(job: SimJob): string {
  const p = new URLSearchParams();
  Object.entries(job).forEach(([k, v]) => v != null && p.set(k, String(v)));
  return p.toString();
}

export function ProSimulatorLauncher({
  job = {},
  variant = "hero",
}: {
  job?: SimJob;
  variant?: "hero" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const available = Boolean(WEB_URL);
  const q = toQuery({ ...job, source: job.source ?? "web" });

  function launchWeb() {
    if (!WEB_URL) return;
    window.open(`${WEB_URL}?${q}`, "_blank", "noopener");
  }

  function launchDesktop(os: "win" | "mac" | "linux") {
    // Prefer a signed download if a release base is set; else try the deep link.
    const ext = os === "win" ? "exe" : os === "mac" ? "dmg" : "AppImage";
    if (DESKTOP_BASE) {
      window.location.assign(`${DESKTOP_BASE}/PaintForgeProSim-${os}.${ext}`);
    } else {
      window.open(`paintforge://sim?${q}`, "_self");
    }
  }

  const hero = variant === "hero";

  return (
    <div className={hero ? "relative inline-flex flex-col items-start" : "relative inline-flex"}>
      <div className="inline-flex rounded-xl overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={available ? launchWeb : undefined}
          disabled={!available}
          className={`inline-flex items-center gap-2 font-semibold px-5 py-3 transition-colors ${
            available
              ? "bg-[#FF6B35] text-white hover:bg-[#E85D04]"
              : "bg-[#F1F5F9] text-[#64748B] cursor-not-allowed"
          }`}
        >
          <Rocket className="w-4 h-4" />
          Launch high-fidelity Pro Simulator
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`px-3 border-l ${
            available ? "bg-[#FF6B35] text-white border-white/20 hover:bg-[#E85D04]" : "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]"
          }`}
          aria-label="Launch options"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 z-20 rounded-xl border border-[#E2E8F0] bg-white shadow-xl p-2">
          <button
            type="button"
            onClick={launchWeb}
            disabled={!available}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#F8FAFC] flex items-start gap-3 disabled:opacity-50"
          >
            <Monitor className="w-4 h-4 mt-0.5 text-[#FF6B35]" />
            <span>
              <span className="block font-medium text-[#0A2540] text-sm">Run in browser</span>
              <span className="block text-xs text-[#64748B]">Godot web build · no install</span>
            </span>
          </button>
          <div className="h-px bg-[#F1F5F9] my-1" />
          {(["win", "mac", "linux"] as const).map((os) => (
            <button
              key={os}
              type="button"
              onClick={() => launchDesktop(os)}
              disabled={!DESKTOP_BASE}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#F8FAFC] flex items-start gap-3 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mt-0.5 text-[#FF6B35]" />
              <span className="block font-medium text-[#0A2540] text-sm">
                Desktop · {os === "win" ? "Windows" : os === "mac" ? "macOS" : "Linux"}
              </span>
            </button>
          ))}
        </div>
      )}

      {hero && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#64748B]">
          <Info className="w-3.5 h-3.5" />
          {available
            ? "Full mechanical inspection + realistic task sim. Carries your current job settings."
            : "Pro Simulator is in active development — the web preview above shows what ships first."}
        </p>
      )}
    </div>
  );
}

export default ProSimulatorLauncher;
