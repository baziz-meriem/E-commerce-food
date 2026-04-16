"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useBranch } from "@/context/branch-context";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Branch = { id: string; name: string };

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const { branchId, setBranchId } = useBranch();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    apiFetch<Branch[]>("/branches")
      .then(setBranches)
      .catch(() => setBranches([]));
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/driver")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-2 text-lg font-bold tracking-tight text-emerald-900"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl shadow-md shadow-emerald-500/25 transition group-hover:shadow-lg"
            aria-hidden
          >
            🥗
          </span>
          <span>
            طازج
            <span className="mr-1 block text-[10px] font-normal uppercase tracking-widest text-emerald-600/90">
              غذاء طازج
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-3 py-1.5 text-sm text-emerald-900 shadow-inner">
            <span className="text-zinc-500">الفرع</span>
            <select
              className="max-w-[200px] cursor-pointer rounded-lg border-0 bg-transparent py-0.5 text-sm font-medium text-emerald-900 focus:ring-0"
              value={branchId ?? ""}
              onChange={(e) =>
                setBranchId(e.target.value ? e.target.value : null)
              }
            >
              <option value="">اختر الفرع</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav className="flex flex-wrap items-center gap-1 text-sm md:gap-2">
          <Link
            href="/products"
            className="rounded-full px-3 py-1.5 text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-800"
          >
            المنتجات
          </Link>
          <Link
            href="/cart"
            className="rounded-full px-3 py-1.5 text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-800"
          >
            السلة
          </Link>
          {!loading && user?.role === "CUSTOMER" && (
            <>
              <Link
                href="/account/orders"
                className="rounded-full px-3 py-1.5 text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                طلباتي
              </Link>
              <Link
                href="/account/loyalty"
                className="rounded-full px-3 py-1.5 text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                النقاط
              </Link>
              <Link
                href="/checkout"
                className="rounded-full bg-gradient-to-l from-emerald-600 to-teal-600 px-4 py-2 font-medium text-white shadow-md shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500"
              >
                إتمام الطلب
              </Link>
            </>
          )}
          {!loading &&
            user &&
            ["ADMIN", "SUPER_ADMIN", "BRANCH_MANAGER"].includes(user.role) && (
              <Link
                href="/admin"
                className="rounded-full px-3 py-1.5 font-medium text-emerald-800 hover:bg-emerald-50"
              >
                لوحة التحكم
              </Link>
            )}
          {!loading && user?.role === "DRIVER" && (
            <Link
              href="/driver"
              className="rounded-full px-3 py-1.5 font-medium text-amber-800 hover:bg-amber-50"
            >
              لوحة السائق
            </Link>
          )}
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="rounded-full border-2 border-emerald-600 px-3 py-1.5 font-medium text-emerald-800 transition hover:bg-emerald-50"
              >
                تسجيل
              </Link>
            </>
          )}
          {!loading && user && (
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full px-2 py-1.5 text-zinc-400 transition hover:text-red-600"
            >
              خروج
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
