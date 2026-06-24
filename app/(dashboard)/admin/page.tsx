"use client";

import { Users } from "lucide-react";

const mockUsers: any[] = [
  {
    userId: "1",
    name: "Ali Mubarak",
    email: "citizen@floodwatch.local",
    role: "citizen",
    area: "Riverside North",
  },
  {
    userId: "2",
    name: "Rahman Ahmad",
    email: "authority@floodwatch.local",
    role: "authority",
    area: "City Center",
  },
  {
    userId: "3",
    name: "Fatima Hassan",
    email: "admin@floodwatch.local",
    role: "admin",
    area: "Headquarters",
  },
];

const mockReports: any[] = [
  {
    reportId: "1",
    location: "Riverside North",
    description: "Severe flooding in residential area",
    severity: "critical",
    status: "pending",
    assignedTeam: null,
    waterLevel: "Above knee level",
  },
  {
    reportId: "2",
    location: "Downtown Market",
    description: "Water levels rising near shops",
    severity: "high",
    status: "verified",
    assignedTeam: "Relief Team 2",
    waterLevel: "Ankle level",
  },
];

export default function AdminPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <UsersPanel users={mockUsers} />
      <ReportsTable reports={mockReports} title="All Flood Reports" />
    </div>
  );
}

function UsersPanel({ users }: { users: any[] }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-center gap-2">
        <Users className="text-flood-teal" size={20} />
        <h2 className="text-lg font-bold text-flood-navy">User Management</h2>
      </div>
      <div className="mt-4 space-y-3">
        {users.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No users found</div>
        ) : (
          users.map((user) => (
            <article
              key={user.userId}
              className="rounded-md border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-flood-navy">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                  {user.role}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{user.area || "—"}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function ReportsTable({ reports, title }: { reports: any[]; title: string }) {
  const severityStyles: any = {
    low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    high: "bg-orange-50 text-orange-700 ring-orange-200",
    critical: "bg-red-50 text-red-700 ring-red-200",
  };

  const statusStyles: any = {
    pending: "bg-slate-100 text-slate-700",
    verified: "bg-blue-50 text-blue-700",
    responding: "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-flood-navy">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-normal text-slate-500">
            <tr>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Severity</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Team</th>
              <th className="px-5 py-3">Water Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  No reports
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.reportId} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-flood-navy">
                      {report.location}
                    </p>
                    <p className="mt-1 max-w-xs text-slate-500 text-xs">
                      {report.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ring-1 ${severityStyles[report.severity] || severityStyles.low}`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusStyles[report.status] || statusStyles.pending}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-sm">
                    {report.assignedTeam || "—"}
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
