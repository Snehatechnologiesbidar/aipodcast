"use client";

import { createContext, useContext } from "react";
import { useAuthState } from "@/lib/auth/hooks";
import { AuthState } from "@/lib/auth/types";

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}