import { Injectable } from '@angular/core';
import { BookRepository } from './book.repository';
import { Book } from '../../domain/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageBookRepository implements BookRepository {
  private readonly STORAGE_KEY = 'clasificapp_books';

  async save(bookData: Omit<Book, 'id'>): Promise<Book> {
    const books = await this.getAll();
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID()
    };
    
    books.push(newBook);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    
    return newBook;
  }

  async getAll(): Promise<Book[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<Book | null> {
    const books = await this.getAll();
    return books.find(b => b.id === id) || null;
  }
}
