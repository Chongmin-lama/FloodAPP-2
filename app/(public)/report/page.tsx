"use client";

import { Field, Select, nepalDistricts } from "@/app/utils";
import { AlertTriangle, CheckCircle2, ClipboardList, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PublicReportPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      district:      (form.elements.namedItem("district")      as HTMLSelectElement)?.value,
      location:      (form.elements.namedItem("location")      as HTMLInputElement)?.value,
      severity:      (form.elements.namedItem("severity")      as HTMLSelectElement)?.value,
      waterLevel:    (form.elements.namedItem("waterLevel")    as HTMLInputElement)?.value,
      contactNumber: (form.elements.namedItem("contactNumber") as HTMLInputElement)?.value,
      description:   (form.elements.namedItem("description")   as HTMLTextAreaElement)?.value,
    };

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { setError(result.error || "Failed to submit report"); return; }
      setSubmitted(true);
      form.reset();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shrink-0">
              <ClipboardList size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report a Flood</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                No account needed — anyone can report a flood incident
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Success state */}
        {submitted ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col items-center text-center gap-3">
              <CheckCircle2 size={48} className="text-green-500" />
              <h2 className="text-xl font-bold text-green-800">Report Submitted!</h2>
              <p className="text-green-700 text-sm max-w-sm">
                Your flood report has been received. Authorities have been notified and will review it shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-sm text-green-600 hover:underline font-medium"
              >
                Submit another report
              </button>
            </div>

            {/* Account prompt */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
                  <UserPlus size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 text-base">Want to track your report?</h3>
                  <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                    Create a free account to see your report's status — whether it's been verified, 
                    has a response team dispatched, or has been resolved.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link
                      href="/register"
                      className="bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-all"
                    >
                      Create Free Account
                    </Link>
                    <Link
                      href="/login"
                      className="bg-white text-blue-700 border border-blue-200 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <AlertTriangle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="District" name="district" options={nepalDistricts} />
                <Select label="Severity" name="severity" options={["low", "medium", "high", "critical"]} />
              </div>

              <Field label="Specific Location" name="location" placeholder="e.g. Near Bagmati River bridge, Ward 5" required />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Water Level" name="waterLevel" placeholder="e.g. Above knee level" required />
                <Field label="Contact Number" name="contactNumber" placeholder="e.g. 9800000000" required />
              </div>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Description
                <textarea
                  name="description"
                  rows={5}
                  required
                  placeholder="Describe the flood situation — water level, blocked roads, people needing assistance, visible hazards..."
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </label>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">
                  Submitting as guest.{" "}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Register
                  </Link>{" "}
                  to track your report.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-60"
                >
                  <ClipboardList size={16} />
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
