"use client";

import { ClipboardListIcon } from "lucide-react";

const mockReports: any[] = [
  {
    reportId: "1",
    location: "Riverside North",
    severity: "high",
    status: "verified",
    waterLevel: "Above knee level",
  },
  {
    reportId: "2",
    location: "Jalan Melati",
    severity: "medium",
    status: "pending",
    waterLevel: "Ankle level",
  },
];

export default function CitizenPage() {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Report submitted!");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <ReportForm onSubmit={handleSubmit} />
      <ReportsTable reports={mockReports} title="My Report History" />
    </div>
  );
}

function ReportForm({ onSubmit }: { onSubmit: (event: any) => void }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="text-lg font-bold text-flood-navy">Submit Flood Report</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4">
        <Field
          label="Location"
          name="location"
          placeholder="e.g. Riverside North, Jalan Melati"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Severity"
            name="severity"
            options={["low", "medium", "high", "critical"]}
          />
          <Field
            label="Water level"
            name="waterLevel"
            placeholder="e.g. Above knee level"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Latitude"
            name="latitude"
            defaultValue="3.1478"
            required
          />
          <Field
            label="Longitude"
            name="longitude"
            defaultValue="101.6953"
            required
          />
        </div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Description
          <textarea
            name="description"
            rows={5}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-flood-teal focus:ring-2 focus:ring-teal-100"
            placeholder="Describe water level, blocked roads, people needing assistance, and visible hazards."
          />
        </label>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-flood-teal px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0d5557]">
          <ClipboardListIcon size={17} /> Submit Report
        </button>
      </form>
    </section>
  );
}

function ReportsTable({ reports, title }: { reports: any[]; title: string }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-flood-navy">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
            <tr>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Water Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  No reports yet
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.reportId} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-flood-navy">
                      {report.location}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${{ low: "bg-emerald-50 text-emerald-700 ring-emerald-200", medium: "bg-amber-50 text-amber-700 ring-amber-200", high: "bg-orange-50 text-orange-700 ring-orange-200", critical: "bg-red-50 text-red-700 ring-red-200" }[report.severity] || "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${{ pending: "bg-slate-100 text-slate-700", verified: "bg-blue-50 text-blue-700", responding: "bg-amber-50 text-amber-700", resolved: "bg-emerald-50 text-emerald-700" }[report.status] || "bg-slate-100 text-slate-700"}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {report.waterLevel}
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

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-flood-teal focus:ring-2 focus:ring-teal-100"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select
        name={name}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-flood-teal focus:ring-2 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
