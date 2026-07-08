"use client";

// SSR-safe boundary for the R3F showcase. Server pages import THIS, not
// RobotShowcase directly, because @react-three/fiber's <Canvas> can't render on
// the server. Mirrors how RobotCellShowcase loads RobotCell3D.

import dynamic from "next/dynamic";

const RobotShowcase = dynamic(
  () => import("@/components/RobotShowcase").then((m) => m.RobotShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl border border-[#E2E8F0] bg-[#0A2540] min-h-[420px] lg:min-h-[600px] flex items-center justify-center text-white/40 text-sm">
        Loading digital twin…
      </div>
    ),
  }
);

export default function RobotShowcaseMount() {
  return <RobotShowcase />;
}
