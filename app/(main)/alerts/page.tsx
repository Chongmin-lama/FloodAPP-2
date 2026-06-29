"use client";

import AlertForm from "@/app/components/AlertForm";
import AlertsTable from "@/app/components/AlertsTable";
import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [role, setRole] = useState("");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setRole(localStorage.getItem("user_role") ?? "");
    fetchAlerts();
  }, []);

  const canPublish = role === "authority" || role === "admin";
  const canDelete  = role === "authority" || role === "admin";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      {canPublish && (
        <div>
          <AlertForm onSuccess={fetchAlerts} />
        </div>
      )}
      <div className={canPublish ? "" : "xl:col-span-2"}>
        <AlertsTable alerts={alerts} loading={loading} onRefresh={fetchAlerts} canDelete={canDelete} />
      </div>
    </div>
  );
}
