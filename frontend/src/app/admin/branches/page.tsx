"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  isActive: boolean;
};

export default function AdminBranchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      router.replace("/");
      return;
    }
    apiFetch<Branch[]>("/branches/admin/all")
      .then(setBranches)
      .catch(() => setBranches([]));
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">الفروع</h1>
      <ul className="mt-8 space-y-3">
        {branches.map((b) => (
          <li
            key={b.id}
            className="rounded-xl border border-zinc-200 p-4"
          >
            <p className="font-medium">{b.name}</p>
            <p className="mt-1 text-sm text-zinc-600">{b.address}</p>
            <p className="text-xs text-zinc-500">{b.phone}</p>
            <p className="mt-2 text-xs">
              {b.isActive ? "نشط" : "غير نشط"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
