"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, User, Tag, Check } from "lucide-react";
import type { GoogleBook } from "@/lib/googleBooks";

export default function BookDetailsModal({
  livro,
  onClose,
  onUsar
}: {
  livro: GoogleBook | null;
  onClose: () => void;
  onUsar: (livro: GoogleBook) => void;
}) {
  return (
    <AnimatePresence>
      {livro && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="
              card w-full max-w-2xl
              rounded-t-3xl sm:rounded-2xl
              max-h-[92vh] sm:max-h-[88vh]
              flex flex-col
              overflow-hidden
            "
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Alça visual (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-brown-300/60" />
            </div>

            {/* Header fixo */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b border-brown-100 dark:border-brown-700">
              <h2 className="font-serif text-lg sm:text-2xl font-bold truncate pr-3">
                Detalhes do livro
              </h2>
              <button
                onClick={onClose}
                className="btn-ghost p-2 flex-shrink-0"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Capa */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <div className="w-32 sm:w-40 aspect-[3/4] rounded-xl overflow-hidden bg-beige dark:bg-brown-700/40 flex items-center justify-center shadow-soft">
                    {livro.capa ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={livro.capa}
                        alt={livro.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-12 h-12 text-brown-300" />
                    )}
                  </div>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                    {livro.titulo}
                  </h3>

                  <p className="mt-2 text-sm text-brown-600 dark:text-brown-100 flex items-center gap-2 justify-center sm:justify-start">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{livro.autor}</span>
                  </p>

                  {livro.genero && (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs rounded-full bg-gold/20 text-brown-700 dark:text-gold px-3 py-1">
                      <Tag className="w-3 h-3" />
                      {livro.genero}
                    </span>
                  )}
                </div>
              </div>

              {/* Sinopse completa */}
              <div className="mt-6">
                <h4 className="font-serif text-base sm:text-lg font-semibold mb-2">
                  Sinopse
                </h4>
                {livro.sinopse ? (
                  <p className="text-sm leading-relaxed text-brown-700 dark:text-brown-100 whitespace-pre-line">
                    {livro.sinopse}
                  </p>
                ) : (
                  <p className="text-sm italic text-brown-500 dark:text-brown-200">
                    Sem sinopse disponível para este livro.
                  </p>
                )}
              </div>
            </div>

            {/* Footer fixo (botões) */}
            <div className="border-t border-brown-100 dark:border-brown-700 px-5 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end bg-white/70 dark:bg-brown-800/70">
              <button onClick={onClose} className="btn-ghost w-full sm:w-auto">
                Fechar
              </button>
              <button
                onClick={() => onUsar(livro)}
                className="btn-primary w-full sm:w-auto"
              >
                <Check className="w-4 h-4" /> Usar este livro
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}