export interface GoogleBook {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  sinopse: string;
  capa: string;
}

interface VolumeInfo {
  title?: string;
  authors?: string[];
  categories?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
}

interface GoogleBooksResponse {
  items?: { id: string; volumeInfo: VolumeInfo }[];
}

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Busca livros na Google Books API.
 * Não requer chave de API para buscas simples.
 */
export async function buscarLivrosGoogle(
  query: string,
  maxResults = 12
): Promise<GoogleBook[]> {
  const termo = query.trim();
  if (!termo) return [];

  const url = `${BASE_URL}?q=${encodeURIComponent(termo)}&maxResults=${maxResults}&langRestrict=pt&printType=books`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar livros");
  const data: GoogleBooksResponse = await res.json();

  if (!data.items) return [];

  return data.items.map((item) => {
    const info = item.volumeInfo || {};
    const capa =
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      info.imageLinks?.small ||
      "";

    return {
      id: item.id,
      titulo: info.title?.trim() || "Sem título",
      autor: (info.authors || []).join(", ") || "Autor desconhecido",
      genero: (info.categories || []).slice(0, 2).join(" · ") || "",
      sinopse: (info.description || "").slice(0, 1200),
      // Google retorna http:// — forçamos https:// para evitar mixed content
      capa: capa.replace(/^http:\/\//, "https://")
    };
  });
}

/**
 * Busca apenas por um livro específico pelo ID do Google.
 * Útil para "buscar mais detalhes".
 */
export async function buscarLivroPorId(id: string): Promise<GoogleBook | null> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) return null;
  const item = await res.json();
  const info: VolumeInfo = item.volumeInfo || {};
  const capa = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";
  return {
    id,
    titulo: info.title?.trim() || "Sem título",
    autor: (info.authors || []).join(", ") || "Autor desconhecido",
    genero: (info.categories || []).slice(0, 2).join(" · ") || "",
    sinopse: (info.description || "").slice(0, 1200),
    capa: capa.replace(/^http:\/\//, "https://")
  };
}