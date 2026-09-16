"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProtectedRoute from "@/components/ProtectedRoute";
import BookCard from "@/components/BookCard";
import BookFormModal from "@/components/BookFormModal";
import { useAuth } from "@/contexts/AuthContext";
import { salvarLivros, atualizarNome } from "@/lib/firestore";
import { MAX_BOOKS, gerarIdLivro } from "@/lib/utils";
import type { Book } from "@/types";
import { profileSchema, type ProfileFormData } from "@/schemas/profile";
import type { BookFormData } from "@/schemas/book";

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <PerfilContent />
    </ProtectedRoute>
  );
}

function PerfilContent() {
  const { profile, user, refreshProfile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Book | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { nome: profile?.nome || "" }
  });

  if (!profile || !user) return null;

  const atingiuLimite = profile.livros.length >= MAX_BOOKS;

  const salvarNome = async (data: ProfileFormData) => {
    try {
      await atualizarNome(user.uid, data.nome.trim());
      await refreshProfile();
      toast.success("Nome atualizado!");
    } catch {
      toast.error("Erro ao salvar nome.");
    }
  };

  const salvarLivro = async (data: BookFormData) => {
    try {
      let novos: Book[];
      if (editando) {
        novos = profile.livros.map(l =>
          l.id === editando.id
            ? { ...l, ...data, genero: data.genero || "", sinopse: data.sinopse || "", capa: data.capa || "" }
            : l
        );
      } else {
        if (atingiuLimite) { toast.error("Limite de 5 livros atingido."); return; }
        novos = [...profile.livros, {
          id: gerarIdLivro(),
          ...data,
          genero: data.genero || "",
          sinopse: data.sinopse || "",
          capa: data.capa || ""
        }];
      }
      await salvarLivros(user.uid, novos);
      await refreshProfile();
      toast.success(editando ? "Livro atualizado!" : "Livro adicionado!");
      setModalOpen(false);
      setEditando(null);
    } catch {
      toast.error("Erro ao salvar livro.");
    }
  };

  const removerLivro = async (id: string) => {
    if (!confirm("Remover este livro?")) return;
    const novos = profile.livros.filter(l => l.id !== id);
    await salvarLivros(user.uid, novos);
    await refreshProfile();
    toast.success("Livro removido.");
  };

  return (
    <div className="space-y-10">
      <section className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {profile.photoURL && (
            <Image src={profile.photoURL} alt={profile.nome} width={80} height={80}
              className="rounded-full border-2 border-gold" />
          )}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit(salvarNome)} className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <label className="label">Seu nome</label>
                <input {...register("nome")} className="input" />
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
              </div>
              <button className="btn-primary" type="submit">
                <Save className="w-4 h-4" /> Salvar
              </button>
            </form>
            <p className="text-xs text-brown-500 dark:text-brown-200 mt-2">{profile.email}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold">Meus livros</h2>
            <p className="text-sm text-brown-500 dark:text-brown-200">
              {profile.livros.length}/{MAX_BOOKS} cadastrados
            </p>
          </div>
          <button
            onClick={() => { setEditando(null); setModalOpen(true); }}
            disabled={atingiuLimite}
            className="btn-primary"
            title={atingiuLimite ? "Limite de 5 livros atingido" : "Adicionar livro"}
          >
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>

        {profile.livros.length === 0 ? (
          <div className="card p-10 text-center text-brown-500 dark:text-brown-200">
            <p>Você ainda não cadastrou nenhum livro.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {profile.livros.map(b => (
              <BookCard
                key={b.id}
                book={b}
                onEdit={() => { setEditando(b); setModalOpen(true); }}
                onDelete={() => removerLivro(b.id)}
              />
            ))}
          </div>
        )}
      </section>

      <BookFormModal
        open={modalOpen}
        initial={editando}
        onClose={() => { setModalOpen(false); setEditando(null); }}
        onSave={salvarLivro}
      />
    </div>
  );
}