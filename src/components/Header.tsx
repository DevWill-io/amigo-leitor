"use client";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, LogOut, User as UserIcon, Gift, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.uid && user.uid === process.env.NEXT_PUBLIC_ADMIN_UID;

  const handleLogout = async () => {
    await logout();
    toast.success("Até logo!");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-cream/80 dark:bg-brown-900/80 border-b border-brown-100 dark:border-brown-700">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-gold" />
          <span className="font-serif text-xl font-bold">Amigo Leitor</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user && (
            <>
              <Link href="/perfil" className="btn-ghost text-sm hidden sm:inline-flex">
                <UserIcon className="w-4 h-4" /> Perfil
              </Link>
              <Link href="/amigo" className="btn-ghost text-sm hidden sm:inline-flex">
                <Gift className="w-4 h-4" /> Meu amigo
              </Link>
              {isAdmin && (
                <Link href="/admin" className="btn-ghost text-sm hidden sm:inline-flex">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
            </>
          )}
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              {profile?.photoURL && (
                <Image
                  src={profile.photoURL}
                  alt={profile.nome}
                  width={32}
                  height={32}
                  className="rounded-full border border-brown-200"
                />
              )}
              <button onClick={handleLogout} className="btn-ghost text-sm">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}