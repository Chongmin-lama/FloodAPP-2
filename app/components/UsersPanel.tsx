"use client";

import ConfirmModal from "@/app/components/ConfirmModal";
import { CheckCircle2, Users } from "lucide-react";
import { useEffect, useState } from "react";

type ModalState =
  | { type: "delete"; id: number; name: string }
  | { type: "reset";  id: number; name: string }
  | null;

export default function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [resetSuccess, setResetSuccess] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: number, newRole: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  const confirmDelete = async () => {
    if (!modal || modal.type !== "delete") return;
    await fetch(`/api/admin/users/${modal.id}`, { method: "DELETE" });
    setModal(null);
    fetchUsers();
  };

  const confirmReset = async () => {
    if (!modal || modal.type !== "reset") return;
    const name = modal.name;
    await fetch(`/api/admin/users/${modal.id}`, { method: "PATCH" });
    setModal(null);
    setResetSuccess(`Password reset to "FloodGuard" for ${name}`);
    setTimeout(() => setResetSuccess(""), 4000);
  };

  const roleBadge: Record<string, string> = {
    admin:     "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    authority: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    citizen:   "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };

  return (
    <>
      {modal?.type === "delete" && (
        <ConfirmModal
          title="Delete User"
          message={`Delete "${modal.name}"? This will also remove all their reports and cannot be undone.`}
          confirmLabel="Delete User"
          onConfirm={confirmDelete}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "reset" && (
        <ConfirmModal
          title="Reset Password"
          message={`Reset "${modal.name}"'s password to "floodwatch"? They will need to change it after logging in.`}
          confirmLabel="Reset Password"
          confirmClass="bg-amber-500 hover:bg-amber-600 text-white"
          onConfirm={confirmReset}
          onCancel={() => setModal(null)}
        />
      )}

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-flood-teal" size={20} />
          <h2 className="text-lg font-bold text-flood-navy">User Management</h2>
          <span className="ml-auto text-xs text-slate-400">{users.length} users</span>
        </div>

        {resetSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            <CheckCircle2 size={15} className="shrink-0" /> {resetSuccess}
          </div>
        )}

        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No users found</div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <article key={user.id} className="rounded-md border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-flood-navy">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${roleBadge[user.role]}`}>
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
                    onClick={() => setModal({ type: "reset", id: user.id, name: user.name })}
                    className="px-3 py-1 text-xs font-bold rounded-md bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => setModal({ type: "delete", id: user.id, name: user.name })}
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
    </>
  );
}
