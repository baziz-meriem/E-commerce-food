"use client";

import { AuthProvider } from "@/context/auth-context";
import { BranchProvider } from "@/context/branch-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BranchProvider>{children}</BranchProvider>
    </AuthProvider>
  );
}
