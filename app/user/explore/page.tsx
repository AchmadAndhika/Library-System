"use client";

import { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { BookOpen, Plus, RefreshCw, X } from "lucide-react";

const CATEGORIES = ["All", "Fiction", "Science", "Technology"];

type Book = {
  isbn: string;
  title: string;
  author: string;
  cover: string | null;
  quantity: number;
  category?: string;
};

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function BorrowModal({
  book,
  onClose,
  onConfirm,
}: {
  book: Book;
  onClose: () => void;
  onConfirm: (returnDate: string) => Promise<void>;
}) {
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!returnDate) {
      setError("Please fill in the return date.");
      return;
    }
    if (new Date(returnDate) <= new Date()) {
      setError("Return date must be in the future.");
      return;
    }
    setLoading(true);
    await onConfirm(returnDate);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900">
            Do you want to borrow this book?
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            You must fill the return date field. After you confirm, your
            borrowed book will be added in history.
          </p>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Expected Return Date
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => {
                setReturnDate(e.target.value);
                setError("");
              }}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
          >
            No, Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : "Yes, Borrow"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    setUserName(getCookie("name") || "User");
  }, []);

  const fetchData = async () => {
    try {
      const [booksJson, borrowsJson] = await Promise.all([
        fetch("/api/books").then((r) => r.json()),
        fetch("/api/borrows").then((r) => r.json()),
      ]);
      setBooks(booksJson.data ?? []);
      setBorrows(borrowsJson.data ?? []);
    } catch {
      console.error("Gagal fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeBorrows = borrows.filter((b) => b.status === "Active").length;
  const totalRead = borrows.filter((b) => b.status === "Returned").length;
  const filtered = books.filter(
    (b) => category === "All" || b.category === category
  );

  const handleBorrow = async (returnDate: string) => {
    if (!selectedBook) return;
    try {
      await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: selectedBook.isbn, due_date: returnDate }),
      });
      setSuccessMsg(`"${selectedBook.title}" berhasil dipinjam!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchData();
    } catch {
      console.error("Gagal borrow");
    } finally {
      setSelectedBook(null);
    }
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {successMsg && (
          <div className="fixed top-6 right-6 z-50 bg-green-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg">
            ✓ {successMsg}
          </div>
        )}

        {/* Header — nama dari cookie */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back, {userName}!
            </h1>
            <p className="text-gray-500 mt-1">
              Your reading journey continues. You have{" "}
              <span className="font-bold text-blue-600">{activeBorrows}</span>{" "}
              books due for return within the next week.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 text-center min-w-[90px]">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">
                Borrowed
              </p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">
                {loading ? "…" : activeBorrows}
              </p>
              <p className="text-xs text-blue-500 font-semibold">Due</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 text-center min-w-[90px]">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">
                Total Read
              </p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">
                {loading ? "…" : totalRead}
              </p>
              <p className="text-xs text-green-500 font-semibold">Books</p>
            </div>
          </div>
        </div>

        {/* Catalog */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900">
            Library Catalog
          </h2>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer border ${
                  category === c
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <RefreshCw
                size={32}
                className="mx-auto mb-3 animate-spin opacity-40"
              />
              <p className="font-bold">Loading books...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No books found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 divide-x divide-y divide-gray-50">
              {filtered.map((book) => {
                const available = book.quantity > 0;
                return (
                  <div
                    key={book.isbn}
                    className="p-5 flex flex-col gap-3 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={24} className="text-gray-300" />
                        </div>
                      )}
                      <span
                        className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          available
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {available ? "Available" : "Checked Out"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{book.author}</p>
                      <p className="text-sm font-bold text-gray-900 leading-snug mt-0.5 line-clamp-2">
                        {book.title}
                      </p>
                    </div>
                    <button
                      onClick={() => available && setSelectedBook(book)}
                      disabled={!available}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        available
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 cursor-pointer"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100"
                      }`}
                    >
                      {available ? (
                        <>
                          <Plus size={12} /> Borrow
                        </>
                      ) : (
                        "Join Waitlist"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedBook && (
        <BorrowModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onConfirm={handleBorrow}
        />
      )}
    </UserLayout>
  );
}
