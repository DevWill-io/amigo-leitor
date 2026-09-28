"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { UserProfile } from "@/types";

export default function UserCard({
  user,
  onClick
}: {
  user: UserProfile;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="card p-4 text-left w-full hover:shadow-soft-lg transition-shadow
                 active:bg-bege-200/60 dark:active:bg-marrom-600/60"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.nome}
            width={56}
            height={56}
            className="rounded-full border-2 border-terracota-300/60 w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-bege-300 flex-shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base sm:text-lg font-semibold truncate text-marrom-600 dark:text-creme">
            {user.nome}
          </h3>
          <p className="text-xs sm:text-sm text-marrom-400 dark:text-bege-200 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {user.livros.length} livro(s)
          </p>
        </div>
      </div>

      {user.livros.length > 0 && (
        <p className="mt-3 text-xs text-marrom-500 dark:text-bege-100 line-clamp-2">
          {user.livros.map((l) => l.titulo).join(" · ")}
        </p>
      )}
    </motion.button>
  );
}