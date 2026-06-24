"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  CloudRain,
  Droplets,
  LayoutDashboard,
  LogIn,
  LogOut,
  Map,
  RadioTower,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("floodguard_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setMounted(true);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("floodguard_user");
    setMessage("Signed out.");
    router.push("/");
  };

  const getNavItems = () => {
    if (!user) {
      return [
        {
          icon: <LayoutDashboard size={18} />,
          label: "Dashboard",
          href: "/dashboard",
        },
      ];
    }

    const baseItems = [
      {
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
        href: "/dashboard",
      },
    ];

    if (user.role === "citizen") {
      return [
        ...baseItems,
        {
          icon: <ClipboardList size={18} />,
          label: "Report Flood",
          href: "/citizen",
        },
        { icon: <Bell size={18} />, label: "Alerts", href: "/alerts" },
      ];
    }

    if (user.role === "authority") {
      return [
        ...baseItems,
        {
          icon: <RadioTower size={18} />,
          label: "Verify Queue",
          href: "/authority",
        },
        { icon: <Bell size={18} />, label: "Alerts", href: "/alerts" },
      ];
    }

    if (user.role === "admin") {
      return [
        ...baseItems,
        { icon: <Users size={18} />, label: "Users", href: "/admin" },
        { icon: <RadioTower size={18} />, label: "Queue", href: "/authority" },
        { icon: <Bell size={18} />, label: "Alerts", href: "/alerts" },
      ];
    }

    return baseItems;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white px-6 py-6 lg:block shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-blue-900">FloodGuard</p>
              <p className="text-xs text-gray-500">Command Center</p>
            </div>
          </div>

          {user ? (
            <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">
                LOGGED IN AS
              </p>
              <p className="text-sm font-bold text-blue-900 mt-1">
                {user.email}
              </p>
              <span className="inline-block mt-2 bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {user.role.toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-slate-50 p-3 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold">Demo Roles</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1 mb-8">
            {getNavItems().map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-900 shadow-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-4 md:px-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Flood Incident System
                </h1>
                <p className="text-blue-100 text-sm">
                  Real-time reporting & response coordination
                </p>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <>
                    <span className="hidden sm:flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                      <User size={16} /> {user.name}
                    </span>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 text-sm font-semibold text-white transition-all"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
            {message && (
              <div className="px-4 md:px-8 pb-3">
                <p className="text-sm text-blue-100 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                  {message}
                </p>
              </div>
            )}
          </header>

          {/* Content */}
          <div className="flex-1 space-y-6 p-4 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}

function NavLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all"
    >
      {icon}
      {label}
    </Link>
  );
}
