"use client";

import { useAuth } from "./AuthContext";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/?message=need_login");
    }
  }, [token, router]);

  if (!token) return null; // 防止短暂渲染

  return children;
};

export default ProtectedRoute;
