"use client";

import React from 'react';
import { Droplets, MapPin, AlertTriangle, Shield, User, Bell, PenTool } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
    let alerts: any[] = []
  let reports: any[] = []

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl"><Droplets className='text-white'/></span>
              <div>
                <span className="text-white font-bold text-lg">FloodGuard</span>
             
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/public-view" className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                View Alerts
              </Link>
              <Link href="/public-view/incidents" className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                Incidents
              </Link>
              <Link href="/login" className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                Sign In
              </Link>
              <Link href="/register" className="bg-white text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Live Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Flood Incident Reporting &amp; Community Response
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Report flood incidents, track emergency responses, and stay informed with real-time alerts — helping communities and authorities act faster during flood events.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg">
                Report a Flood
              </Link>
              <Link href="/public-view" className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
                View Active Alerts
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-700">{alerts.length}</p>
              <p className="text-gray-500 text-sm mt-1">Active Alerts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-500">{reports.filter(r => r.status === 'pending').length}</p>
              <p className="text-gray-500 text-sm mt-1">Pending Reports</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{reports.filter(r => r.status === 'resolved').length}</p>
              <p className="text-gray-500 text-sm mt-1">Resolved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-700">{reports.length}</p>
              <p className="text-gray-500 text-sm mt-1">Total Reports</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Active Flood Alerts</h2>
              <Link href="/public-view" className="text-blue-600 text-sm font-medium hover:underline">View all →</Link>
            </div>

            {alerts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center gap-3 text-gray-400">
                <AlertTriangle/>
                No active alerts at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.alertId} className={`rounded-xl border p-4 ${severityBg[alert.severity] || 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{alert.severity === 'critical' ? '🚨' : alert.severity === 'high' ? '⚠️' : alert.severity === 'medium' ? '🔶' : '🔵'}</span>
                        <span className="font-semibold text-sm">{alert.area}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/60 capitalize font-medium">{alert.severity}</span>
                      </div>
                      <span className="text-xs opacity-70 whitespace-nowrap">test</span>
                    </div>
                    <p className="text-sm mt-2 opacity-90">{alert.message}</p>
                    <p className="text-xs mt-1 opacity-60">Issued by: {alert.authorityName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              {[
                { icon: <User />, title: 'Register & Login', desc: 'Create an account as a citizen to report flood incidents in your area.' },
                { icon: <PenTool />, title: 'Submit a Report', desc: 'Provide location, severity, and description of the flood situation.' },
                { icon: <Shield />, title: 'Authorities Respond', desc: 'Response teams are dispatched and status updates are shared.' },
                { icon: <Bell />, title: 'Stay Informed', desc: 'View real-time alerts and incident updates without needing an account.' },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{step.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-blue-800 font-semibold text-sm mb-2">Quick Access</p>
              <div className="space-y-2">
                <Link href="/login" className="block text-center bg-blue-700 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-800 transition-all">
                  Sign In
                </Link>
                <Link href="/register" className="block text-center bg-white text-blue-700 border border-blue-200 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-all">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl"><Droplets className="text-white" /></span>
            <span className="text-white font-semibold">FloodGuard </span>
          </p>
          <p>Flood Incident Reporting &amp; Community Response Platform</p>
          
        </div>
      </footer>
    </div>
  );
}
