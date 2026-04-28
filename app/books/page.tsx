"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  BookOpen,
  RefreshCw,
} from "lucide-react";

type Book = {
  isbn: string;
  title: string;
  cover: string | null;
  author: string;
  quantity: number;
  synopsis: string | null;
};

function BookModal({
  editBook,
  onClose,
  onSaved,
}: {
  editBook: Book | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!editBook;
  const [form, setForm] = useState({
    isbn: editBook?.isbn ?? "",
    title: editBook?.title ?? "",
    cover: editBook?.cover ?? "",
    author: editBook?.author ?? "",
    quantity: editBook?.quantity ?? 1,
    synopsis: editBook?.synopsis ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.isbn.trim() || !form.title.trim() || !form.author.trim()) {
      setError("ISBN, Title, dan Author wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (isEdit) formData.append("old_isbn", editBook!.isbn);
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));

      // POST ke Next.js API route → diteruskan ke Hono
      await fetch("/api/books", { method: "POST", body: formData });
      onSaved();
      onClose();
    } catch {
      setError("Gagal menyimpan. Pastikan backend Hono jalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-gray-900">
            {isEdit ? "Edit Book" : "Add New Book"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              ISBN
            </label>
            <input
              value={form.isbn}
              onChange={(e) => setForm((p) => ({ ...p, isbn: e.target.value }))}
              placeholder="e.g. 9786020332949"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Book title"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Author
              </label>
              <input
                value={form.author}
                onChange={(e) =>
                  setForm((p) => ({ ...p, author: e.target.value }))
                }
                placeholder="Author name"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quantity: Number(e.target.value) }))
                }
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Cover URL
              </label>
              <input
                value={form.cover}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cover: e.target.value }))
                }
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Synopsis
            </label>
            <textarea
              value={form.synopsis}
              onChange={(e) =>
                setForm((p) => ({ ...p, synopsis: e.target.value }))
              }
              placeholder="Short synopsis..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      const json = await res.json();
      setBooks(json.data ?? []);
    } catch {
      console.error("Gagal fetch books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (isbn: string, title: string) => {
    if (!confirm(`Hapus "${title}"?`)) return;
    await fetch(`/api/books/${isbn}`, { method: "DELETE" });
    fetchBooks();
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Books
            </h1>
            <p className="text-gray-500 mt-1">
              {books.length} books in the library catalog
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBooks}
              className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => {
                setEditBook(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 py-3 px-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 cursor-pointer"
            >
              <Plus size={18} /> Add New Book
            </button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={14} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
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
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {["Cover", "Title", "Author", "ISBN", "Stock", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((book) => (
                  <tr
                    key={book.isbn}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center">
                          <BookOpen size={14} className="text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{book.title}</p>
                      {book.synopsis && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                          {book.synopsis}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{book.author}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      {book.isbn}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          book.quantity > 3
                            ? "bg-green-100 text-green-700"
                            : book.quantity > 0
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {book.quantity} left
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditBook(book);
                            setShowModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.isbn, book.title)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No books found</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <BookModal
          editBook={editBook}
          onClose={() => {
            setShowModal(false);
            setEditBook(null);
          }}
          onSaved={fetchBooks}
        />
      )}
    </AdminLayout>
  );
}
