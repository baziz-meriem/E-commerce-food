"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register({ name, email, password, phone: phone || undefined });
      router.push("/");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">إنشاء حساب</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-zinc-600">الاسم</label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600">البريد</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600">الهاتف (اختياري)</label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600">كلمة المرور</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "جاري إنشاء الحساب…" : "تسجيل"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-600">
        لديك حساب؟{" "}
        <Link href="/login" className="text-emerald-700 hover:underline">
          سجّل الدخول
        </Link>
      </p>
    </div>
  );
}
