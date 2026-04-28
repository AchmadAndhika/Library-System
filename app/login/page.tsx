"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: form.email, password: form.password }),
      });
      const json = await res.json();

      if (!res.ok || !json.status) {
        setError(json.message ?? "Invalid email or password.");
        return;
      }

      // Redirect berdasarkan role (cookie sudah di-set dari server)
      if (json.data?.role === "admin") {
        router.push("/");
      } else {
        router.push("/user/explore");
      }
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f6f8] font-[Lexend,sans-serif] text-slate-900 min-h-screen flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-slate-200 px-10 py-4 bg-white">
        <div className="flex items-center gap-4 text-[#1754cf]">
          <div className="w-8 h-8">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  clipRule="evenodd"
                  d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect fill="white" height="48" width="48" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-slate-900 text-xl font-bold">
            The Digital Library
          </h2>
        </div>
        <div className="flex items-center gap-9">
          <a
            className="text-slate-600 text-sm font-medium hover:text-[#1754cf] transition-colors"
            href="#"
          >
            Catalog
          </a>
          <a
            className="text-slate-600 text-sm font-medium hover:text-[#1754cf] transition-colors"
            href="#"
          >
            About
          </a>
          <a
            className="text-slate-600 text-sm font-medium hover:text-[#1754cf] transition-colors"
            href="#"
          >
            Contact
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex flex-col w-full max-w-[480px] bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          {/* Hero image */}
          <div className="w-full bg-[#1754cf]/10 p-1">
            <div
              className="w-full h-48 bg-center bg-no-repeat bg-cover rounded-t-lg"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop")`,
              }}
            />
          </div>

          <div className="px-8 pt-8 pb-4">
            <h1 className="text-slate-900 text-2xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-base">
              Login to access your Digital Library account and manage your
              resources.
            </p>
          </div>

          <div className="flex flex-col gap-5 px-8 pb-10 pt-4">
            {error && (
              <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#1754cf] focus:border-[#1754cf] h-12 pl-10 pr-4 text-base outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-sm font-semibold">
                Password
              </label>
              <div className="flex w-full items-stretch rounded-lg">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full rounded-l-lg border border-slate-300 border-r-0 bg-white focus:ring-2 focus:ring-[#1754cf] h-12 pl-10 pr-4 text-base outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-[#1754cf] flex border border-slate-300 bg-white items-center justify-center px-3 rounded-r-lg border-l-0 cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 7c2.8 0 5 2.2 5 5 0 .6-.1 1.2-.4 1.8l2.9 2.9c1.5-1.3 2.7-3 3.4-4.7-1.7-4.3-6-7.3-10.9-7.3-1.4 0-2.7.2-3.9.7l2.2 2.2c.5-.4 1.1-.6 1.7-.6zM2 4.3L4.3 6.5l.5.5C3.1 8.3 1.8 10.1 1 12c1.7 4.3 6 7.3 10.9 7.3 1.5 0 3-.3 4.3-.8l.4.4 2.9 2.9 1.3-1.3L3.3 3 2 4.3zm5.5 5.5l1.5 1.5c-.1.2-.1.5-.1.7 0 1.7 1.3 3 3 3 .2 0 .5 0 .7-.1l1.5 1.5c-.7.3-1.4.5-2.2.5-2.8 0-5-2.2-5-5 0-.8.2-1.5.6-2.1z" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#1754cf] hover:bg-[#1754cf]/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-[#1754cf]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all mt-2"
            >
              <span>{loading ? "Logging in..." : "Login to Account"}</span>
              {!loading && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="px-10 py-6 text-center">
        <p className="text-slate-400 text-xs">
          © 2026 The Digital Library System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
