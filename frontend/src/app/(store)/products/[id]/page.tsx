"use client";

import { useEffect, useState } from "react";
import { FoodImage } from "@/components/food-image";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type Product = {
  id: string;
  nameAr: string;
  descriptionAr: string;
  price: string;
  stock: number;
  imageUrl: string;
  branch: { name: string };
  category: { nameAr: string };
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const router = useRouter();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Product>(`/products/${id}`)
      .then(setP)
      .catch(() => setP(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function addToCart() {
    setMsg(null);
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "CUSTOMER") {
      setMsg("تسجيل الدخول كعميل لإضافة للسلة.");
      return;
    }
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        json: { productId: id, quantity: qty },
      });
      setMsg("تمت الإضافة للسلة.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "فشلت العملية");
    }
  }

  if (loading) return <div className="p-10 text-center">جاري التحميل…</div>;
  if (!p) return <div className="p-10 text-center">المنتج غير موجود.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="relative mb-8 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/50 shadow-inner">
        <FoodImage
          src={p.imageUrl}
          alt={p.nameAr}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <p className="text-sm text-zinc-500">{p.category.nameAr}</p>
      <h1 className="mt-2 text-3xl font-semibold">{p.nameAr}</h1>
      <p className="mt-2 text-sm text-zinc-600">الفرع: {p.branch.name}</p>
      <p className="mt-6 leading-relaxed text-zinc-700">
        {p.descriptionAr || "—"}
      </p>
      <p className="mt-6 text-2xl font-semibold text-emerald-700">
        {formatMoney(p.price)}
      </p>
      <p className="mt-2 text-sm text-zinc-500">متوفر: {p.stock}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          الكمية
          <input
            type="number"
            min={1}
            max={p.stock}
            className="w-20 rounded-lg border border-zinc-300 px-2 py-1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </label>
        <button
          type="button"
          onClick={() => void addToCart()}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          أضف للسلة
        </button>
      </div>
      {msg && <p className="mt-4 text-sm text-emerald-700">{msg}</p>}
    </div>
  );
}
