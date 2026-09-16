"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { bookSchema, type BookFormData } from "@/schemas/book";
import type { Book } from "@/types";

export default function BookFormModal({
  open, onClose, onSave, initial
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: BookFormData) => void;
  initial?: Book | null;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { titulo: "", autor: "", genero: "", sinopse: "", capa: "" }
  });

  useEffect(() => {
    if (open) reset(initial ?? { titulo: "", autor: "", genero: "", sinopse: "", capa: "" });
  }, [open, initial, reset]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold">
                {initial ? "Editar livro" : "Adicionar livro"}
              </h2>
              <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="label">Título *</label>
                <input {...register("titulo")} className="input" placeholder="Ex: Dom Casmurro" />
                {errors.titulo && <p className="text-xs text-red-500 mt-1">{errors.titulo.message}</p>}
              </div>
              <div>
                <label className="label">Autor *</label>
                <input {...register("autor")} className="input" placeholder="Ex: Machado de Assis" />
                {errors.autor && <p className="text-xs text-red-500 mt-1">{errors.autor.message}</p>}
              </div>
              <div>
                <label className="label">Gênero</label>
                <input {...register("genero")} className="input" placeholder="Ex: Romance" />
              </div>
              <div>
                <label className="label">URL da capa</label>
                <input {...register("capa")} className="input" placeholder="https://..." />
                {errors.capa && <p className="text-xs text-red-500 mt-1">{errors.capa.message}</p>}
              </div>
              <div>
                <label className="label">Sinopse</label>
                <textarea {...register("sinopse")} rows={4} className="input" placeholder="Um breve resumo..." />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}