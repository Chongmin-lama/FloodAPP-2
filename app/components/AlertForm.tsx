"use client";

import { Field, nepalDistricts, Select } from "@/app/utils";
import { Bell, Check } from "lucide-react";
import { useState } from "react";

interface AlertFormProps {
  onSuccess?: () => void;
}

export default function AlertForm({ onSuccess }: AlertFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const data = {
      area: (form.elements.namedItem("area") as HTMLInputElement)?.value,
      severity: (form.elements.namedItem("severity") as HTMLSelectElement)?.value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)?.value,
      title: (form.elements.namedItem("title") as HTMLTextAreaElement)?.value,
      district: (form.elements.namedItem("district") as HTMLTextAreaElement)?.value,
    };

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to publish alert");
        return;
      }

      setSuccess("Alert published successfully!");
      form.reset();
      onSuccess?.();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="text-lg font-bold text-flood-navy">Issue Official Alert</h2>

      {success && (
        <div className="mt-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
         <Check size={14}/> {success}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <Field label="Title" name="title" placeholder="e.g. Riverside North" required />
         <Select label="District" name="district" options={nepalDistricts} />
        <Field label="Area" name="area" placeholder="e.g. Riverside North" required />
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
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 mt-4 rounded-md px-4 py-2.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"        >
          <Bell size={17} />
          {submitting ? "Publishing..." : "Publish Alert"}
        </button>
      </form>
    </section>
  );
}
