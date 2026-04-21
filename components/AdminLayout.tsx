"use client";

// components/AdminLayout.tsx
// ✅ Sidebar pakai <Link> dari next/link — klik langsung pindah halaman
// ✅ Active state otomatis deteksi dari pathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";

// ── Nav items ──────────────────────────────────────────────────────────────
// Sesuaikan href dengan struktur folder app/ kamu:
//   app/dashboard/page.tsx          → "/"
//   app/dashboard/books/page.tsx    → "/dashboard/books"
//   app/dashboard/members/page.tsx  → "/dashboard/members"
//   app/dashboard/reports/page.tsx  → "/dashboard/reports"

const navItems = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/dashboard/books", label: "Manage Books", icon: <BookOpen size={16} /> },
  { href: "/dashboard/members", label: "Members", icon: <Users size={16} /> },
  { href: "/dashboard/reports", label: "Reports", icon: <BarChart3 size={16} /> },
];

// ── Sidebar ────────────────────────────────────────────────────────────────

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col py-6 flex-shrink-0">
      <div className="text-2xl font-extrabold text-gray-900 px-6 pb-6">
        Lib<span className="text-blue-600">Flow</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────

function AdminHeader() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search size={14} />
        </span>
        <input
          type="text"
          placeholder="Search books, users, or transactions..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-blue-600 transition-colors relative p-2 rounded-full hover:bg-gray-50">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-50">
            <HelpCircle size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Sarah Jenkins</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">
              Head Librarian
            </p>
          </div>
          {/* Kalau mau pakai foto asli ganti baris ini dengan <Image src="/daniel.jpg" .../> */}
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-blue-600 font-bold text-sm">
            SJ
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Layout Wrapper ─────────────────────────────────────────────────────────

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}
