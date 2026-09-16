"use client";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { observarUsuarios } from "@/lib/firestore";
import type { UserProfile } from "@/types";
import UserCard from "@/components/UserCard";
import UserDetailsModal from "@/components/UserDetailsModal";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = observarUsuarios(setUsuarios);
    return () => unsub();
  }, [user]);

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return usuarios;
    return usuarios.filter(u =>
      u.nome.toLowerCase().includes(t) ||
      u.livros.some(l => l.titulo.toLowerCase().includes(t) || l.autor.toLowerCase().includes(t))
    );
  }, [busca, usuarios]);

  if (!user) {
    return (
      <section className="text-center py-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold">
          Bem-vindo ao <span className="text-gold">Amigo Leitor</span>
        </h1>
        <p className="text-brown-500 dark:text-brown-200 mt-4 max-w-xl mx-auto">
          Cadastre até 5 livros que você ama e participe de um amigo secreto literário.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Participantes</h1>
          <p className="text-brown-500 dark:text-brown-200 text-sm">
            {filtrados.length} pessoa(s) cadastrada(s)
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brown-400" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou livro…"
            className="input pl-9"
          />
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="text-center text-brown-500 py-20">Nenhum participante encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map(u => (
            <UserCard key={u.uid} user={u} onClick={() => setSelecionado(u)} />
          ))}
        </div>
      )}

      <UserDetailsModal user={selecionado} onClose={() => setSelecionado(null)} />
    </section>
  );
}