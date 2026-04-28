"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Search, Users, UserCheck, UserX, RefreshCw } from "lucide-react";

type User = {
  id: string;
  role_id: number;
  name: string;
  email: string;
  status: number;
};

const roleLabel: Record<number, string> = { 1: "Admin", 2: "Member" };
const roleStyle: Record<number, string> = {
  1: "bg-purple-100 text-purple-700",
  2: "bg-blue-100 text-blue-700",
};

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      setUsers(json.data ?? []);
    } catch {
      console.error("Gagal fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      filterRole === "All" ||
      (filterRole === "Admin" && u.role_id === 1) ||
      (filterRole === "Member" && u.role_id === 2);
    return matchSearch && matchRole;
  });

  const members = users.filter((u) => u.role_id === 2);
  const admins = users.filter((u) => u.role_id === 1);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Members
            </h1>
            <p className="text-gray-500 mt-1">
              {members.length} registered members
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Users",
              value: users.length,
              icon: <Users size={16} />,
              iconBg: "bg-blue-100 text-blue-600",
            },
            {
              label: "Members",
              value: members.length,
              icon: <UserCheck size={16} />,
              iconBg: "bg-green-100 text-green-600",
            },
            {
              label: "Admins",
              value: admins.length,
              icon: <UserX size={16} />,
              iconBg: "bg-purple-100 text-purple-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
              >
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={14} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Admin", "Member"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  filterRole === role
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <RefreshCw
                size={32}
                className="mx-auto mb-3 animate-spin opacity-40"
              />
              <p className="font-bold">Loading members...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {["User", "Email", "Role", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const initials = user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            roleStyle[user.role_id] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {roleLabel[user.role_id] ?? "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.status === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.status === 0 ? "Active" : "Suspended"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No users found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
