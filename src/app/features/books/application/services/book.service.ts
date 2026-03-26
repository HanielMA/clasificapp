import { Injectable } from '@angular/core';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { GoogleBooksGateway } from '../../infrastructure/external/google-books.gateway';
import { Book } from '../../domain/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(
    private bookRepository: BookRepository,
    private googleBooksGateway: GoogleBooksGateway
  ) {}

  async fetchBookDataFromIsbn(isbn: string): Promise<Partial<Book>> {
    const rawIsbn = isbn.replace(/-/g, '').trim();
    if (!rawIsbn) {
      throw new Error('El ISBN provisto no es válido.');
    }
    return this.googleBooksGateway.searchByIsbn(rawIsbn);
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
