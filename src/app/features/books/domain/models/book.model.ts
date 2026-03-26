export interface Book {
  id: string;
  isbn: string;
  titulo: string;
  autor: string;
  categoria: string;
  portadaUrl?: string;
  descripcion?: string;
  ubicacion?: string;
  estrellas?: number;
}
