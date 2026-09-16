"use client";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { loginGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  const handle = async () => {
    try {
      await loginGoogle();
      toast.success("Bem-vindo(a)!");
      router.replace("/");
    } catch {
      toast.error("Não foi possível entrar.");
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card p-8 max-w-md w-full text-center"
      >
        <BookOpen className="w-14 h-14 mx-auto text-gold" />
        <h1 className="font-serif text-3xl font-bold mt-4">Amigo Leitor</h1>
        <p className="text-brown-500 dark:text-brown-200 mt-2">
          Entre com sua conta Google para participar do amigo secreto literário.
        </p>
        <button onClick={handle} className="btn-primary w-full mt-6">
          Entrar com Google
        </button>
      </motion.div>
    </div>
  );
}