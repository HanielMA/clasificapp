import { Book } from '../../domain/models/book.model';

export abstract class BookRepository {
  abstract save(book: Omit<Book, 'id'>): Promise<Book>;
  abstract getAll(): Promise<Book[]>;
  abstract getById(id: string): Promise<Book | null>;
}
