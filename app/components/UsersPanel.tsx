"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) fetchUsers();
    else alert("Failed to update role");
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) fetchUsers();
    else alert("Failed to delete");
  };

  const handleResetPassword = async (id: number, name: string) => {
    if (!confirm(`Reset "${name}"'s password to "floodwatch"?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH" });
    if (res.ok) alert(`Password reset to "floodwatch" for ${name}`);
    else alert("Failed to reset password");
  };

  const roleBadge: any = {
    admin: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    authority: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    citizen: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-flood-teal" size={20} />
        <h2 className="text-lg font-bold text-flood-navy">User Management</h2>
        <span className="ml-auto text-xs text-slate-400">
          {users.length} users
        </span>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-slate-500 py-8">No users found</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-md border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-flood-navy">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-bold ${roleBadge[user.role]}`}
                >
                  {user.role}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                >
                  <option value="citizen">Citizen</option>
                  <option value="authority">Authority</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => handleResetPassword(user.id, user.name)}
                  className="px-3 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.name)}
                  className="px-3 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
