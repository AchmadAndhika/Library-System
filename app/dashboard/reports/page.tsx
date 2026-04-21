// Server Component — no "use client"

import {
  BookOpen,
  CheckCircle,
  ArrowRightLeft,
  DollarSign,
  Download,
} from "lucide-react";

// ── Dummy Data ─────────────────────────────────────────

const monthlyData = [
  { month: "Jan", borrowed: 320, returned: 295 },
  { month: "Feb", borrowed: 380, returned: 340 },
  { month: "Mar", borrowed: 410, returned: 390 },
  { month: "Apr", borrowed: 360, returned: 350 },
  { month: "May", borrowed: 430, returned: 400 },
  { month: "Jun", borrowed: 390, returned: 370 },
];

const categoryData = [
  { name: "Fiction", count: 4520, pct: 42, color: "#2563eb" },
  { name: "Technology", count: 3110, pct: 30, color: "#60a5fa" },
  { name: "Others", count: 4820, pct: 28, color: "#e5e7eb" },
];

const finesData = [
  {
    name: "Marcus Wright",
    email: "m.wright@university.edu",
    type: "Faculty",
    borrowed: 5,
    fines: 15.5,
  },
  {
    name: "Sarah Kim",
    email: "s.kim@public.org",
    type: "Public",
    borrowed: 0,
    fines: 25.0,
  },
  {
    name: "Priya Sharma",
    email: "p.sharma@university.edu",
    type: "Faculty",
    borrowed: 4,
    fines: 5.0,
  },
];

// ✅ stays perfectly valid
const maxBorrowed = Math.max(...monthlyData.map((d) => d.borrowed));

export default function ReportsPage() {
  // ✅ STILL WORKS — not related to layout at all
  const totalFines = finesData.reduce((s, m) => s + m.fines, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Reports
        </h1>
        <p className="text-gray-500 mt-1">
          Library performance overview and statistics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Books",
            value: "8",
            icon: <BookOpen size={16} />,
            iconBg: "bg-blue-100 text-blue-600",
            change: "in catalog",
          },
          {
            title: "Available",
            value: "6",
            icon: <CheckCircle size={16} />,
            iconBg: "bg-green-100 text-green-600",
            change: "books",
          },
          {
            title: "Lent Out",
            value: "2",
            icon: <ArrowRightLeft size={16} />,
            iconBg: "bg-orange-100 text-orange-500",
            change: "books",
          },
          {
            title: "Total Fines",
            value: `$${totalFines.toFixed(2)}`, // ✅ still works
            icon: <DollarSign size={16} />,
            iconBg: "bg-emerald-100 text-emerald-600",
            change: "outstanding",
          },
        ].map((s) => (
          <div
            key={s.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}
            >
              {s.icon}
            </div>
            <div className="flex-1">
              <span className="text-xs text-gray-500 uppercase">
                {s.title}
              </span>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* You can keep the rest of your charts + table unchanged */}
    </div>
  );
}