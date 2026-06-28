"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        localStorage.setItem("cms_token", token);
        router.push("/admin/dashboard");
      } else {
        setError("Invalid token");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-in min-h-[60vh] flex items-center justify-center px-6">
      <div className="glass p-8 w-full max-w-md">
        <div className="chip chip-gold mb-6">CMS Admin</div>
        <h1 className="font-display font-800 text-2xl mb-2 gradient-gold">Login</h1>
        <p className="text-sm text-[var(--text-dim)] mb-6">
          Enter your admin token to access the content management system.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-2 block">
              Admin Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
              placeholder="Enter token..."
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--red)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 bg-[var(--gold)] text-[#1a1006] font-semibold rounded-xl hover:bg-[var(--gold-bright)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}
