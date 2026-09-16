"use client";
import { useEffect, useState } from "react";
import { Shuffle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { listarUsuarios, salvarSorteio, getSorteio } from "@/lib/firestore";
import type { UserProfile } from "@/types";

const ANO_ATUAL = new Date().getFullYear();

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}

function Content() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);
  const [pares, setPares] = useState<Record<string, string> | null>(null);
  const [carregando, setCarregando] = useState(false);

  const isAdmin = user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID;

  useEffect(() => {
    if (!isAdmin) return;
    listarUsuarios().then(setUsuarios);
    getSorteio(ANO_ATUAL).then(s => s && setPares(s.pares));
  }, [isAdmin]);

  const sortear = async () => {
    if (usuarios.length < 2) return toast.error("Precisa de pelo menos 2 participantes.");
    if (!confirm("Isso vai SOBRESCREVER o sorteio atual. Continuar?")) return;

    setCarregando(true);
    try {
      // Fisher-Yates
      const uids = usuarios.map(u => u.uid);
      let embaralhado = [...uids];
      do {
        for (let i = embaralhado.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
        }
      } while (embaralhado.some((u, i) => u === uids[i]));

      const novosPares: Record<string, string> = {};
      uids.forEach((uid, i) => { novosPares[uid] = embaralhado[i]; });

      await salvarSorteio(ANO_ATUAL, novosPares);
      setPares(novosPares);
      toast.success("Sorteio realizado com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao realizar sorteio.");
    } finally {
      setCarregando(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="card p-10 text-center max-w-lg mx-auto">
        <h1 className="font-serif text-2xl font-bold">Acesso restrito</h1>
        <p className="text-brown-500 dark:text-brown-200 mt-2">
          Apenas o administrador pode acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-gold" /> Painel do Sorteio
        </h1>
        <p className="text-brown-500 dark:text-brown-200 mt-1">
          {usuarios.length} participante(s) cadastrado(s) para o ano {ANO_ATUAL}.
        </p>

        <button
          onClick={sortear}
          disabled={carregando}
          className="btn-primary mt-4"
        >
          <Shuffle className="w-4 h-4" />
          {carregando ? "Sorteando…" : pares ? "Refazer sorteio" : "Realizar sorteio"}
        </button>
      </div>

      {pares && (
        <div className="card p-6">
          <h2 className="font-serif text-xl font-bold mb-3">Resultado atual</h2>
          <ul className="space-y-2 text-sm">
            {Object.entries(pares).map(([uid, amigoUid]) => {
              const a = usuarios.find(u => u.uid === uid)?.nome ?? uid;
              const b = usuarios.find(u => u.uid === amigoUid)?.nome ?? amigoUid;
              return (
                <li key={uid} className="flex items-center gap-2">
                  <span className="font-medium">{a}</span>
                  <span className="text-gold">→</span>
                  <span>{b}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}