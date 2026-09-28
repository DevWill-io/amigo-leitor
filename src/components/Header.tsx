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
    <header
      className="
        sticky top-0 z-40
        backdrop-blur-md bg-creme/85 dark:bg-marrom-900/85
        border-b border-bege-300/60 dark:border-marrom-600
        pt-safe
      "
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-terracota-500" />
          <span className="font-serif text-lg sm:text-xl font-bold text-marrom-600 dark:text-creme">
            Amigo Leitor
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Links — só no desktop (mobile tem bottom nav) */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/perfil" className="btn-ghost text-sm">
                <UserIcon className="w-4 h-4" />
                <span className="ml-1.5">Perfil</span>
              </Link>
              <Link href="/amigo" className="btn-ghost text-sm">
                <Gift className="w-4 h-4" />
                <span className="ml-1.5">Amigo</span>
              </Link>
              {isAdmin && (
                <Link href="/admin" className="btn-ghost text-sm">
                  <Shield className="w-4 h-4" />
                  <span className="ml-1.5">Admin</span>
                </Link>
              )}
            </div>
          )}

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 ml-1">
              {profile?.photoURL && (
                <Image
                  src={profile.photoURL}
                  alt={profile.nome}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-bege-300 dark:border-marrom-500 w-8 h-8 sm:w-9 sm:h-9"
                />
              )}
              <button
                onClick={handleLogout}
                className="btn-icon"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm px-4">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}