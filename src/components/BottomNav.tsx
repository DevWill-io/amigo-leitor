"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User as UserIcon, Gift, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function BottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.uid && user.uid === process.env.NEXT_PUBLIC_ADMIN_UID;

  if (!user) return null;

  const items = [
    { href: "/", label: "Início", icon: Home },
    { href: "/perfil", label: "Perfil", icon: UserIcon },
    { href: "/amigo", label: "Amigo", icon: Gift },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : [])
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40 md:hidden
        bg-bege-100/95 dark:bg-marrom-800/95 backdrop-blur-md
        border-t border-bege-300 dark:border-marrom-600
        pb-safe
      "
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {items.map(({ href, label, icon: Icon }) => {
          const ativo = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center
                         flex-1 h-full min-h-[48px] gap-0.5
                         text-marrom-500 dark:text-bege-200"
            >
              {ativo && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-x-3 inset-y-1 rounded-2xl bg-terracota-500/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`relative w-5 h-5 transition-colors ${
                  ativo ? "text-terracota-500" : ""
                }`}
              />
              <span
                className={`relative text-[11px] font-medium transition-colors ${
                  ativo ? "text-terracota-600" : ""
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}