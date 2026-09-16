"use client";
import { Book as BookIcon, Pencil, Trash2 } from "lucide-react";
import type { Book } from "@/types";

export default function BookCard({
  book, onEdit, onDelete, readOnly
}: { book: Book; onEdit?: () => void; onDelete?: () => void; readOnly?: boolean }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="aspect-[3/4] bg-beige dark:bg-brown-700/40 flex items-center justify-center overflow-hidden">
        {book.capa ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.capa} alt={book.titulo} className="w-full h-full object-cover" />
        ) : (
          <BookIcon className="w-12 h-12 text-brown-300" />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-serif text-lg font-semibold leading-tight">{book.titulo}</h3>
        <p className="text-sm text-brown-500 dark:text-brown-200 mt-1">{book.autor}</p>
        {book.genero && (
          <span className="mt-2 inline-block text-xs rounded-full bg-gold/20 text-brown-700 dark:text-gold px-2 py-0.5 w-fit">
            {book.genero}
          </span>
        )}
        {book.sinopse && (
          <p className="text-sm mt-2 text-brown-600 dark:text-brown-100 line-clamp-3">{book.sinopse}</p>
        )}
        {!readOnly && (
          <div className="mt-auto pt-3 flex gap-2">
            <button onClick={onEdit} className="btn-ghost text-xs flex-1">
              <Pencil className="w-3 h-3" /> Editar
            </button>
            <button onClick={onDelete} className="btn-ghost text-xs text-red-600 flex-1">
              <Trash2 className="w-3 h-3" /> Remover
            </button>
          </div>
        )}
      </div>
    </div>
  );
}