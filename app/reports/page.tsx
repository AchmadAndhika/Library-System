"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  BookOpen,
  CheckCircle,
  ArrowRightLeft,
  Clock,
  RefreshCw,
  Download,
  Search,
} from "lucide-react";

type Book = {
  isbn: string;
  title: string;
  cover: string | null;
  author: string;
  quantity: number;
};
type Borrow = {
  id: number;
  member_name: string;
  title: string;
  author: string;
  cover: string | null;
  borrow_date: string;
  due_date: string;
  returned_date: string | null;
  status: string;
  user_id: string;
};

function getStatusStyle(status: string, dueDate: string) {
  const isOverdue = status === "Active" && new Date() > new Date(dueDate);
  if (isOverdue)
    return { label: "Overdue", className: "bg-red-100 text-red-600" };
  if (status === "Active")
    return { label: "Active", className: "bg-blue-100 text-blue-700" };
  return { label: "Returned", className: "bg-green-100 text-green-700" };
}

export default function ReportsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [booksRes, borrowsRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/borrows"),
      ]);
      const booksJson = await booksRes.json();
      const borrowsJson = await borrowsRes.json();
      setBooks(booksJson.data ?? []);
      setBorrows(borrowsJson.data ?? []);
    } catch {
      console.error("Gagal fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const activeBorrows = borrows.filter((b) => b.status === "Active");
  const returnedBorrows = borrows.filter((b) => b.status === "Returned");
  const overdueBorrows = borrows.filter(
    (b) => b.status === "Active" && new Date() > new Date(b.due_date)
  );

  // Bar chart per bulan
  const monthCounts: Record<string, { borrowed: number; returned: number }> =
    {};
  borrows.forEach((b) => {
    const month = new Date(b.borrow_date).toLocaleString("default", {
      month: "short",
    });
    if (!monthCounts[month]) monthCounts[month] = { borrowed: 0, returned: 0 };
    monthCounts[month].borrowed++;
    if (b.status === "Returned") monthCounts[month].returned++;
  });
  const monthlyData = Object.entries(monthCounts).slice(-6);
  const maxVal = Math.max(...monthlyData.map(([, v]) => v.borrowed), 1);

  const filteredBorrows = borrows.filter(
    (b) =>
      b.member_name.toLowerCase().includes(search.toLowerCase()) ||
      b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Reports
            </h1>
            <p className="text-gray-500 mt-1">
              Library performance overview and statistics
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Books",
              value: books.length,
              icon: <BookOpen size={16} />,
              iconBg: "bg-blue-100 text-blue-600",
              sub: "in catalog",
            },
            {
              title: "Active Borrows",
              value: activeBorrows.length,
              icon: <ArrowRightLeft size={16} />,
              iconBg: "bg-orange-100 text-orange-500",
              sub: "ongoing",
            },
            {
              title: "Returned",
              value: returnedBorrows.length,
              icon: <CheckCircle size={16} />,
              iconBg: "bg-green-100 text-green-600",
              sub: "confirmed",
            },
            {
              title: "Overdue",
              value: overdueBorrows.length,
              icon: <Clock size={16} />,
              iconBg: "bg-red-100 text-red-500",
              sub: "need action",
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
                    {s.sub}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {loading ? "..." : s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-lg">
                Borrow Activity by Month
              </h3>
              <div className="flex items-center gap-5 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                  Borrowed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
                  Returned
                </span>
              </div>
            </div>
            {monthlyData.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
                No data yet
              </div>
            ) : (
              <div className="flex items-end justify-between gap-3 h-52">
                {monthlyData.map(([month, data]) => (
                  <div
                    key={month}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full flex items-end justify-center gap-1 flex-1">
                      <div
                        className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors"
                        style={{ height: `${(data.borrowed / maxVal) * 100}%` }}
                        title={`Borrowed: ${data.borrowed}`}
                      />
                      <div
                        className="w-full bg-gray-200 rounded-t-lg hover:bg-gray-300 transition-colors"
                        style={{ height: `${(data.returned / maxVal) * 100}%` }}
                        title={`Returned: ${data.returned}`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">
                      {month}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Book Stock */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Book Stock</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {books.map((book) => (
                <div key={book.isbn} className="flex items-center gap-3">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-8 h-11 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-11 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
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
              ))}
            </div>
          </div>
        </div>

        {/* Borrow History Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-gray-900 text-lg">Borrow History</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search member or book..."
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                />
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                <Download size={15} /> Export
              </button>
            </div>
          </div>
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw
                size={28}
                className="mx-auto mb-2 animate-spin opacity-40"
              />
              <p className="text-sm font-medium">Loading data...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/30">
                  {[
                    "Member",
                    "Book",
                    "Borrow Date",
                    "Due Date",
                    "Returned",
                    "Status",
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
                {filteredBorrows.map((borrow) => {
                  const s = getStatusStyle(borrow.status, borrow.due_date);
                  return (
                    <tr
                      key={borrow.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          {borrow.member_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {borrow.user_id}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {borrow.cover && (
                            <img
                              src={borrow.cover}
                              alt={borrow.title}
                              className="w-7 h-10 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 text-xs">
                              {borrow.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {borrow.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(borrow.borrow_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(borrow.due_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {borrow.returned_date
                          ? new Date(borrow.returned_date).toLocaleDateString(
                              "id-ID"
                            )
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.className}`}
                        >
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filteredBorrows.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <ArrowRightLeft size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No borrow records found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
