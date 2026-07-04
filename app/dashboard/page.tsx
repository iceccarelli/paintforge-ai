import { Bot, Gauge, ClipboardList, Thermometer } from "lucide-react";

export const metadata = {
  title: "Product Preview | PaintForge",
  description:
    "A simulated preview of the InteriorFinish OS fleet dashboard PaintForge is building. All data shown is illustrative.",
};

const robots = [
  { id: "PF-01", status: "Painting", job: "Demo Tower — Level 12", coverage: "68%" },
  { id: "PF-02", status: "Idle", job: "—", coverage: "—" },
  { id: "PF-03", status: "Maintenance", job: "—", coverage: "—" },
];

const jobs = [
  { name: "Demo Tower — Level 12", sqft: "8,400", coats: "3", progress: 68 },
  { name: "Demo Tower — Level 13", sqft: "8,400", coats: "3", progress: 0 },
  { name: "Sample Townhome Block B", sqft: "22,000", coats: "2", progress: 100 },
];

export default function DashboardPreview() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFF7ED] border border-[#FF6B35] text-[#FF6B35] text-xs tracking-[2px] font-semibold mb-4">
          PRODUCT PREVIEW — SIMULATED DATA
        </div>
        <h1 className="section-heading">InteriorFinish OS</h1>
        <p className="mt-3 text-lg text-[#475569] max-w-2xl">
          This is a design preview of the fleet dashboard we are building. Every
          number on this page is illustrative sample data — no robots are
          deployed yet. Pilot partners will shape what ships.
        </p>
      </div>

      {/* Fleet status */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-[#FF6B35]" />
          <h2 className="font-semibold text-xl tracking-tight">Fleet Status</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {robots.map((r) => (
            <div key={r.id} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono font-semibold text-lg">{r.id}</div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    r.status === "Painting"
                      ? "bg-[#ECFDF5] text-[#059669]"
                      : r.status === "Idle"
                        ? "bg-[#F1F5F9] text-[#475569]"
                        : "bg-[#FEF2F2] text-[#DC2626]"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="text-sm text-[#475569]">Job: {r.job}</div>
              <div className="text-sm text-[#475569]">
                Coverage today: {r.coverage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-[#FF6B35]" />
          <h2 className="font-semibold text-xl tracking-tight">Jobs</h2>
        </div>
        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j.name}
              className="card p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="font-semibold tracking-tight">{j.name}</div>
                <div className="text-sm text-[#64748B]">
                  {j.sqft} sqft · {j.coats} coats
                </div>
              </div>
              <div className="w-full md:w-64">
                <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B35]"
                    style={{ width: `${j.progress}%` }}
                  />
                </div>
                <div className="text-xs text-[#64748B] mt-1 text-right">
                  {j.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry concept */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-5 h-5 text-[#FF6B35]" />
            <div className="font-semibold tracking-tight">
              Live Spray Telemetry (concept)
            </div>
          </div>
          <ul className="text-sm text-[#475569] space-y-2">
            <li>Pump pressure · flow rate · gun state</li>
            <li>Measured mil thickness vs. spec, per pass</li>
            <li>Coverage heatmap updated in real time</li>
          </ul>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-5 h-5 text-[#FF6B35]" />
            <div className="font-semibold tracking-tight">
              Environment Logging (concept)
            </div>
          </div>
          <ul className="text-sm text-[#475569] space-y-2">
            <li>Temperature and humidity per zone</li>
            <li>Dry-time gating between coats</li>
            <li>Exportable compliance report per job</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
