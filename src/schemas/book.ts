import { z } from "zod";

export const bookSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(120),
  autor: z.string().min(1, "Autor é obrigatório").max(120),
  genero: z.string().max(60).optional().or(z.literal("")),
  sinopse: z.string().max(600).optional().or(z.literal("")),
  capa: z.string().url("URL inválida").optional().or(z.literal(""))
});
export type BookFormData = z.infer<typeof bookSchema>;

export const profileSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(60)
});
export type ProfileFormData = z.infer<typeof profileSchema>;