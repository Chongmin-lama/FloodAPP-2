"use client";

import { Bell, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface Alert {
  alertId: number;
  title: string;
  district: string;
  area: string;
  severity: string;
  description: string;
  created_at: string;
  authorityName: string;
}

interface AlertsTableProps {
  alerts?: Alert[];
  loading?: boolean;
  onRefresh?: () => void;
}

const severityStyles: Record<string, string> = {
  low:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium:   "bg-amber-50 text-amber-700 ring-amber-200",
  high:     "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
};

export default function AlertsTable({ alerts: alertsProp, loading: loadingProp, onRefresh }: AlertsTableProps) {
  const [alerts, setAlerts] = useState<Alert[]>(alertsProp ?? []);
  const [loading, setLoading] = useState(loadingProp ?? alertsProp === undefined);

  const fetchAlerts = () => {
    setLoading(true);
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (alertsProp === undefined) fetchAlerts();
  }, []);

  useEffect(() => {
    if (alertsProp !== undefined) {
      setAlerts(alertsProp);
      setLoading(loadingProp ?? false);
    }
  }, [alertsProp, loadingProp]);

  const refresh = onRefresh ?? fetchAlerts;

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Bell className="text-flood-amber" size={20} />
          <h2 className="text-lg font-bold text-flood-navy">Published Alerts</h2>
        </div>
        <button onClick={refresh} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-flood-navy">
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">District</th>
              <th className="px-5 py-3">Area</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Issued Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading...</td>
              </tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">No alerts published yet</td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.alertId} className="align-top hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-flood-navy">{alert.title ?? "—"}</td>
                  <td className="px-5 py-4 text-slate-600 max-w-[220px]">
                    <p className="line-clamp-2 text-xs leading-relaxed">{alert.description ?? "—"}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{alert.district ?? "—"}</td>
                  <td className="px-5 py-4 text-slate-600">{alert.area ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${severityStyles[alert.severity] ?? severityStyles.low}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(alert.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
