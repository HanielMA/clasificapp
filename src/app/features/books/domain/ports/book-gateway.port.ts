import { Book } from '../models/book.model';

/**
 * Puerto de salida (driven port) que define el contrato para
 * obtener información de libros desde una fuente de datos externa.
 * Cualquier proveedor externo (Google Books, Open Library, etc.)
 * debe implementar esta interfaz.
 */
export interface BookGateway {
  searchByIsbn(isbn: string): Promise<Partial<Book>>;
}
