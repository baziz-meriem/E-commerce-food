"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

type U = {
  id: string;
  email: string;
  name: string;
  role: string;
  branchId: string | null;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<U[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || !["ADMIN", "SUPER_ADMIN", "BRANCH_MANAGER"].includes(user.role)) {
      router.replace("/");
      return;
    }
    apiFetch<U[]>("/users/admin/list")
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10">…</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">المستخدمون والموظفون</h1>
      <ul className="mt-8 space-y-2 text-sm">
        {users.map((u) => (
          <li
            key={u.id}
            className="rounded-lg border border-zinc-200 px-3 py-2"
          >
            {u.name} — {u.email} — {u.role}{" "}
            {u.branchId && <span className="text-zinc-500">(فرع)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
