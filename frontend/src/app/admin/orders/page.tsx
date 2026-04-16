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
  branch: { name: string };
  user: { name: string; phone: string | null };
  driver: { id: string; name: string } | null;
};

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const list = await apiFetch<Order[]>("/orders/admin/list");
    setOrders(list);
  }

  useEffect(() => {
    if (loading) return;
    if (
      !user ||
      !["ADMIN", "SUPER_ADMIN", "BRANCH_MANAGER"].includes(user.role)
    ) {
      router.replace("/");
      return;
    }
    load().catch((e) => setErr(e instanceof Error ? e.message : "خطأ"));
    apiFetch<{ id: string; name: string }[]>("/users/admin/drivers")
      .then(setDrivers)
      .catch(() => setDrivers([]));
  }, [user, loading, router]);

  async function setStatus(id: string, status: string) {
    await apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      json: { status },
    });
    await load();
  }

  async function assign(id: string, driverId: string) {
    await apiFetch(`/orders/${id}/assign-driver`, {
      method: "PATCH",
      json: { driverId },
    });
    await load();
  }

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">الطلبات</h1>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="p-2">الرقم</th>
              <th className="p-2">العميل</th>
              <th className="p-2">الفرع</th>
              <th className="p-2">الإجمالي</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">تعيين سائق</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-zinc-100"
              >
                <td className="p-2 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-2">{o.user.name}</td>
                <td className="p-2">{o.branch.name}</td>
                <td className="p-2">{formatMoney(o.total)}</td>
                <td className="p-2">
                  <select
                    className="max-w-[140px] rounded border border-zinc-300 bg-white px-1 py-1 text-xs"
                    value={o.status}
                    onChange={(e) => void setStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {orderStatusAr[s] ?? s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="max-w-[120px] rounded border border-zinc-300 bg-white px-1 py-1 text-xs"
                    defaultValue={o.driver?.id ?? ""}
                    onChange={(e) => {
                      if (e.target.value) void assign(o.id, e.target.value);
                    }}
                  >
                    <option value="">—</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
