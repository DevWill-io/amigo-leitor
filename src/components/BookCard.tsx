"use client";
import { Book as BookIcon, Pencil, Trash2 } from "lucide-react";
import type { Book } from "@/types";

export default function BookCard({
  book,
  onEdit,
  onDelete,
  readOnly
}: {
  book: Book;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="card overflow-hidden flex flex-col hover:shadow-soft-lg transition-shadow">
      <div className="aspect-[3/4] bg-bege-200 dark:bg-marrom-700/40 flex items-center justify-center overflow-hidden">
        {book.capa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.capa}
            alt={book.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <BookIcon className="w-10 h-10 sm:w-12 sm:h-12 text-marrom-300" />
        )}
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-serif text-base sm:text-lg font-semibold leading-tight line-clamp-2 text-marrom-600 dark:text-creme">
          {book.titulo}
        </h3>

        <p className="text-xs sm:text-sm text-marrom-400 dark:text-bege-200 mt-1 line-clamp-1">
          {book.autor}
        </p>

        {book.genero && (
          <span className="mt-2 inline-block text-[10px] sm:text-xs rounded-full bg-terracota-500/15 text-terracota-700 dark:text-terracota-300 px-2.5 py-0.5 w-fit max-w-full truncate">
            {book.genero}
          </span>
        )}

        {book.sinopse && (
          <p className="text-xs sm:text-sm mt-2 text-marrom-500 dark:text-bege-100 line-clamp-2">
            {book.sinopse}
          </p>
        )}

        {!readOnly && (
          <div className="mt-auto pt-3 flex gap-1.5 sm:gap-2">
            <button
              onClick={onEdit}
              className="btn-ghost text-xs flex-1 !min-h-[40px] !px-2"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden xs:inline ml-1">Editar</span>
            </button>
            <button
              onClick={onDelete}
              className="btn-ghost text-xs flex-1 !min-h-[40px] !px-2 !text-red-600 hover:!bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline ml-1">Remover</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}