"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("customer@demo.com");
  const [password, setPassword] = useState("Demo123!");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-emerald-100/80 bg-white p-8 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-900/5">
      <h1 className="text-2xl font-bold text-emerald-950">تسجيل الدخول</h1>
      <p className="mt-2 text-sm text-zinc-600">
        حساب تجريبي: customer@demo.com / Demo123!
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">البريد</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-emerald-200/80 bg-zinc-50/50 px-3 py-2.5 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">كلمة المرور</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-emerald-200/80 bg-zinc-50/50 px-3 py-2.5 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-l from-emerald-600 to-teal-600 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60"
        >
          {loading ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-600">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-emerald-700 hover:underline">
          سجّل الآن
        </Link>
      </p>
      </div>
    </div>
  );
}
