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
  branch: { name: string };
  category: { nameAr: string };
};

type Ad = {
  id: string;
  titleAr: string;
  linkUrl: string;
  imageUrl?: string;
};

export function HomeClient({
  initialAds,
}: {
  initialAds: Ad[];
}) {
  const { branchId } = useBranch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!branchId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    const q = new URLSearchParams({ branchId });
    apiFetch<Product[]>(`/products?${q.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [branchId]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-bl from-emerald-50 via-white to-teal-50 p-8 shadow-lg shadow-emerald-900/5 md:p-12">
        <div
          className="pointer-events-none absolute -start-16 top-0 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -end-8 bottom-0 h-32 w-32 rounded-full bg-teal-400/20 blur-2xl"
          aria-hidden
        />
        <p className="relative text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
          توصيل · دفع عند الاستلام
        </p>
        <h1 className="relative mt-3 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-emerald-950 md:text-4xl">
          أكل بيتك الطازج،
          <span className="text-emerald-600"> من غير تعب.</span>
        </h1>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
          اختر الفرع، تصفّح المنتجات بصور حقيقية، املأ السلة، وادفع كاش لما
          الطلب يوصل. نقاط ومكافآت على كل طلب يتسكّر.
        </p>
        <div className="relative mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-500 hover:to-teal-500"
          >
            تصفّح المنتجات
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-emerald-200 bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-900 backdrop-blur hover:border-emerald-300"
          >
            دخول العملاء
          </Link>
        </div>
      </section>

      {initialAds.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-950">
            <span className="h-1 w-8 rounded-full bg-emerald-500" />
            عروض واختيارات
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {initialAds.map((ad) => (
              <Link
                key={ad.id}
                href={ad.linkUrl || "/products"}
                className="group overflow-hidden rounded-2xl border border-white/80 bg-white shadow-md shadow-zinc-200/50 ring-1 ring-emerald-900/5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/10"
              >
              <div className="relative aspect-[16/9] w-full bg-emerald-50">
                <FoodImage
                  src={ad.imageUrl}
                  alt={ad.titleAr}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
                <div className="p-5">
                  <p className="text-lg font-bold text-emerald-900">
                    {ad.titleAr}
                  </p>
                  <p className="mt-2 text-sm text-emerald-700/80">
                    اضغط للعرض ←
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-emerald-950">
              <span className="h-1 w-8 rounded-full bg-emerald-500" />
              منتجات مختارة
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              من أحدث ما وصل فرعك
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
          >
            كل المنتجات
          </Link>
        </div>
        {!branchId && (
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-l from-amber-50 to-orange-50/50 p-6 text-amber-950 shadow-inner">
            <p className="font-medium">اختر فرعًا من الشريط العلوي</p>
            <p className="mt-1 text-sm text-amber-900/80">
              لعرض المنتجات والأسعار الخاصة بذلك الفرع.
            </p>
          </div>
        )}
        {branchId && loading && (
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            جاري التحميل…
          </div>
        )}
        {branchId && !loading && products.length === 0 && (
          <p className="text-zinc-500">لا توجد منتجات لهذا الفرع بعد.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-white/90 bg-white shadow-md shadow-zinc-200/40 ring-1 ring-emerald-900/5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-emerald-50/50 to-zinc-50">
                <FoodImage
                  src={p.imageUrl}
                  alt={p.nameAr}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600/90">
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
      </section>
    </div>
  );
}
