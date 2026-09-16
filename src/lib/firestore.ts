import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  serverTimestamp, query, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import type { Book, Sorteio, UserProfile } from "@/types";

const USERS = "users";
const SORTEIOS = "sorteios";

export async function criarOuBuscarUsuario(uid: string, data: {
  nome: string; email: string; photoURL: string;
}): Promise<UserProfile> {
  const ref = doc(db, USERS, uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserProfile;

  const novo: UserProfile = {
    uid,
    nome: data.nome,
    email: data.email,
    photoURL: data.photoURL,
    livros: [],
    criadoEm: null,
    atualizadoEm: null
  };
  await setDoc(ref, { ...novo, criadoEm: serverTimestamp(), atualizadoEm: serverTimestamp() });
  return novo;
}

export async function getUsuario(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function listarUsuarios(): Promise<UserProfile[]> {
  const q = query(collection(db, USERS), orderBy("nome"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserProfile);
}

export function observarUsuarios(cb: (users: UserProfile[]) => void) {
  const q = query(collection(db, USERS), orderBy("nome"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => d.data() as UserProfile)));
}

export async function atualizarNome(uid: string, nome: string) {
  await updateDoc(doc(db, USERS, uid), { nome, atualizadoEm: serverTimestamp() });
}

export async function salvarLivros(uid: string, livros: Book[]) {
  await updateDoc(doc(db, USERS, uid), {
    livros,
    atualizadoEm: serverTimestamp()
  });
}

export async function salvarSorteio(ano: number, pares: Record<string, string>) {
  await setDoc(doc(db, SORTEIOS, String(ano)), {
    ano,
    pares,
    criadoEm: serverTimestamp()
  });
}

export async function getSorteio(ano: number): Promise<Sorteio | null> {
  const snap = await getDoc(doc(db, SORTEIOS, String(ano)));
  return snap.exists() ? (snap.data() as Sorteio) : null;
}