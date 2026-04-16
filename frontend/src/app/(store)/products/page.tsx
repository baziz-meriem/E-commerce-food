"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FoodImage } from "@/components/food-image";
import { useBranch } from "@/context/branch-context";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";

type Product = {
  id: string;
  nameAr: string;
  price: string;
  imageUrl: string;
  category: { id: string; nameAr: string };
};

type Category = { id: string; nameAr: string };

export default function ProductsPage() {
  const { branchId } = useBranch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<Category[]>("/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!branchId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ branchId });
    if (categoryId) params.set("categoryId", categoryId);
    if (q.trim()) params.set("q", q.trim());
    apiFetch<Product[]>(`/products?${params.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [branchId, categoryId, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950">
          المنتجات
        </h1>
        <p className="mt-2 text-zinc-600">
          صور حقيقية للعرض — جرّب البحث والتصنيف
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <input
          placeholder="بحث بالاسم…"
          className="min-w-[200px] flex-1 rounded-2xl border border-emerald-200/80 bg-white px-4 py-3 text-sm shadow-sm ring-emerald-500/20 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-2xl border border-emerald-200/80 bg-white px-4 py-3 text-sm font-medium text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </select>
      </div>
      {!branchId && (
        <div className="mt-10 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-6 text-amber-950 shadow-inner">
          اختر فرعًا من الشريط العلوي لعرض المنتجات.
        </div>
      )}
      {branchId && loading && (
        <div className="mt-10 flex items-center gap-2 text-zinc-500">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          جاري التحميل…
        </div>
      )}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group overflow-hidden rounded-2xl border border-white/90 bg-white shadow-md shadow-zinc-200/50 ring-1 ring-emerald-900/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-b from-emerald-50/40 to-zinc-50">
              <FoodImage
                src={p.imageUrl}
                alt={p.nameAr}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-emerald-600">
                {p.category.nameAr}
              </p>
              <p className="mt-1 line-clamp-2 font-semibold text-zinc-900">
                {p.nameAr}
              </p>
              <p className="mt-3 text-lg font-bold text-emerald-700">
                {formatMoney(p.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
