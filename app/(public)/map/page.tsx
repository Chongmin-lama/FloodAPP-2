"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";


const NepalMap = dynamic(() => import("@/app/components/NepalMap"), { ssr: false });

const severityColor: Record<string, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#eab308",
  low:      "#3b82f6",
};

export default function MapPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((d) => setAlerts(d.alerts ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Flood Alert Map</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Live alert locations across Nepal — hover a pin for details
              </p>
            </div>

            {/* Legend + filter */}
            <div className="flex flex-wrap items-center gap-2">
              {["all", "critical", "high", "medium", "low"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    filter === s
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {s !== "all" && (
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: severityColor[s] }}
                    />
                  )}
                  {s === "all" ? `All (${alerts.length})` : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-[350px] sm:h-[500px] lg:h-[600px] rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
            Loading map...
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md h-[350px] sm:h-[500px] lg:h-[600px]" style={{ zIndex: 0 }}>
            <NepalMap alerts={filtered} />
          </div>
        )}


        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {["critical", "high", "medium", "low"].map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: severityColor[s] }} />
              <strong className="text-gray-700">{alerts.filter(a => a.severity === s).length}</strong> {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
