"use client";

// app/books/page.tsx

import { useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type BookStatus = "available" | "lent" | "reserved";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: BookStatus;
  copies: number;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────

const initialBooks: Book[] = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", category: "Fiction", status: "available", copies: 5 },
  { id: 2, title: "Deep Work", author: "Cal Newport", isbn: "9781455586691", category: "Science", status: "lent", copies: 3 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", category: "Technology", status: "available", copies: 4 },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", category: "History", status: "available", copies: 6 },
  { id: 5, title: "Dune", author: "Frank Herbert", isbn: "9780441013593", category: "Fiction", status: "lent", copies: 2 },
  { id: 6, title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", category: "Self-Help", status: "available", copies: 7 },
  { id: 7, title: "1984", author: "George Orwell", isbn: "9780451524935", category: "Fiction", status: "reserved", copies: 4 },
  { id: 8, title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "9780135957059", category: "Technology", status: "available", copies: 3 },
];

const CATEGORIES = ["All", "Fiction", "Technology", "Science", "History", "Self-Help"];

const statusConfig: Record<BookStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-green-100 text-green-700" },
  lent: { label: "Lent Out", className: "bg-orange-100 text-orange-700" },
  reserved: { label: "Reserved", className: "bg-blue-100 text-blue-700" },
};

// ── Add Book Modal ─────────────────────────────────────────────────────────

function AddBookModal({ onClose, onAdd }: { onClose: () => void; onAdd: (b: Omit<Book, "id">) => void }) {
  const [form, setForm] = useState({ title: "", author: "", isbn: "", category: "Fiction", copies: 1 });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.author.trim()) return;
    onAdd({ ...form, status: "available" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-gray-900">Add New Book</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Title", key: "title", placeholder: "Book title" },
            { label: "Author", key: "author", placeholder: "Author name" },
            { label: "ISBN", key: "isbn", placeholder: "e.g. 9780743273565" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
               className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              >
                {["Fiction", "Technology", "Science", "History", "Self-Help"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Copies</label>
              <input
                type="number" min={1}
                value={form.copies}
                onChange={(e) => setForm((p) => ({ ...p, copies: Number(e.target.value) }))}
               className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 transition-all cursor-pointer">
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleAdd = (newBook: Omit<Book, "id">) => {
    setBooks((prev) => [{ id: prev.length + 1, ...newBook }, ...prev]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Books</h1>
            <p className="text-gray-500 mt-1">{books.length} books in the library catalog</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 py-3 px-5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add New Book</span>
          </button>
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
              placeholder="Search by title or author..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Title</th>
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Author</th>
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">ISBN</th>
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Copies</th>
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{book.title}</td>
                  <td className="px-6 py-4 text-gray-500">{book.author}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">{book.isbn}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">{book.copies}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[book.status].className}`}>
                      {statusConfig[book.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No books found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddBookModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </>
  );
}