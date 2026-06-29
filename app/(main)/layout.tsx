"use client";

import {
  Bell,
  ClipboardList,
  Droplets,
  LayoutDashboard,
  LogOut,
  Menu,
  RadioTower,
  User,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LayoutProps = { children: React.ReactNode };

export default function DashboardLayout({ children }: LayoutProps) {
  const [user, setUser]         = useState<any>(null);
  const [role, setRole]         = useState("");
  const [drawerOpen, setDrawer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("user_role");
    const n = localStorage.getItem("user_name");
    const id = localStorage.getItem("user_id");
    if (r && n) { setRole(r); setUser({ role: r, name: n, id }); }
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    router.push("/");
  };

  const navItems = getNavItems(user, role);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white px-6 py-6 lg:flex lg:flex-col shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg">
              <Droplets size={24} />
            </div>
            <p className="text-lg font-bold text-blue-900">FloodGuard</p>
          </div>

          {user ? (
            <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">LOGGED IN AS</p>
              <p className="text-sm font-bold text-blue-900 mt-1 truncate">{user.name}</p>
              <span className="inline-block mt-2 bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-slate-50 p-3 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold">Guest</p>
            </div>
          )}

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink key={item.label} {...item} />
            ))}
          </nav>

          {user && (
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2 w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </aside>

        {/* ── Mobile drawer overlay — only covers area outside drawer ── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setDrawer(false)}
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            {/* Transparent left 288px so drawer clicks pass through */}
            <div className="absolute inset-y-0 left-0 w-72" onClick={(e) => e.stopPropagation()} />
          </div>
        )}

        {/* ── Mobile drawer ── */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col px-6 py-6 transition-transform duration-300 lg:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <Droplets size={20} />
              </div>
              <p className="text-base font-bold text-blue-900">FloodGuard</p>
            </div>
            <button onClick={() => setDrawer(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          {user && (
            <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">LOGGED IN AS</p>
              <p className="text-sm font-bold text-blue-900 mt-1 truncate">{user.name}</p>
              <span className="inline-block mt-2 bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          )}

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink key={item.label} {...item} onClick={() => setDrawer(false)} />
            ))}
          </nav>

          {user && (
            <button
              onClick={() => { setDrawer(false); logout(); }}
              className="mt-4 flex items-center gap-2 w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>

        {/* ── Main content ── */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-900 shadow-md">
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                  onClick={() => setDrawer(true)}
                  className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  Flood Incident System
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {user && (
                  <>
                    <span className="hidden sm:flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                      <User size={16} /> {user.name}
                    </span>
                    {/* Logout button hidden on mobile — use drawer instead */}
                    <button
                      onClick={logout}
                      className="hidden sm:flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-semibold text-white transition-all"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 space-y-6 p-4 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getNavItems(user: any, role: string) {
  if (!user) return [{ icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/dashboard" }];

  const base = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard",  href: "/dashboard" },
    { icon: <UserCircle size={18} />,      label: "Profile",    href: "/profile"   },
  ];

  if (role === "citizen") return [
    ...base,
    { icon: <ClipboardList size={18} />, label: "Report Flood", href: "/citizen" },
    { icon: <Bell size={18} />,          label: "Alerts",       href: "/alerts"  },
  ];

  if (role === "authority") return [
    ...base,
    { icon: <RadioTower size={18} />, label: "Verify Queue", href: "/authority" },
    { icon: <Bell size={18} />,       label: "Alerts",       href: "/alerts"    },
  ];

  if (role === "admin") return [
    ...base,
    { icon: <Users size={18} />,      label: "Users",  href: "/admin"     },
    { icon: <RadioTower size={18} />, label: "Queue",  href: "/authority" },
    { icon: <Bell size={18} />,       label: "Alerts", href: "/alerts"    },
  ];

  return base;
}

function NavLink({ icon, label, href, onClick }: {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all
        ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
    >
      {icon} {label}
    </Link>
  );
}
