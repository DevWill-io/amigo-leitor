"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { bookSchema, type BookFormData } from "@/schemas/book";
import { buscarLivrosGoogle, type GoogleBook } from "@/lib/googleBooks";
import type { Book } from "@/types";

export default function BookFormModal({
  open,
  onClose,
  onSave,
  initial
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: BookFormData) => void;
  initial?: Book | null;
}) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<BookFormData>({
      resolver: zodResolver(bookSchema),
      defaultValues: { titulo: "", autor: "", genero: "", sinopse: "", capa: "" }
    });

  // Estado da busca no Google Books
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<GoogleBook[]>([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    if (open) {
      reset(initial ?? { titulo: "", autor: "", genero: "", sinopse: "", capa: "" });
      setBusca("");
      setResultados([]);
      setMostrarResultados(false);
    }
  }, [open, initial, reset]);

  const handleBuscar = async () => {
    if (!busca.trim()) return toast.error("Digite o título ou autor do livro.");
    setCarregandoBusca(true);
    setMostrarResultados(true);
    try {
      const livros = await buscarLivrosGoogle(busca);
      setResultados(livros);
      if (livros.length === 0) toast.error("Nenhum livro encontrado.");
    } catch {
      toast.error("Erro ao buscar na Google Books.");
    } finally {
      setCarregandoBusca(false);
    }
  };

  const selecionarLivro = (g: GoogleBook) => {
    setValue("titulo", g.titulo);
    setValue("autor", g.autor);
    setValue("genero", g.genero);
    setValue("sinopse", g.sinopse);
    setValue("capa", g.capa);
    setMostrarResultados(false);
    setResultados([]);
    setBusca("");
    toast.success("Dados preenchidos automaticamente!");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold">
                {initial ? "Editar livro" : "Adicionar livro"}
              </h2>
              <button onClick={onClose} className="btn-ghost p-2">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 🔍 Busca Google Books */}
            {!initial && (
              <div className="mb-5 p-4 rounded-xl bg-gold/10 border border-gold/30">
                <label className="label flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Buscar na Google Books (preenchimento automático)
                </label>
                <div className="flex gap-2">
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleBuscar();
                      }
                    }}
                    placeholder="Ex: Dom Casmurro, Machado de Assis…"
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleBuscar}
                    disabled={carregandoBusca}
                    className="btn-primary"
                  >
                    {carregandoBusca ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-brown-500 dark:text-brown-200 mt-2">
                  💡 Digite e clique na lupa (ou pressione Enter) para buscar.
                </p>
              </div>
            )}

            {/* Resultados da busca */}
            <AnimatePresence>
              {mostrarResultados && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  {carregandoBusca ? (
                    <div className="text-center py-6 text-brown-500">
                      <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                      <p className="text-sm mt-2">Buscando…</p>
                    </div>
                  ) : resultados.length === 0 ? (
                    <p className="text-center text-sm text-brown-500 py-4">
                      Nenhum resultado.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {resultados.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => selecionarLivro(g)}
                          className="w-full flex gap-3 items-start p-3 rounded-xl border border-brown-200 dark:border-brown-700 hover:bg-gold/10 transition text-left"
                        >
                          <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-beige flex items-center justify-center">
                            {g.capa ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={g.capa}
                                alt={g.titulo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="w-6 h-6 text-brown-300" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm line-clamp-1">
                              {g.titulo}
                            </p>
                            <p className="text-xs text-brown-500 dark:text-brown-200 line-clamp-1">
                              {g.autor}
                            </p>
                            {g.genero && (
                              <span className="mt-1 inline-block text-[10px] rounded-full bg-gold/20 px-2 py-0.5">
                                {g.genero}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="label">Título *</label>
                <input
                  {...register("titulo")}
                  className="input"
                  placeholder="Ex: Dom Casmurro"
                />
                {errors.titulo && (
                  <p className="text-xs text-red-500 mt-1">{errors.titulo.message}</p>
                )}
              </div>

              <div>
                <label className="label">Autor *</label>
                <input
                  {...register("autor")}
                  className="input"
                  placeholder="Ex: Machado de Assis"
                />
                {errors.autor && (
                  <p className="text-xs text-red-500 mt-1">{errors.autor.message}</p>
                )}
              </div>

              <div>
                <label className="label">Gênero</label>
                <input
                  {...register("genero")}
                  className="input"
                  placeholder="Ex: Romance"
                />
              </div>

              <div>
                <label className="label">URL da capa</label>
                <input
                  {...register("capa")}
                  className="input"
                  placeholder="https://..."
                />
                {errors.capa && (
                  <p className="text-xs text-red-500 mt-1">{errors.capa.message}</p>
                )}
              </div>

              <div>
                <label className="label">Sinopse</label>
                <textarea
                  {...register("sinopse")}
                  rows={4}
                  className="input"
                  placeholder="Um breve resumo…"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={onClose} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}