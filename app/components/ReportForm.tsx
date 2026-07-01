"use client";

import { Field, nepalDistricts, Select } from "@/app/utils";
import { Check, ClipboardListIcon } from "lucide-react";
import { useState } from "react";

interface ReportFormProps {
  onSuccess?: () => void; // optional callback after successful submit
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
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
      district: (form.elements.namedItem("district") as HTMLSelectElement)
        ?.value,
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
    };
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to submit report");
        return;
      }

      setSuccess("Report submitted successfully!");
      form.reset();
      onSuccess?.(); // call parent callback if provided
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="text-lg font-bold text-flood-navy">Submit Flood Report</h2>

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

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select label="District" name="district" options={nepalDistricts} />
          <Field
            label="Location"
            name="location"
            placeholder="e.g. Riverside North"
            required
          />
          <Select
            label="Severity"
            name="severity"
            options={["low", "medium", "high", "critical"]}
          />
          <Field
            label="Water Level"
            name="waterLevel"
            placeholder="e.g. Above knee level"
            required
          />
          <Field
            label="Contact Number"
            name="contactNumber"
            placeholder="e.g. 9800000000"
            required
          />
        </div>

        <div className="mt-4">
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
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center w-full justify-center gap-2 mt-4 rounded-md px-4 py-2.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <ClipboardListIcon size={17} />
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </section>
  );
}
