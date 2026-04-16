"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const KEY = "selectedBranchId";

type BranchCtx = {
  branchId: string | null;
  setBranchId: (id: string | null) => void;
};

const Ctx = createContext<BranchCtx | null>(null);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branchId, setBranchIdState] = useState<string | null>(null);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    setBranchIdState(v);
  }, []);

  const setBranchId = (id: string | null) => {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
    setBranchIdState(id);
  };

  const value = useMemo(
    () => ({ branchId, setBranchId }),
    [branchId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBranch() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBranch outside BranchProvider");
  return v;
}
