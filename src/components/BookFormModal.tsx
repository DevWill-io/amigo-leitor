"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Loader2,
  BookOpen,
  Eye,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { bookSchema, type BookFormData } from "@/schemas/book";
import {
  buscarLivrosGoogle,
  type GoogleBook
} from "@/lib/googleBooks";
import type { Book } from "@/types";
import BookDetailsModal from "./BookDetailsModal";

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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { titulo: "", autor: "", genero: "", sinopse: "", capa: "" }
  });

  // Busca Google Books
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<GoogleBook[]>([]);
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Modal de detalhes
  const [livroDetalhe, setLivroDetalhe] = useState<GoogleBook | null>(null);

  useEffect(() => {
    if (open) {
      reset(initial ?? { titulo: "", autor: "", genero: "", sinopse: "", capa: "" });
      setBusca("");
      setResultados([]);
      setMostrarResultados(false);
      setLivroDetalhe(null);
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

  const preencherFormulario = (g: GoogleBook) => {
    setValue("titulo", g.titulo);
    setValue("autor", g.autor);
    setValue("genero", g.genero);
    setValue("sinopse", g.sinopse);
    setValue("capa", g.capa);
  };

  const selecionarLivro = (g: GoogleBook) => {
    preencherFormulario(g);
    setMostrarResultados(false);
    setResultados([]);
    setBusca("");
    toast.success("Dados preenchidos automaticamente!");
  };

  const usarDetalhe = (g: GoogleBook) => {
    preencherFormulario(g);
    setLivroDetalhe(null);
    setMostrarResultados(false);
    setResultados([]);
    setBusca("");
    toast.success("Dados preenchidos automaticamente!");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="
                card w-full max-w-lg
                rounded-t-3xl sm:rounded-2xl
                max-h-[95vh] sm:max-h-[90vh]
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
                <h2 className="font-serif text-lg sm:text-2xl font-bold">
                  {initial ? "Editar livro" : "Adicionar livro"}
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
                {/* Busca Google Books */}
                {!initial && (
                  <div className="mb-5 p-4 rounded-xl bg-gold/10 border border-gold/30">
                    <label className="label flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      Buscar na Google Books
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
                        placeholder="Ex: Dom Casmurro…"
                        className="input flex-1 min-w-0 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleBuscar}
                        disabled={carregandoBusca}
                        className="btn-primary px-3 sm:px-4 flex-shrink-0"
                        aria-label="Buscar"
                      >
                        {carregandoBusca ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-brown-500 dark:text-brown-200 mt-2">
                      💡 Digite o título ou autor e pressione Enter.
                    </p>

                    {/* Resultados */}
                    <AnimatePresence>
                      {mostrarResultados && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
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
                            <div className="space-y-2 max-h-[45vh] sm:max-h-80 overflow-y-auto pr-1 -mr-1">
                              {resultados.map((g) => (
                                <div
                                  key={g.id}
                                  className="flex gap-3 items-start p-3 rounded-xl border border-brown-200 dark:border-brown-700 hover:bg-gold/10 transition"
                                >
                                  {/* Capa */}
                                  <button
                                    type="button"
                                    onClick={() => setLivroDetalhe(g)}
                                    className="w-12 h-16 sm:w-14 sm:h-20 flex-shrink-0 rounded overflow-hidden bg-beige dark:bg-brown-700/40 flex items-center justify-center"
                                    aria-label={`Ver detalhes de ${g.titulo}`}
                                  >
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
                                  </button>

                                  {/* Info + ações */}
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm line-clamp-2 leading-tight">
                                      {g.titulo}
                                    </p>
                                    <p className="text-xs text-brown-500 dark:text-brown-200 line-clamp-1 mt-0.5">
                                      {g.autor}
                                    </p>
                                    {g.genero && (
                                      <span className="mt-1 inline-block text-[10px] rounded-full bg-gold/20 px-2 py-0.5 max-w-full truncate">
                                        {g.genero}
                                      </span>
                                    )}

                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setLivroDetalhe(g)}
                                        className="text-[11px] inline-flex items-center gap-1 rounded-lg border border-brown-200 dark:border-brown-700 px-2 py-1 hover:bg-brown-50 dark:hover:bg-brown-700/40 transition"
                                      >
                                        <Eye className="w-3 h-3" /> Detalhes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => selecionarLivro(g)}
                                        className="text-[11px] inline-flex items-center gap-1 rounded-lg bg-brown-600 hover:bg-brown-700 text-cream px-2 py-1 transition"
                                      >
                                        <Sparkles className="w-3 h-3" /> Usar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Formulário */}
                <form
                  id="book-form"
                  onSubmit={handleSubmit(onSave)}
                  className="space-y-4"
                >
                  <div>
                    <label className="label">Título *</label>
                    <input
                      {...register("titulo")}
                      className="input text-sm"
                      placeholder="Ex: Dom Casmurro"
                    />
                    {errors.titulo && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.titulo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Autor *</label>
                    <input
                      {...register("autor")}
                      className="input text-sm"
                      placeholder="Ex: Machado de Assis"
                    />
                    {errors.autor && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.autor.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Gênero</label>
                    <input
                      {...register("genero")}
                      className="input text-sm"
                      placeholder="Ex: Romance"
                    />
                  </div>

                  <div>
                    <label className="label">URL da capa</label>
                    <input
                      {...register("capa")}
                      className="input text-sm"
                      placeholder="https://..."
                    />
                    {errors.capa && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.capa.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Sinopse</label>
                    <textarea
                      {...register("sinopse")}
                      rows={4}
                      className="input text-sm resize-none"
                      placeholder="Um breve resumo…"
                    />
                  </div>
                </form>
              </div>

              {/* Footer fixo */}
              <div className="border-t border-brown-100 dark:border-brown-700 px-5 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end bg-white/70 dark:bg-brown-800/70">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="book-form"
                  className="btn-primary w-full sm:w-auto"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalhes (por cima de tudo) */}
      <BookDetailsModal
        livro={livroDetalhe}
        onClose={() => setLivroDetalhe(null)}
        onUsar={usarDetalhe}
      />
    </>
  );
}