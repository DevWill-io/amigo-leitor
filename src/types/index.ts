import type { Timestamp } from "firebase/firestore";

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero?: string;
  sinopse?: string;
  capa?: string;
}

export interface UserProfile {
  uid: string;
  nome: string;
  email: string;
  photoURL: string;
  livros: Book[];
  criadoEm: Timestamp | null;
  atualizadoEm: Timestamp | null;
}

export interface Sorteio {
  ano: number;
  pares: Record<string, string>; // uid -> uidAmigo
  criadoEm: Timestamp | null;
}