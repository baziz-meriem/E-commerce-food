"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatMoney, orderStatusAr } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  deliveryAddress: string;
  deliveryPhone: string;
  user: { name: string; phone: string | null };
  branch: { name: string };
};

export default function DriverPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const list = await apiFetch<Order[]>("/orders/driver/list");
    setOrders(list);
  }

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "DRIVER") {
      router.replace("/");
      return;
    }
    load().catch(() => setOrders([]));
  }, [user, loading, router]);

  async function deliver(id: string) {
    setMsg(null);
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: "PATCH",
        json: { status: "DELIVERED" },
      });
      setMsg("تم تسجيل التسليم وتحصيل الدفع عند الاستلام (حسب الإعدادات).");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "فشل التحديث");
    }
  }

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">طلباتي — التوصيل</h1>
      {msg && <p className="mt-4 text-sm text-emerald-700">{msg}</p>}
      <ul className="mt-8 space-y-4">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-zinc-200 p-4"
          >
            <p className="font-mono text-sm">{o.orderNumber}</p>
            <p className="text-xs text-zinc-500">
              {orderStatusAr[o.status] ?? o.status}
            </p>
            <p className="mt-2 text-sm">
              {o.user.name} — {o.user.phone ?? o.deliveryPhone}
            </p>
            <p className="text-sm text-zinc-600">{o.deliveryAddress}</p>
            <p className="mt-2 font-semibold text-emerald-700">
              {formatMoney(o.total)} — {o.branch.name}
            </p>
            {o.status === "OUT_FOR_DELIVERY" && (
              <button
                type="button"
                className="mt-4 w-full rounded-xl bg-amber-600 py-2 text-white hover:bg-amber-700"
                onClick={() => void deliver(o.id)}
              >
                تم التسليم والتحصيل
              </button>
            )}
          </li>
        ))}
      </ul>
      {orders.length === 0 && (
        <p className="mt-8 text-zinc-600">لا توجد طلبات نشطة حاليًا.</p>
      )}
    </div>
  );
}
