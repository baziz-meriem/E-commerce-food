"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

type LoyaltyMe = {
  balance: number;
  settings: {
    minRedeemPoints: number;
    redeemPointsPerUnit: string;
    pointsPerCurrencyUnit: string;
  };
};

type Tx = {
  id: string;
  type: string;
  points: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
};

export default function LoyaltyPage() {
  const { user, loading } = useAuth();
  const [me, setMe] = useState<LoyaltyMe | null>(null);
  const [history, setHistory] = useState<Tx[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") return;
    Promise.all([
      apiFetch<LoyaltyMe>("/loyalty/me"),
      apiFetch<Tx[]>("/loyalty/history"),
    ])
      .then(([m, h]) => {
        setMe(m);
        setHistory(h);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "خطأ"));
  }, [user]);

  if (loading) return <div className="p-10 text-center">…</div>;
  if (!user || user.role !== "CUSTOMER") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p>صفحة النقاط متاحة للعملاء فقط.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-700 underline">
          دخول
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/account/orders"
        className="text-sm text-emerald-700 hover:underline"
      >
        ← طلباتي
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-emerald-950">النقاط والولاء</h1>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      {me && (
        <div className="mt-8 rounded-2xl border border-emerald-200/80 bg-gradient-to-l from-emerald-50 to-teal-50 p-6 shadow-inner">
          <p className="text-sm text-emerald-800">رصيدك الحالي</p>
          <p className="mt-2 text-4xl font-extrabold text-emerald-900">
            {me.balance}{" "}
            <span className="text-lg font-semibold text-emerald-700">نقطة</span>
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            الحد الأدنى للاستبدال عند الطلب: {me.settings.minRedeemPoints} نقطة
            — كل {me.settings.redeemPointsPerUnit} نقطة ≈ ١ ج.م خصم (حسب
            الإعدادات).
          </p>
        </div>
      )}
      <h2 className="mt-10 text-lg font-semibold text-emerald-950">
        سجل الحركات
      </h2>
      <ul className="mt-4 space-y-3">
        {history.map((t) => (
          <li
            key={t.id}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm"
          >
            <div className="flex justify-between gap-2">
              <span className="text-zinc-700">{t.description || t.type}</span>
              <span className="font-mono text-emerald-800">
                {t.type === "REDEEM" ? "-" : "+"}
                {t.points}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              الرصيد بعد العملية: {t.balanceAfter} —{" "}
              {new Date(t.createdAt).toLocaleString("ar-EG")}
            </p>
          </li>
        ))}
      </ul>
      {history.length === 0 && !err && (
        <p className="mt-4 text-zinc-500">لا توجد حركات بعد.</p>
      )}
    </div>
  );
}
