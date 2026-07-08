import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Cross-origin isolation for the Godot web export in /public/pro-sim/.
        // ONLY needed if you export the Pro Simulator *multithreaded*
        // (SharedArrayBuffer). Single-threaded export needs none of this —
        // ship that first, add threads later.
        source: "/pro-sim/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/pro-sim/:path*.(wasm|pck|js|data)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
