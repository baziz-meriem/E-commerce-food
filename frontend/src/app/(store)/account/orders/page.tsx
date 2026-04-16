"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatMoney, orderStatusAr } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  deliveryFee: string;
  createdAt: string;
  branch: { name: string };
};

function AccountOrdersInner() {
  const { user, loading } = useAuth();
  const sp = useSearchParams();
  const newOrder = sp.get("new");
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") return;
    apiFetch<Order[]>("/orders/my")
      .then(setOrders)
      .catch((e) => setErr(e instanceof Error ? e.message : "خطأ"));
  }, [user]);

  if (loading) return <div className="p-10 text-center">…</div>;
  if (!user || user.role !== "CUSTOMER") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p>سجّل دخولك كعميل لعرض الطلبات.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-700 underline">
          دخول
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">طلباتي</h1>
      {newOrder && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-emerald-900">
          تم إنشاء الطلب بنجاح: {newOrder}
        </p>
      )}
      {err && <p className="mt-4 text-red-600">{err}</p>}
      <ul className="mt-8 space-y-4">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-zinc-200 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm">{o.orderNumber}</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs">
                {orderStatusAr[o.status] ?? o.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">{o.branch.name}</p>
            <p className="mt-2 font-semibold text-emerald-700">
              {formatMoney(o.total)} — توصيل {formatMoney(o.deliveryFee)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {new Date(o.createdAt).toLocaleString("ar-EG")}
            </p>
            <Link
              href={`/orders/${o.id}`}
              className="mt-3 inline-block text-sm text-emerald-700 hover:underline"
            >
              التفاصيل
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">…</div>}>
      <AccountOrdersInner />
    </Suspense>
  );
}
