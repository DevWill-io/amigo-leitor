"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, BookOpen } from "lucide-react";
import BookCard from "./BookCard";
import type { UserProfile } from "@/types";

export default function UserDetailsModal({
  user, onClose
}: { user: UserProfile | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <Image src={user.photoURL} alt={user.nome} width={56} height={56}
                    className="rounded-full border border-brown-200" />
                )}
                <div>
                  <h2 className="font-serif text-2xl font-bold">{user.nome}</h2>
                  <p className="text-sm text-brown-500 dark:text-brown-200">
                    {user.livros.length} livro(s) cadastrado(s)
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
            </div>

            {user.livros.length === 0 ? (
              <div className="text-center py-12 text-brown-500 dark:text-brown-200">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-60" />
                <p>Essa pessoa ainda não cadastrou livros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {user.livros.map(b => (
                  <BookCard key={b.id} book={b} readOnly />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}