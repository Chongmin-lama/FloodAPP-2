"use client";

import { useEffect, useState } from "react";

export default function AuthorityPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    fetch("/api/report")
      .then((r) => r.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId: number, status: string) => {
    const res = await fetch(`/api/report/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchReports();
    else alert("Failed to update status");
  };

  return (
    <VerificationQueue
      reports={reports}
      loading={loading}
      onStatusChange={handleStatusChange}
    />
  );
}

function VerificationQueue({
  reports,
  loading,
  onStatusChange,
}: {
  reports: any[];
  loading: boolean;
  onStatusChange: (id: number, status: string) => void;
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
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-flood-navy">
          Authority Verification Queue
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="px-5 py-8 text-center text-slate-400">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-500">
            No reports to verify
          </div>
        ) : (
          reports.map((report) => (
            <article
              key={report.id}
              className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-flood-navy">{report.location}</p>
                  <span className="text-xs text-slate-400">— by <span className="font-semibold text-slate-600">{report.name ?? 'Guest'}</span></span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{report.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${
                      severityStyles[report.severity] ?? severityStyles.low
                    }`}
                  >
                    {report.severity}
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                      statusStyles[report.status] ?? statusStyles.pending
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.WaterLevel && (
                    <span className="text-xs font-semibold text-slate-500">
                      {report.WaterLevel}
                    </span>
                  )}
                  {report.District && (
                    <span className="text-xs font-semibold text-slate-500">
                      {report.District}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {report.status === "pending" && (
                  <>
                    <button
                      onClick={() => onStatusChange(report.id, "verified")}
                      className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => onStatusChange(report.id, "rejected")}
                      className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}
                {report.status === "verified" && (
                  <button
                    onClick={() => onStatusChange(report.id, "responding")}
                    className="rounded-md bg-flood-teal px-2.5 py-1.5 text-xs font-semibold bg-black text-white hover:bg-[#0d5557]"
                  >
                    Dispatch
                  </button>
                )}
                {( report.status === "responding") && (
                  <button
                    onClick={() => onStatusChange(report.id, "resolved")}
                    className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
