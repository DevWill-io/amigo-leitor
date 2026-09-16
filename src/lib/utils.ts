import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_BOOKS = 5;

export function gerarIdLivro() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}