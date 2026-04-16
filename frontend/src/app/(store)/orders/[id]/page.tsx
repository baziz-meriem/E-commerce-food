"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatMoney, orderStatusAr } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  deliveryFee: string;
  loyaltyDiscount: string;
  total: string;
  deliveryAddress: string;
  deliveryPhone: string;
  notes: string;
  codCollected: boolean;
  createdAt: string;
  branch: { name: string };
  items: { nameSnapshot: string; quantity: number; unitPrice: string }[];
  driver: { name: string; phone: string | null } | null;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [o, setO] = useState<OrderDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !id) return;
    apiFetch<OrderDetail>(`/orders/${id}`)
      .then(setO)
      .catch((e) => setErr(e instanceof Error ? e.message : "خطأ"));
  }, [user, id]);

  if (loading) return <div className="p-10 text-center">…</div>;
  if (!user) {
    return (
      <div className="p-10 text-center">
        <Link href="/login" className="text-emerald-700 underline">
          سجّل الدخول
        </Link>
      </div>
    );
  }

  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;
  if (!o) return <div className="p-10 text-center">جاري التحميل…</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/account/orders" className="text-sm text-emerald-700 hover:underline">
        ← طلباتي
      </Link>
      <h1 className="mt-4 text-2xl font-semibold font-mono">{o.orderNumber}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        {orderStatusAr[o.status] ?? o.status}
      </p>
      <div className="mt-6 space-y-2 text-sm">
        <p>
          <span className="text-zinc-500">الفرع:</span> {o.branch.name}
        </p>
        <p>
          <span className="text-zinc-500">العنوان:</span> {o.deliveryAddress}
        </p>
        <p>
          <span className="text-zinc-500">الهاتف:</span> {o.deliveryPhone}
        </p>
        {o.driver && (
          <p>
            <span className="text-zinc-500">السائق:</span> {o.driver.name}{" "}
            {o.driver.phone}
          </p>
        )}
        <p>
          <span className="text-zinc-500">الدفع عند الاستلام:</span>{" "}
          {o.codCollected ? "تم التحصيل" : "لم يُحصَّل بعد"}
        </p>
      </div>
      <ul className="mt-8 divide-y divide-zinc-200">
        {o.items.map((it, i) => (
          <li key={i} className="flex justify-between py-3 text-sm">
            <span>
              {it.nameSnapshot} × {it.quantity}
            </span>
            <span>{formatMoney(Number(it.unitPrice) * it.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>الإجمالي الفرعي</span>
          <span>{formatMoney(o.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>التوصيل</span>
          <span>{formatMoney(o.deliveryFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>خصم النقاط</span>
          <span>-{formatMoney(o.loyaltyDiscount)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-emerald-700">
          <span>الإجمالي</span>
          <span>{formatMoney(o.total)}</span>
        </div>
      </div>
    </div>
  );
}
