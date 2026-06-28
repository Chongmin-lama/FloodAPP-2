"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  RadioTower,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const severityStyles: Record<string, string> = {
  low:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium:   "bg-amber-50 text-amber-700 ring-amber-200",
  high:     "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
};

const statusStyles: Record<string, string> = {
  pending:    "bg-slate-100 text-slate-600",
  verified:   "bg-blue-50 text-blue-700",
  responding: "bg-amber-50 text-amber-700",
  resolved:   "bg-emerald-50 text-emerald-700",
  rejected:   "bg-red-50 text-red-700",
};

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem("user_role") ?? "");
    setName(localStorage.getItem("user_name") ?? "");

    Promise.all([
      fetch("/api/report").then((r) => r.json()),
      fetch("/api/alerts").then((r) => r.json()),
    ]).then(([reportsData, alertsData]) => {
      setReports(Array.isArray(reportsData) ? reportsData : []);
      setAlerts(alertsData.alerts ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => ({
    total:      reports.length,
    open:       reports.filter((r) => r.status !== "resolved" && r.status !== "rejected").length,
    pending:    reports.filter((r) => r.status === "pending").length,
    verified:   reports.filter((r) => r.status === "verified").length,
    responding: reports.filter((r) => r.status === "responding").length,
    critical:   reports.filter((r) => r.severity === "critical").length,
    resolved:   reports.filter((r) => r.status === "resolved").length,
    rejected:   reports.filter((r) => r.status === "rejected").length,
    alerts:     alerts.length,
  }), [reports, alerts]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-flood-navy">
          Welcome back{name ? `, ${name}` : ""}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5 capitalize">
          {role} Dashboard
        </p>
      </div>

      {/* Metrics — different per role */}
      {role === "citizen" && (
        <CitizenMetrics metrics={metrics} />
      )}
      {(role === "authority" || role === "admin") && (
        <AdminAuthorityMetrics metrics={metrics} />
      )}

      {/* Bottom panels */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent reports */}
        <RecentReports reports={reports} role={role} loading={loading} />

        {/* Recent alerts */}
        <RecentAlerts alerts={alerts} loading={loading} />
      </div>

      {/* Quick action links */}
      <QuickActions role={role} />
    </div>
  );
}

// ── Citizen metrics ────────────────────────────────────────────────────────────
function CitizenMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <MetricCard label="My Reports"   value={metrics.total}      icon={<ClipboardList size={20} />} color="text-slate-600"   />
      <MetricCard label="Pending"      value={metrics.pending}    icon={<Activity size={20} />}      color="text-blue-600"   />
      <MetricCard label="Verified"     value={metrics.verified}   icon={<CheckCircle2 size={20} />}  color="text-indigo-600" />
      <MetricCard label="Dispatched"   value={metrics.responding} icon={<RadioTower size={20} />}    color="text-amber-500"  />
      <MetricCard label="Resolved"     value={metrics.resolved}   icon={<CheckCircle2 size={20} />}  color="text-emerald-600"/>
      <MetricCard label="Rejected"     value={metrics.rejected}   icon={<XCircle size={20} />}       color="text-red-500"    />
    </div>
  );
}

// ── Admin/Authority metrics ────────────────────────────────────────────────────
function AdminAuthorityMetrics({ metrics }: { metrics: any }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
      <MetricCard label="Pending"    value={metrics.pending}    icon={<ClipboardList size={20} />} color="text-slate-600"   />
      <MetricCard label="Verified"   value={metrics.verified}   icon={<CheckCircle2 size={20} />}  color="text-indigo-600" />
      <MetricCard label="Dispatched" value={metrics.responding} icon={<RadioTower size={20} />}    color="text-amber-500"  />
      <MetricCard label="Critical"   value={metrics.critical}   icon={<AlertTriangle size={20} />} color="text-red-600"    />
      <MetricCard label="Resolved"   value={metrics.resolved}   icon={<CheckCircle2 size={20} />}  color="text-emerald-600"/>
      <MetricCard label="Rejected"   value={metrics.rejected}   icon={<XCircle size={20} />}       color="text-red-500"    />
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-panel">
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-flood-navy">{value}</p>
    </div>
  );
}

// ── Recent reports ─────────────────────────────────────────────────────────────
function RecentReports({ reports, role, loading }: { reports: any[]; role: string; loading: boolean }) {
  const recent = reports.slice(0, 5);

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-blue-600" />
          <h3 className="font-bold text-flood-navy">
            {role === "citizen" ? "My Recent Reports" : "Recent Reports"}
          </h3>
        </div>
        <Link
          href={role === "citizen" ? "/citizen" : "/authority"}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="px-5 py-8 text-center text-slate-400">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-500">No reports yet</div>
        ) : (
          recent.map((r) => (
            <div key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-flood-navy truncate">{r.location}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.District ?? "—"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${severityStyles[r.severity] ?? severityStyles.low}`}>
                  {r.severity}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${statusStyles[r.status] ?? statusStyles.pending}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ── Recent alerts ──────────────────────────────────────────────────────────────
function RecentAlerts({ alerts, loading }: { alerts: any[]; loading: boolean }) {
  const recent = alerts.slice(0, 5);

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-amber-500" />
          <h3 className="font-bold text-flood-navy">Recent Alerts</h3>
        </div>
        <Link href="/alerts" className="text-xs font-semibold text-blue-600 hover:underline">
          View all →
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="px-5 py-8 text-center text-slate-400">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-500">No alerts yet</div>
        ) : (
          recent.map((alert) => (
            <div key={alert.alertId} className="px-5 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-sm text-flood-navy">{alert.title ?? alert.area}</p>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ring-1 ${severityStyles[alert.severity] ?? severityStyles.low}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{alert.description}</p>
              <p className="text-xs text-slate-400 mt-1">
                {[alert.district, alert.area].filter(Boolean).join(" · ")}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ── Quick actions ──────────────────────────────────────────────────────────────
function QuickActions({ role }: { role: string }) {
  const actions: { label: string; href: string; icon: React.ReactNode; color: string }[] = [];

  if (role === "citizen") {
    actions.push(
      { label: "Submit a Report",  href: "/citizen",   icon: <ClipboardList size={16} />, color: "bg-blue-600 hover:bg-blue-700"    },
      { label: "View Alerts",      href: "/alerts",    icon: <Bell size={16} />,           color: "bg-amber-500 hover:bg-amber-600"  },
    );
  }
  if (role === "authority") {
    actions.push(
      { label: "Verification Queue", href: "/authority", icon: <RadioTower size={16} />,    color: "bg-blue-600 hover:bg-blue-700"    },
      { label: "Publish Alert",      href: "/alerts",    icon: <Bell size={16} />,           color: "bg-amber-500 hover:bg-amber-600"  },
    );
  }
  if (role === "admin") {
    actions.push(
      { label: "Manage Users",       href: "/admin",     icon: <Users size={16} />,          color: "bg-purple-600 hover:bg-purple-700"},
      { label: "Verification Queue", href: "/authority", icon: <RadioTower size={16} />,    color: "bg-blue-600 hover:bg-blue-700"    },
      { label: "Publish Alert",      href: "/alerts",    icon: <Bell size={16} />,           color: "bg-amber-500 hover:bg-amber-600"  },
    );
  }

  if (actions.length === 0) return null;

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <h3 className="font-bold text-flood-navy mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all ${a.color}`}
          >
            {a.icon} {a.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
