"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Gift, PartyPopper } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import BookCard from "@/components/BookCard";
import { useAuth } from "@/contexts/AuthContext";
import { getSorteio, getUsuario } from "@/lib/firestore";
import type { UserProfile } from "@/types";

const ANO_ATUAL = new Date().getFullYear();

export default function MeuAmigoPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}

function Content() {
  const { user } = useAuth();
  const [amigo, setAmigo] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [semSorteio, setSemSorteio] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const sorteio = await getSorteio(ANO_ATUAL);
      if (!sorteio || !sorteio.pares[user.uid]) {
        setSemSorteio(true); setCarregando(false); return;
      }
      const amigoUid = sorteio.pares[user.uid];
      const u = await getUsuario(amigoUid);
      setAmigo(u);
      setCarregando(false);
    })();
  }, [user]);

  if (carregando) return <p className="text-center py-20">Carregando…</p>;

  if (semSorteio) {
    return (
      <div className="card p-10 text-center max-w-lg mx-auto">
        <PartyPopper className="w-14 h-14 mx-auto text-gold" />
        <h1 className="font-serif text-2xl font-bold mt-4">Sorteio ainda não realizado</h1>
        <p className="text-brown-500 dark:text-brown-200 mt-2">
          Aguarde o administrador realizar o sorteio deste ano.
        </p>
      </div>
    );
  }

  if (!amigo) return null;

  return (
    <div className="space-y-6">
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-4">
        <Gift className="w-10 h-10 text-gold" />
        <div className="text-center sm:text-left">
          <p className="text-sm text-brown-500 dark:text-brown-200">Você tirou…</p>
          <h1 className="font-serif text-3xl font-bold flex items-center gap-3 justify-center sm:justify-start">
            {amigo.photoURL && (
              <Image src={amigo.photoURL} alt={amigo.nome} width={40} height={40}
                className="rounded-full border border-brown-200" />
            )}
            {amigo.nome}
          </h1>
          <p className="text-sm text-brown-500 dark:text-brown-200 mt-1">
            Escolha um dos livros abaixo para presentear 💝
          </p>
        </div>
      </div>

      {amigo.livros.length === 0 ? (
        <div className="card p-10 text-center text-brown-500">
          Essa pessoa ainda não cadastrou livros. 😢
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {amigo.livros.map(b => <BookCard key={b.id} book={b} readOnly />)}
        </div>
      )}
    </div>
  );
}