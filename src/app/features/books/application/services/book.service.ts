import { Injectable } from '@angular/core';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { OpenLibraryGateway } from '../../infrastructure/external/open-library.gateway';
import { BookGateway } from '../../domain/ports/book-gateway.port';
import { Book } from '../../domain/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly bookGateway: BookGateway;

  constructor(
    private bookRepository: BookRepository,
    openLibraryGateway: OpenLibraryGateway
  ) {
    // Se inyecta la implementación concreta pero se almacena como el puerto abstracto.
    // En el futuro basta con cambiar esta línea (o usar un token DI) para reemplazar el proveedor.
    this.bookGateway = openLibraryGateway;
  }

  async fetchBookDataFromIsbn(isbn: string): Promise<Partial<Book>> {
    const rawIsbn = isbn.replace(/-/g, '').trim();
    if (!rawIsbn) {
      throw new Error('El ISBN provisto no es válido.');
    }
    return this.bookGateway.searchByIsbn(rawIsbn);
  }

  async saveBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    if (!bookData.titulo || !bookData.isbn) {
      throw new Error('El Título y el ISBN son obligatorios');
    }
    return this.bookRepository.save(bookData);
  }

  async getBooks(): Promise<Book[]> {
    return this.bookRepository.getAll();
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.bookRepository.getById(id);
  }
}
