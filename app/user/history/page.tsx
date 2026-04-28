"use client";

import { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { BookOpen, RefreshCw } from "lucide-react";

const PAGE_SIZE = 5;

export default function BorrowedHistoryPage() {
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/borrows")
      .then((r) => r.json())
      .then((json) => setBorrows(json.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (b: any) => {
    if (b.status === "Returned") return "Returned";
    if (b.due_date && new Date(b.due_date) < new Date()) return "Overdue";
    return "Active";
  };

  const filtered = borrows.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.member_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "—";

  const statusStyle = {
    Returned: "bg-green-100 text-green-700",
    Active: "bg-blue-100 text-blue-700",
    Overdue: "bg-red-100 text-red-600",
  } as Record<string, string>;

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Borrowed History
          </h1>
          <p className="text-gray-500 mt-1">
            Track your reading journey and manage your book loans.
          </p>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <RefreshCw
                size={32}
                className="mx-auto mb-3 animate-spin opacity-40"
              />
              <p className="font-bold">Loading...</p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {[
                      "Book Title",
                      "Date Borrowed",
                      "Due / Returned Date",
                      "Status",
                      "Action",
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
                  {paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-20 text-center text-gray-400"
                      >
                        <BookOpen
                          size={48}
                          className="mx-auto mb-3 opacity-30"
                        />
                        <p className="font-bold">No records found</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((item, i) => {
                      const status = getStatus(item);
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          {/* Book title */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-11 bg-gray-100 rounded flex-shrink-0 overflow-hidden shadow-sm">
                                {item.cover && (
                                  <img
                                    src={item.cover}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-blue-600">
                                  {item.title ?? "—"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {item.author ?? item.member_name ?? ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Borrow date */}
                          <td className="px-6 py-4 text-gray-500">
                            {fmtDate(item.borrow_date)}
                          </td>

                          {/* Due / return date */}
                          <td
                            className={`px-6 py-4 font-${
                              status === "Overdue" ? "bold" : "normal"
                            } ${
                              status === "Overdue"
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {fmtDate(item.return_date ?? item.due_date)}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[status]}`}
                            >
                              {status}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            {status === "Returned" && (
                              <button className="text-blue-600 font-bold text-sm hover:underline cursor-pointer">
                                View Details
                              </button>
                            )}
                            {status === "Active" && (
                              <button className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 rounded-lg transition-all cursor-pointer">
                                Renew
                              </button>
                            )}
                            {status === "Overdue" && (
                              <button className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 hover:border-red-600 rounded-lg transition-all cursor-pointer">
                                Pay Fine
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Showing{" "}
                  {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} items
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => i + 1
                  ).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold cursor-pointer transition-all ${
                        page === n
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <>
                      <span className="w-8 h-8 flex items-center justify-center text-gray-400">
                        …
                      </span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold cursor-pointer ${
                          page === totalPages
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
