"use client";

import ConfirmModal from "@/app/components/ConfirmModal";
import { Field, nepalDistricts, Select } from "@/app/utils";
import { Bell, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface Alert {
  alertId: number;
  title: string;
  district: string;
  area: string;
  severity: string;
  description: string;
  status: string;
  created_at: string;
  authorityName: string;
}

interface AlertsTableProps {
  alerts?: Alert[];
  loading?: boolean;
  onRefresh?: () => void;
  canDelete?: boolean;
}

const severityStyles: Record<string, string> = {
  low:      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium:   "bg-amber-50 text-amber-700 ring-amber-200",
  high:     "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
};

export default function AlertsTable({ alerts: alertsProp, loading: loadingProp, onRefresh, canDelete }: AlertsTableProps) {
  const [alerts, setAlerts]           = useState<Alert[]>(alertsProp ?? []);
  const [loading, setLoading]         = useState(loadingProp ?? alertsProp === undefined);
  const [deleteTarget, setDeleteTarget] = useState<Alert | null>(null);
  const [editTarget, setEditTarget]   = useState<Alert | null>(null);
  const [editDistrict, setEditDistrict] = useState("");
  const [editSeverity, setEditSeverity] = useState("");
  const [saving, setSaving]           = useState(false);

  const fetchAlerts = () => {
    setLoading(true);
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (alertsProp === undefined) fetchAlerts(); }, []);
  useEffect(() => {
    if (alertsProp !== undefined) {
      setAlerts(alertsProp);
      setLoading(loadingProp ?? false);
    }
  }, [alertsProp, loadingProp]);

  const refresh = onRefresh ?? fetchAlerts;

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/alerts/${deleteTarget.alertId}`, { method: "DELETE" });
    setDeleteTarget(null);
    refresh();
  };

  const handleToggle = async (alert: Alert) => {
    await fetch(`/api/alerts/${alert.alertId}`, { method: "PATCH" });
    refresh();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    const form = e.currentTarget;
    const data = {
      title:    (form.elements.namedItem("title")    as HTMLInputElement)?.value,
      district: (form.elements.namedItem("district") as HTMLSelectElement)?.value,
      area:     (form.elements.namedItem("area")     as HTMLInputElement)?.value,
      severity: (form.elements.namedItem("severity") as HTMLSelectElement)?.value,
      message:  (form.elements.namedItem("message")  as HTMLTextAreaElement)?.value,
    };
    const res = await fetch(`/api/alerts/${editTarget.alertId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) { setEditTarget(null); refresh(); }
  };

  const colSpan = canDelete ? 8 : 7;

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Alert"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}


      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-flood-navy">Edit Alert</h3>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-slate-600 text-sm">Cancel</button>
            </div>
            <form onSubmit={handleEdit} key={editTarget.alertId} className="px-6 py-5 space-y-4">
              <Field label="Title" name="title" defaultValue={editTarget.title} required />
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  District
                  <select
                    name="district"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {nepalDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <Field label="Area" name="area" defaultValue={editTarget.area} placeholder="e.g. Riverside North" />
              </div>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Severity
                <select
                  name="severity"
                  value={editSeverity}
                  onChange={(e) => setEditSeverity(e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {["low", "medium", "high", "critical"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                Message
                <textarea
                  name="message"
                  rows={4}
                  required
                  defaultValue={editTarget.description}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </label>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setEditTarget(null)}
                  className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">District</th>
                <th className="px-5 py-3">Area</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Issued Date</th>
                {canDelete && <th className="px-5 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={colSpan} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : alerts.length === 0 ? (
                <tr><td colSpan={colSpan} className="px-5 py-8 text-center text-slate-500">No alerts published yet</td></tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.alertId} className={`align-top transition-colors ${alert.status === 'inactive' ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'}`}>
                    <td className="px-5 py-4 font-semibold text-flood-navy">{alert.title ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600 max-w-[200px]">
                      <p className="line-clamp-2 text-xs leading-relaxed">{alert.description ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{alert.district ?? "—"}</td>
                    <td className="px-5 py-4 text-slate-600">{alert.area ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${severityStyles[alert.severity] ?? severityStyles.low}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                        alert.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(alert.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    {canDelete && (
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          <button onClick={() => { setEditTarget(alert); setEditDistrict(alert.district ?? ''); setEditSeverity(alert.severity ?? 'low'); }}
                            className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100">
                            Edit
                          </button>
                          <button onClick={() => handleToggle(alert)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-md ring-1 ${
                              alert.status === 'active'
                                ? 'bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200'
                                : 'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100'
                            }`}>
                            {alert.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => setDeleteTarget(alert)}
                            className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
