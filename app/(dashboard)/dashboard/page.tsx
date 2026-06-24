"use client";
import { Activity, AlertTriangle, Bell, CheckCircle2, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reportsRes, alertsRes] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/alerts"),
        ]);
        const reportsData = await reportsRes.json();
        const alertsData = await alertsRes.json();
        setReports(reportsData.reports || []);
        setAlerts(alertsData.alerts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const openReports = reports.filter(
      (report) => report.status !== "resolved",
    );
    const criticalReports = reports.filter(
      (report) => report.severity === "critical",
    );
    const resolvedReports = reports.filter(
      (report) => report.status === "resolved",
    );
    return {
      open: openReports.length,
      critical: criticalReports.length,
      resolved: resolvedReports.length,
      alerts: alerts.length,
    };
  }, [reports, alerts]);

  return (
    <>
      <MetricStrip metrics={metrics} />
      <AlertsPanel alerts={alerts} />
    </>
  );
}

function MetricStrip({
  metrics,
}: {
  metrics: { open: number; critical: number; resolved: number; alerts: number };
}) {
  const items = [
    {
      label: "Open incidents",
      value: metrics.open,
      icon: <Activity size={20} />,
      color: "text-flood-blue",
    },
    {
      label: "Critical reports",
      value: metrics.critical,
      icon: <AlertTriangle size={20} />,
      color: "text-flood-red",
    },
    {
      label: "Resolved",
      value: metrics.resolved,
      icon: <CheckCircle2 size={20} />,
      color: "text-flood-green",
    },
    {
      label: "Official alerts",
      value: metrics.alerts,
      icon: <Bell size={20} />,
      color: "text-flood-amber",
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md border border-slate-200 bg-white p-4 shadow-panel"
        >
          <div className={`flex items-center gap-3 ${item.color}`}>
            {item.icon}
            <span className="text-sm font-semibold text-slate-600">
              {item.label}
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-flood-navy">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function IncidentMap({ reports }: { reports: any[] }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-flood-navy">Incident Map</h2>
          <p className="text-sm text-slate-500">Simulated location view.</p>
        </div>
        <Map className="text-flood-teal" size={22} />
      </div>
      <div className="map-grid relative mt-4 h-80 overflow-hidden rounded-md border border-slate-200 bg-[#eaf4f7]">
        <div className="absolute left-[18%] top-[26%] h-4 w-4 rounded-full bg-flood-red ring-8 ring-red-200" />
        <div className="absolute left-[56%] top-[44%] h-4 w-4 rounded-full bg-flood-amber ring-8 ring-amber-200" />
        <div className="absolute left-[72%] top-[65%] h-4 w-4 rounded-full bg-flood-teal ring-8 ring-teal-100" />
        <div className="absolute bottom-4 left-4 rounded-md bg-white/95 p-3 text-sm text-slate-700 shadow">
          <p className="font-semibold text-flood-navy">
            {reports.length} active map points
          </p>
          <p>Red indicates critical verification priority.</p>
        </div>
      </div>
    </section>
  );
}

function AlertsPanel({ alerts }: { alerts: any[] }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-center gap-2">
        <Bell className="text-flood-amber" size={20} />
        <h2 className="text-lg font-bold text-flood-navy">Official Alerts</h2>
      </div>
      <div className="mt-4 space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <article
            key={alert.alertId}
            className="rounded-md border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-flood-navy">{alert.area}</p>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200`}
              >
                {alert.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{alert.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
