"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  BookOpen,
  Users,
  ArrowRightLeft,
  DollarSign,
  Clock,
  Plus,
  AlertCircle,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/books").then((r) => r.json()),
      fetch("/api/borrows").then((r) => r.json()),
    ])
      .then(([booksJson, borrowsJson]) => {
        setBooks(booksJson.data ?? []);
        setBorrows(borrowsJson.data ?? []);
      })
      .catch(() => {
        console.error("Gagal fetch — pastikan backend Hono jalan di port 3000");
      })
      .finally(() => setLoading(false));
  }, []);

  const activeBorrows = borrows.filter((b) => b.status === "Active").length;
  const recentActivities = [...borrows].reverse().slice(0, 4);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Sarah. Here&apos;s what&apos;s happening today in
            LibFlow.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Books",
              value: loading ? "..." : books.length,
              change: "in catalog",
              icon: <BookOpen size={16} />,
              iconBg: "bg-blue-100 text-blue-600",
            },
            {
              title: "Active Members",
              value: "—",
              change: "registered",
              icon: <Users size={16} />,
              iconBg: "bg-purple-100 text-purple-600",
            },
            {
              title: "Books Lent Out",
              value: loading ? "..." : activeBorrows,
              change: "active",
              icon: <ArrowRightLeft size={16} />,
              iconBg: "bg-orange-100 text-orange-500",
            },
            {
              title: "Total Borrows",
              value: loading ? "..." : borrows.length,
              change: "all time",
              icon: <DollarSign size={16} />,
              iconBg: "bg-emerald-100 text-emerald-600",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
              >
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {s.title}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {s.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span className="text-blue-600">
                  <Clock size={16} />
                </span>
                Recent Borrow Activities
              </h3>
              <a
                href="/reports"
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                View All
              </a>
            </div>
            <div className="p-2">
              {loading ? (
                <p className="text-center text-gray-400 py-8 text-sm">
                  Loading...
                </p>
              ) : recentActivities.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No recent activities
                </p>
              ) : (
                recentActivities.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${
                          item.status === "Returned"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.status === "Returned" ? (
                          <AlertCircle size={16} />
                        ) : (
                          <ArrowRightLeft size={16} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.status === "Returned"
                            ? "Book Returned"
                            : "Book Borrowed"}
                        </h4>
                        <p className="text-sm text-gray-500 italic">
                          &ldquo;{item.title}&rdquo; by {item.member_name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {new Date(item.borrow_date).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions + Book Stock */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/books"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  <Plus size={18} /> Add New Book
                </a>
                <a
                  href="/members"
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                >
                  <Users size={18} /> Manage Members
                </a>
                <a
                  href="/reports"
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                >
                  <BarChart3 size={18} /> View Reports
                </a>
              </div>
            </div>

            {/* Book stock */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                Book Stock
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-xs text-gray-400">Loading...</p>
                ) : (
                  books.slice(0, 5).map((book) => (
                    <div key={book.isbn} className="flex items-center gap-3">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-8 h-10 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen size={12} className="text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {book.author}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          book.quantity > 3
                            ? "bg-green-100 text-green-700"
                            : book.quantity > 0
                            ? "bg-orange-100 text-orange-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {book.quantity}
                      </span>
                    </div>
                  ))
                )}
                {books.length > 5 && (
                  <a
                    href="/books"
                    className="block text-center text-xs text-blue-600 font-bold hover:underline mt-1"
                  >
                    View all {books.length} books →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
