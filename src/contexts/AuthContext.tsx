"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { criarOuBuscarUsuario } from "@/lib/firestore";
import type { UserProfile } from "@/types";

interface AuthCtxType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthCtx = createContext<AuthCtxType>({} as AuthCtxType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await criarOuBuscarUsuario(u.uid, {
          nome: u.displayName || "Leitor(a)",
          email: u.email || "",
          photoURL: u.photoURL || ""
        });
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginGoogle = async () => { await signInWithPopup(auth, googleProvider); };
  const logout = async () => { await signOut(auth); };

  const refreshProfile = async () => {
    if (!user) return;
    const { getUsuario } = await import("@/lib/firestore");
    const p = await getUsuario(user.uid);
    setProfile(p);
  };

  return (
    <AuthCtx.Provider value={{ user, profile, loading, loginGoogle, logout, refreshProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);