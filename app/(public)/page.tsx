"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, AlertTriangle, Shield, User, Bell, PenTool, TrendingUp, Siren, TriangleAlert, CircleAlert, Info } from 'lucide-react';
import Link from 'next/link';

const severityConfig: Record<string, { bg: string; border: string; iconClass: string; Icon: React.ElementType }> = {
  critical: { bg: "bg-red-50",    border: "border-red-200",    iconClass: "text-red-500",    Icon: Siren         },
  high:     { bg: "bg-orange-50", border: "border-orange-200", iconClass: "text-orange-500", Icon: TriangleAlert },
  medium:   { bg: "bg-yellow-50", border: "border-yellow-200", iconClass: "text-yellow-500", Icon: CircleAlert   },
  low:      { bg: "bg-blue-50",   border: "border-blue-200",   iconClass: "text-blue-500",   Icon: Info          },
};

export default function HomePage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, alerts: 0 });
  const reports: any[] = [];

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then((d) => setAlerts(d.alerts ?? []));

    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d));
  }, []);

  return (
    <div className="bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-teal-600 to-blue-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Public Service
              </span>
              <span className="bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Live Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 animate-fadeIn">
              Flood Incident Reporting &amp; Community Response
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Report flood incidents, track emergency responses, and stay informed with real-time alerts — helping communities and authorities act faster during flood events.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-smooth shadow-lg">
                Report a Flood
              </Link>
              <Link href="/public-view" className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-smooth">
                View Active Alerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <Bell className="mx-auto text-blue-600 mb-2" size={20} />
              <p className="text-2xl font-bold text-blue-700">{stats.alerts}</p>
              <p className="text-gray-500 text-sm">Active Alerts</p>
            </div>
            <div className="p-4">
              <MapPin className="mx-auto text-orange-500 mb-2" size={20} />
              <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              <p className="text-gray-500 text-sm">Pending Reports</p>
            </div>
            <div className="p-4">
              <Shield className="mx-auto text-green-600 mb-2" size={20} />
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-gray-500 text-sm">Resolved</p>
            </div>
            <div className="p-4">
              <TrendingUp className="mx-auto text-gray-700 mb-2" size={20} />
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
              <p className="text-gray-500 text-sm">Total Reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Active Flood Alerts</h2>
              <Link href="/public-view" className="text-blue-600 text-sm font-medium hover:underline">View all →</Link>
            </div>

            {alerts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center gap-3 text-gray-400">
                <AlertTriangle size={32} />
                <p className="text-sm">No active alerts at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => {
                  const cfg = severityConfig[alert.severity] ?? severityConfig.low;
                  return (
                    <div key={alert.alertId} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <cfg.Icon size={18} className={cfg.iconClass} />
                          <span className="font-bold text-sm text-gray-900">{alert.title ?? alert.area}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 capitalize font-medium text-gray-600">{alert.severity}</span>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {(alert.district || alert.area) && (
                        <p className="text-xs mt-1 text-gray-500 font-medium">
                          {[alert.district, alert.area].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="text-sm mt-2 text-gray-700 leading-relaxed">{alert.description}</p>
                      <p className="text-xs mt-2 text-gray-400">Issued by: {alert.authorityName}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              {[
                { icon: <User />, title: 'Register & Login', desc: 'Create a free account as a citizen to report flood incidents in your area.' },
                { icon: <PenTool />, title: 'Submit a Report', desc: 'Provide location, severity, and description of the flood situation.' },
                { icon: <Shield />, title: 'Authorities Respond', desc: 'Response teams are dispatched and status updates are shared.' },
                { icon: <Bell />, title: 'Stay Informed', desc: 'View public, real-time alerts and incident updates — no account required.' },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 transition-smooth hover:shadow-sm">
                  <span className="text-2xl flex-shrink-0 text-blue-600">{step.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Access */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-blue-800 font-semibold text-sm mb-2">Quick Access</p>
              <div className="space-y-2">
                <Link href="/login" className="block text-center bg-blue-700 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-800 transition-smooth">
                  Sign In
                </Link>
                <Link href="/register" className="block text-center bg-white text-blue-700 border border-blue-200 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-smooth">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}