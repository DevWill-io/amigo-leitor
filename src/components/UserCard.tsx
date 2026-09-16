"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { UserProfile } from "@/types";

export default function UserCard({ user, onClick }: { user: UserProfile; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="card p-5 text-left w-full hover:shadow-lg transition"
    >
      <div className="flex items-center gap-4">
        {user.photoURL ? (
          <Image src={user.photoURL} alt={user.nome} width={56} height={56}
            className="rounded-full border border-brown-200" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-beige" />
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold truncate">{user.nome}</h3>
          <p className="text-sm text-brown-500 dark:text-brown-200 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {user.livros.length} livro(s)
          </p>
        </div>
      </div>
      {user.livros.length > 0 && (
        <p className="mt-3 text-xs text-brown-600 dark:text-brown-100 line-clamp-2">
          {user.livros.map(l => l.titulo).join(" · ")}
        </p>
      )}
    </motion.button>
  );
}