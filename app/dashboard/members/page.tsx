"use client";

// app/members/page.tsx

import { useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Pencil,
  ShieldOff,
  ShieldCheck,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type MemberType = "Student" | "Faculty" | "Public";
type MemberStatus = "active" | "suspended";

interface Member {
  id: number;
  name: string;
  email: string;
  type: MemberType;
  status: MemberStatus;
  joined: string;
  borrowed: number;
  fines: number;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@university.edu",
    type: "Student",
    status: "active",
    joined: "2023-09-01",
    borrowed: 3,
    fines: 0,
  },
  {
    id: 2,
    name: "Alex Rivera",
    email: "alex.r@university.edu",
    type: "Student",
    status: "active",
    joined: "2023-09-01",
    borrowed: 3,
    fines: 0,
  },
  {
    id: 3,
    name: "Marcus Wright",
    email: "m.wright@university.edu",
    type: "Faculty",
    status: "active",
    joined: "2022-08-20",
    borrowed: 5,
    fines: 15.5,
  },
  {
    id: 4,
    name: "Sarah Kim",
    email: "s.kim@public.org",
    type: "Public",
    status: "suspended",
    joined: "2023-03-10",
    borrowed: 0,
    fines: 25.0,
  },
  {
    id: 5,
    name: "Elena Gilbert",
    email: "elena.g@university.edu",
    type: "Student",
    status: "active",
    joined: "2024-01-15",
    borrowed: 1,
    fines: 0,
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "p.sharma@university.edu",
    type: "Faculty",
    status: "active",
    joined: "2021-06-15",
    borrowed: 4,
    fines: 5.0,
  },
];

const typeStyle: Record<MemberType, string> = {
  Student: "bg-blue-100 text-blue-700",
  Faculty: "bg-purple-100 text-purple-700",
  Public: "bg-amber-100 text-amber-700",
};

const TYPES = ["All", "Student", "Faculty", "Public"];

// ── Main Page ──────────────────────────────────────────────────────────────

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || m.type === filterType;
    return matchSearch && matchType;
  });

  const toggleStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "suspended" : "active" }
          : m
      )
    );
  };

  const activeCount = members.filter((m) => m.status === "active").length;
  const suspendedCount = members.filter((m) => m.status === "suspended").length;

  return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Members
            </h1>
            <p className="text-gray-500 mt-1">{activeCount} active members</p>
          </div>
          <button className="flex items-center space-x-2 py-3 px-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer">
            <UserPlus size={18} />
            <span>Add Member</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Members",
              value: members.length,
              icon: <Users size={16} />,
              iconBg: "bg-blue-100 text-blue-600",
            },
            {
              label: "Active",
              value: activeCount,
              icon: <UserCheck size={16} />,
              iconBg: "bg-green-100 text-green-600",
            },
            {
              label: "Suspended",
              value: suspendedCount,
              icon: <UserX size={16} />,
              iconBg: "bg-red-100 text-red-500",
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
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  filterType === type
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {[
                  "Member",
                  "Type",
                  "Joined",
                  "Borrowed",
                  "Fines",
                  "Status",
                  "Actions",
                ].map((h) => (
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
              {filtered.map((member) => {
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          typeStyle[member.type]
                        }`}
                      >
                        {member.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{member.joined}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {member.borrowed}
                    </td>
                    <td className="px-6 py-4">
                      {member.fines > 0 ? (
                        <span className="text-red-600 font-bold">
                          ${member.fines.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          member.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {member.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleStatus(member.id)}
                          title={
                            member.status === "active" ? "Suspend" : "Activate"
                          }
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            member.status === "active"
                              ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {member.status === "active" ? (
                            <ShieldOff size={15} />
                          ) : (
                            <ShieldCheck size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No members found</p>
            </div>
          )}
        </div>
      </div>
  );
}
