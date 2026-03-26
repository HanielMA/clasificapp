import { Injectable } from '@angular/core';
import { Book } from '../../domain/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksGateway {
  private readonly API_URL = 'https://www.googleapis.com/books/v1/volumes';

  async searchByIsbn(isbn: string): Promise<Partial<Book>> {
    try {
      const apiKey = 'AIzaSyDdAP1ZXONWfvWaz4g6Dqrgwnmuh63mkpk';
const response = await fetch(`${this.API_URL}?q=isbn:${isbn}&key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Fallo de red al consultar Google Books. Verifica tu conexión.');
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error('ISBN no encontrado en la base de datos externa de Google.');
      }

      const volumeInfo = data.items[0].volumeInfo;

      return {
        titulo: volumeInfo.title || '',
        autor: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor Desconocido',
        categoria: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
        portadaUrl: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || undefined,
        descripcion: volumeInfo.description || ''
      };

    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al recuperar el libro.');
    }
  }
}
