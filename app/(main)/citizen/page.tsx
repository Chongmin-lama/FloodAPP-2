"use client";

import ReportForm from "@/app/components/ReportForm";
import ReportsTable from "@/app/components/ReportsTable";
import { useEffect, useState } from "react";

export default function CitizenPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshReports = () => {
    setLoading(true);
    fetch("/api/report")
      .then((r) => r.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshReports();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <ReportForm onSuccess={refreshReports} />
      <ReportsTable
        reports={reports}
        loading={loading}
        title="My Report History"
        onRefresh={refreshReports}
      />
    </div>
  );
}
