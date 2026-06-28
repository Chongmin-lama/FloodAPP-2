"use client";

import { Droplets } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home",         href: "/"            },
  { label: "View Alerts",  href: "/public-view" },
  { label: "View Map",     href: "/map"         },
  { label: "Report Flood", href: "/report"      },
  { label: "Sign In",      href: "/login"       },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Droplets className="text-white" size={24} />
              <span className="text-white font-bold text-lg">FloodGuard</span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.href === "/login") {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? "bg-white/20 text-white font-semibold"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/register"
                className="ml-2 bg-white text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}

      <footer className="bg-gray-900 text-gray-400 py-8">
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
