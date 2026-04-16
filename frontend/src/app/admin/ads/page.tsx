"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

type Ad = {
  id: string;
  titleAr: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
};

export default function AdminAdsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    if (loading) return;
    if (
      !user ||
      !["ADMIN", "SUPER_ADMIN", "BRANCH_MANAGER"].includes(user.role)
    ) {
      router.replace("/");
      return;
    }
    apiFetch<Ad[]>("/ads/admin/all")
      .then(setAds)
      .catch(() => setAds([]));
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">الإعلانات</h1>
      <ul className="mt-8 space-y-3">
        {ads.map((a) => (
          <li
            key={a.id}
            className="rounded-xl border border-zinc-200 p-4"
          >
            <p className="font-medium">{a.titleAr}</p>
            <p className="text-sm text-zinc-600">{a.linkUrl}</p>
            <p className="text-xs text-zinc-500">
              ترتيب {a.sortOrder} — {a.isActive ? "نشط" : "معطّل"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
