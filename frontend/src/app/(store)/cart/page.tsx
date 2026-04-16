"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    nameAr: string;
    price: string;
    branch: { name: string };
  };
};

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const data = await apiFetch<CartItem[]>("/cart");
      setItems(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر تحميل السلة");
    }
  }

  useEffect(() => {
    if (!loading && (!user || user.role !== "CUSTOMER")) return;
    if (user?.role === "CUSTOMER") void load();
  }, [user, loading]);

  async function updateQty(id: string, quantity: number) {
    await apiFetch(`/cart/items/${id}`, {
      method: "PATCH",
      json: { quantity },
    });
    await load();
  }

  async function remove(id: string) {
    await apiFetch(`/cart/items/${id}`, { method: "DELETE" });
    await load();
  }

  if (loading) return <div className="p-10 text-center">…</div>;
  if (!user || user.role !== "CUSTOMER") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p>يجب تسجيل الدخول كعميل لعرض السلة.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-700 underline">
          دخول
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (s, it) => s + Number(it.product.price) * it.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">سلة المشتريات</h1>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      {items.length === 0 && (
        <p className="mt-8 text-zinc-600">السلة فارغة.</p>
      )}
      <ul className="mt-8 space-y-4">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4"
          >
            <div>
              <p className="font-medium">{it.product.nameAr}</p>
              <p className="text-xs text-zinc-500">{it.product.branch.name}</p>
              <p className="mt-1 text-emerald-700">
                {formatMoney(it.product.price)} × {it.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                className="w-16 rounded border border-zinc-300 px-2 py-1"
                value={it.quantity}
                onChange={(e) =>
                  void updateQty(it.id, Number(e.target.value))
                }
              />
              <button
                type="button"
                className="text-sm text-red-600"
                onClick={() => void remove(it.id)}
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
          <p className="text-lg">
            الإجمالي الفرعي:{" "}
            <span className="font-semibold">{formatMoney(subtotal)}</span>
          </p>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            إتمام الطلب
          </button>
        </div>
      )}
    </div>
  );
}
