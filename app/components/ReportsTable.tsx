"use client";

import ConfirmModal from "@/app/components/ConfirmModal";
import { nepalDistricts } from "@/app/utils";
import { useState } from "react";

interface ReportsTableProps {
  reports: any[];
  loading: boolean;
  title: string;
  onRefresh: () => void;
}

export default function ReportsTable({
  reports,
  loading,
  title,
  onRefresh,
}: ReportsTableProps) {
  const [editingReport, setEditingReport] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/report/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    if (res.ok) onRefresh();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      location: (form.elements.namedItem("location") as HTMLInputElement)
        ?.value,
      severity: (form.elements.namedItem("severity") as HTMLSelectElement)
        ?.value,
      waterLevel: (form.elements.namedItem("waterLevel") as HTMLInputElement)
        ?.value,
      contactNumber: (
        form.elements.namedItem("contactNumber") as HTMLInputElement
      )?.value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      )?.value,
      district: (form.elements.namedItem("district") as HTMLSelectElement)
        ?.value,
    };

    const res = await fetch(`/api/report/${editingReport.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setEditingReport(null);
      onRefresh();
    } else alert("Failed to update");
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      {deleteTarget && (
        <ConfirmModal
          title="Delete Report"
          message={`Delete the report for "${deleteTarget.location}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-flood-navy">{title}</h2>
      </div>

      {/* Edit Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="font-bold text-lg mb-4">Edit Report</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  District
                </label>
                <select
                  name="district"
                  defaultValue={editingReport.District}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {nepalDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Location
                </label>
                <input
                  name="location"
                  defaultValue={editingReport.location}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Severity
                </label>
                <select
                  name="severity"
                  defaultValue={editingReport.severity}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Water Level
                </label>
                <input
                  name="waterLevel"
                  defaultValue={editingReport.WaterLevel}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Above knee level"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Contact Number
                </label>
                <input
                  name="contactNumber"
                  defaultValue={editingReport.ContactNumber}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 9800000000"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingReport.description}
                  rows={3}
                  className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
            <tr>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">District</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Water Level</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  No reports yet
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="align-top">
                  <td className="px-5 py-4 font-semibold text-flood-navy">
                    {report.location}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {report.District || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${
                        {
                          low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
                          medium: "bg-amber-50 text-amber-700 ring-amber-200",
                          high: "bg-orange-50 text-orange-700 ring-orange-200",
                          critical: "bg-red-50 text-red-700 ring-red-200",
                        }[report.severity] ||
                        "bg-slate-50 text-slate-700 ring-slate-200"
                      }`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                        {
                          pending: "bg-slate-100 text-slate-700",
                          approved: "bg-blue-50 text-blue-700",
                          rejected: "bg-red-50 text-red-700",
                        }[report.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {report.WaterLevel || "—"}
                  </td>
                  <td className="px-5 py-4">
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingReport(report)}
                          className="px-3 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(report)}
                          className="px-3 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
