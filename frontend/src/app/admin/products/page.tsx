"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useAuth } from "@/context/auth-context";

type Product = {
  id: string;
  nameAr: string;
  price: string;
  stock: number;
  isActive: boolean;
  branch: { name: string };
  category: { nameAr: string };
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    const list = await apiFetch<Product[]>("/products/admin/all");
    setProducts(list);
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
    load().catch(() => setProducts([]));
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">المنتجات</h1>
      <p className="mt-2 text-sm text-zinc-600">
        لإضافة منتج جديد استخدم واجهة الـ API أو وسّع هذه الصفحة لاحقًا بنموذج
        إنشاء.
      </p>
      <ul className="mt-8 space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 px-4 py-3"
          >
            <div>
              <p className="font-medium">{p.nameAr}</p>
              <p className="text-xs text-zinc-500">
                {p.branch.name} — {p.category.nameAr}
              </p>
            </div>
            <div className="text-sm">
              {formatMoney(p.price)} — مخزون {p.stock}{" "}
              {!p.isActive && (
                <span className="text-red-600">(معطّل)</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
