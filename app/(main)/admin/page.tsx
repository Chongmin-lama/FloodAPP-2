"use client";

import ReportsTable from "@/app/components/ReportsTable";
import UsersPanel from "@/app/components/UsersPanel";

import { useEffect, useState } from "react";

export default function AdminPage() {
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

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <UsersPanel />
      <ReportsTable
        reports={reports}
        loading={loading}
        title="All Flood Reports"
        onRefresh={fetchReports}
      />
    </div>
  );
}
