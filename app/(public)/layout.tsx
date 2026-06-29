"use client";

import { Droplets, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Home",         href: "/"            },
  { label: "View Alerts",  href: "/public-view" },
  { label: "View Map",     href: "/map"         },
  { label: "Report Flood", href: "/report"      },
  { label: "Sign In",      href: "/login"       },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawer] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Navbar ── */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Droplets className="text-white" size={24} />
              <span className="text-white font-bold text-lg">FloodGuard</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.href === "/login") {
                  return (
                    <Link key={link.href} href={link.href}
                      className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <Link key={link.href} href={link.href}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                      isActive ? "bg-white/20 text-white font-semibold" : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
              <Link href="/register"
                className="ml-2 bg-white text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all">
                Register
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawer(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer overlay — only covers area outside drawer ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setDrawer(false)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {/* Transparent right 256px so drawer clicks pass through */}
          <div className="absolute inset-y-0 right-0 w-64" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-2xl flex flex-col px-5 py-6 transition-transform duration-300 md:hidden ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Droplets size={20} className="text-blue-700" />
            <span className="text-blue-900 font-bold">FloodGuard</span>
          </div>
          <button onClick={() => setDrawer(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawer(false)}
                className={`flex w-full items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/register"
          onClick={() => setDrawer(false)}
          className="mt-4 block text-center bg-blue-700 text-white text-sm font-bold px-4 py-3 rounded-xl hover:bg-blue-800 transition-all"
        >
          Register
        </Link>
      </div>

      <div className="flex-1">{children}</div>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p className="flex items-center justify-center gap-2 mb-2">
            <Droplets className="text-white" size={18} />
            <span className="text-white font-semibold">FloodGuard</span>
          </p>
          <p>Flood Incident Reporting &amp; Community Response Platform</p>
        </div>
      </footer>
    </div>
  );
}
