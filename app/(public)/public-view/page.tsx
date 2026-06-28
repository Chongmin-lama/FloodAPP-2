"use client";

import { AlertTriangle, Bell, CircleAlert, Info, Siren, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const severityConfig: Record<string, { bg: string; border: string; badge: string; iconClass: string; Icon: React.ElementType }> = {
  critical: { bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-700",          iconClass: "text-red-500",    Icon: Siren         },
  high:     { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700",    iconClass: "text-orange-500", Icon: TriangleAlert  },
  medium:   { bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700",    iconClass: "text-yellow-500", Icon: CircleAlert    },
  low:      { bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700",        iconClass: "text-blue-500",   Icon: Info           },
};

export default function PublicViewPage() {
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
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Bell size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Official Flood Alerts</h1>
              <p className="text-sm text-gray-500">Issued by local authorities — updated live</p>
            </div>
          </div>

          {/* quick stats */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
            <span><strong className="text-gray-900">{alerts.length}</strong> total alerts</span>
            <span><strong className="text-red-600">{alerts.filter(a => a.severity === "critical").length}</strong> critical</span>
            <span><strong className="text-orange-600">{alerts.filter(a => a.severity === "high").length}</strong> high</span>
            <span><strong className="text-yellow-600">{alerts.filter(a => a.severity === "medium").length}</strong> medium</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "critical", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                filter === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {s === "all" ? `All (${alerts.length})` : s}
            </button>
          ))}
        </div>

        {/* Alerts grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <AlertTriangle size={40} className="text-gray-300" />
            <p className="font-semibold text-gray-500">No {filter !== "all" ? filter : ""} alerts right now</p>
            <p className="text-sm">Check back later for updates.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((alert) => {
              const cfg = severityConfig[alert.severity] ?? severityConfig.low;
              return (
                <div key={alert.alertId} className={`rounded-xl border ${cfg.bg} ${cfg.border} p-5 flex flex-col gap-2`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <cfg.Icon size={18} className={cfg.iconClass} />
                      <p className="font-bold text-gray-900 text-sm">{alert.title ?? alert.area}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                      {alert.severity}
                    </span>
                  </div>
                  {(alert.district || alert.area) && (
                    <p className="text-xs text-gray-500 font-medium">
                      {[alert.district, alert.area].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">{alert.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs text-gray-400">
                    <span>By {alert.authorityName ?? "Authority"}</span>
                    <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold mb-1">Spotted a flood in your area?</h3>
            <p className="text-blue-200 text-sm">Register and submit a report — help your community get faster response.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/register" className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm">
              Register &amp; Report
            </Link>
            <Link href="/login" className="border border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all text-sm">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
