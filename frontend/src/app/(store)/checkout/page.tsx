"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

type LoyaltyMe = {
  balance: number;
  settings: { minRedeemPoints: number; redeemPointsPerUnit: string };
};

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [loyalty, setLoyalty] = useState<LoyaltyMe | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === "CUSTOMER") {
      apiFetch<LoyaltyMe>("/loyalty/me")
        .then(setLoyalty)
        .catch(() => setLoyalty(null));
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!user || user.role !== "CUSTOMER") return;
    setSubmitting(true);
    try {
      const order = await apiFetch<{ id: string; orderNumber: string }>(
        "/orders/checkout",
        {
          method: "POST",
          json: {
            deliveryAddress: address,
            deliveryPhone: phone,
            notes,
            redeemPoints: redeemPoints || undefined,
          },
        },
      );
      router.push(`/account/orders?new=${order.orderNumber}`);
    } catch (ex) {
      setMsg(ex instanceof Error ? ex.message : "فشل إنشاء الطلب");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-10 text-center">…</div>;
  if (!user || user.role !== "CUSTOMER") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p>الدفع عند الاستلام متاح للعملاء فقط.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-700 underline">
          دخول
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold">إتمام الطلب — الدفع عند الاستلام</h1>
      <p className="mt-2 text-sm text-zinc-600">
        رسوم التوصيل ثابتة تُضاف تلقائيًا على الخادم (عرضها في تفاصيل الطلب بعد
        الإنشاء).
      </p>
      {loyalty && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          رصيد النقاط: {loyalty.balance} — الحد الأدنى للاستبدال:{" "}
          {loyalty.settings.minRedeemPoints}
        </p>
      )}
      <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-zinc-600">عنوان التوصيل</label>
          <textarea
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600">هاتف التوصيل</label>
          <input
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600">ملاحظات</label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {loyalty && loyalty.balance >= loyalty.settings.minRedeemPoints && (
          <div>
            <label className="block text-sm text-zinc-600">
              نقاط تريد استبدالها (اختياري)
            </label>
            <input
              type="number"
              min={0}
              max={loyalty.balance}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(Number(e.target.value))}
            />
          </div>
        )}
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? "جاري إرسال الطلب…" : "تأكيد الطلب"}
        </button>
      </form>
    </div>
  );
}
