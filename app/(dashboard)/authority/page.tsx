"use client";

import { Bell } from "lucide-react";

const mockReports: any[] = [
  {
    reportId: "1",
    location: "Riverside North",
    description: "Severe flooding reported",
    severity: "critical",
    status: "pending",
    waterLevel: "Above knee level",
    assignedTeam: null,
  },
  {
    reportId: "2",
    location: "Downtown Market",
    description: "Water levels rising",
    severity: "high",
    status: "verified",
    waterLevel: "Ankle level",
    assignedTeam: "Relief Team 2",
  },
];

export default function AuthorityPage() {
  const handleVerify = (reportId: string) => {
    alert(`Report ${reportId} verified!`);
  };

  const handleDispatch = (reportId: string) => {
    alert(`Dispatch sent for report ${reportId}!`);
  };

  const handleResolve = (reportId: string) => {
    alert(`Report ${reportId} resolved!`);
  };

  const handleAlert = (e: any) => {
    e.preventDefault();
    alert("Alert published!");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div>
        <ReportsTable
          reports={mockReports}
          onVerify={handleVerify}
          onDispatch={handleDispatch}
          onResolve={handleResolve}
        />
      </div>
      <AlertForm onSubmit={handleAlert} />
    </div>
  );
}

function ReportsTable({
  reports,
  onVerify,
  onDispatch,
  onResolve,
}: {
  reports: any[];
  onVerify: (reportId: string) => void;
  onDispatch: (reportId: string) => void;
  onResolve: (reportId: string) => void;
}) {
  const severityStyles: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    high: "bg-orange-50 text-orange-700 ring-orange-200",
    critical: "bg-red-50 text-red-700 ring-red-200",
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-700",
    verified: "bg-blue-50 text-blue-700",
    responding: "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-flood-navy">
          Authority Verification Queue
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {reports.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-500">
            No reports to verify
          </div>
        ) : (
          reports.map((report) => (
            <article
              key={report.reportId}
              className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <p className="font-semibold text-flood-navy">
                  {report.location}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {report.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${severityStyles[report.severity] || severityStyles.low}`}
                  >
                    {report.severity}
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusStyles[report.status] || statusStyles.pending}`}
                  >
                    {report.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {report.waterLevel}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {report.assignedTeam || "Unassigned"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  onClick={() => onVerify(report.reportId)}
                  className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50"
                >
                  Verify
                </button>
                <button
                  onClick={() => onDispatch(report.reportId)}
                  className="rounded-md bg-flood-teal px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0d5557]"
                >
                  Dispatch
                </button>
                <button
                  onClick={() => onResolve(report.reportId)}
                  className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Resolve
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function AlertForm({ onSubmit }: { onSubmit: (event: any) => void }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="text-lg font-bold text-flood-navy">
        Issue Official Alert
      </h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4">
        <Field
          label="Area"
          name="area"
          placeholder="e.g. Riverside North"
          required
        />
        <Select
          label="Severity"
          name="severity"
          options={["low", "medium", "high", "critical"]}
        />
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Message
          <textarea
            name="message"
            rows={5}
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none focus:border-flood-teal focus:ring-2 focus:ring-teal-100"
            placeholder="Write clear public guidance for the affected area."
          />
        </label>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-flood-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-[#182b44]">
          <Bell size={17} /> Publish Alert
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        placeholder={placeholder}
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
