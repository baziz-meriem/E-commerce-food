"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

type Summary = {
  orderCount: number;
  revenue: number;
  byStatus: { status: string; count: number }[];
};

export default function AdminHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (
      !user ||
      !["ADMIN", "SUPER_ADMIN", "BRANCH_MANAGER"].includes(user.role)
    ) {
      router.replace("/");
      return;
    }
    apiFetch<Summary>("/reports/summary")
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : "خطأ"));
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">نظرة عامة (30 يومًا)</h1>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      {data && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-6">
            <p className="text-sm text-zinc-500">عدد الطلبات</p>
            <p className="mt-2 text-3xl font-semibold">{data.orderCount}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6">
            <p className="text-sm text-zinc-500">إجمالي المبيعات (تقديري)</p>
            <p className="mt-2 text-3xl font-semibold">
              {data.revenue.toFixed(2)} ج.م
            </p>
          </div>
        </div>
      )}
      {data && (
        <div className="mt-8">
          <h2 className="text-lg font-medium">حسب الحالة</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {data.byStatus.map((s) => (
              <li key={s.status}>
                {s.status}: {s.count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
