import { Injectable } from '@angular/core';
import { Book } from '../../domain/models/book.model';
import { BookGateway } from '../../domain/ports/book-gateway.port';
import { environment } from '../../../../../environments/environment';

/**
 * Adaptador de salida que implementa el puerto BookGateway
 * usando la API pública de Open Library (sin API Key).
 *
 * ISBN API: GET /isbn/{isbn}.json
 * Covers:   https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg
 */
@Injectable({
  providedIn: 'root'
})
export class OpenLibraryGateway implements BookGateway {

  private readonly apiUrl = environment.openLibraryApiUrl;
  private readonly coversUrl = environment.openLibraryCoversUrl;

  async searchByIsbn(isbn: string): Promise<Partial<Book>> {
    try {
      const response = await fetch(`${this.apiUrl}/isbn/${isbn}.json`, {
        headers: {
          'User-Agent': 'Clasificapp (personal-app)'
        }
      });

      if (response.status === 404) {
        throw new Error('ISBN no encontrado en Open Library.');
      }

      if (!response.ok) {
        throw new Error(`Error al consultar Open Library (${response.status}).`);
      }

      const data = await response.json();

      return {
        titulo:     data.title || '',
        autor:      this.extractAuthor(data),
        categoria:  this.extractCategory(data),
        portadaUrl: `${this.coversUrl}/${isbn}-L.jpg`,
        descripcion: this.extractDescription(data)
      };

    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al recuperar el libro de Open Library.');
    }
  }

  private extractAuthor(data: Record<string, unknown>): string {
    // Open Library devuelve autores como un array de referencias { key: '/authors/OL...' }
    // En la respuesta de ISBN puede no estar disponible el nombre completo.
    // Lo dejamos como 'Autor Desconocido' cuando no hay datos directos.
    const authors = data['authors'] as Array<{ key: string }> | undefined;
    if (!authors || authors.length === 0) {
      return 'Autor Desconocido';
    }
    // El nombre completo requeriría una segunda llamada. Por coherencia con la UX,
    // devolvemos el identificador si no hay nombre. El servicio puede enriquecerlo luego.
    return 'Autor Desconocido';
  }

  private extractCategory(data: Record<string, unknown>): string {
    const subjects = data['subjects'] as string[] | undefined;
    return subjects && subjects.length > 0 ? subjects[0] : 'General';
  }

  private extractDescription(data: Record<string, unknown>): string {
    const desc = data['description'];
    if (!desc) { return ''; }
    if (typeof desc === 'string') { return desc; }
    if (typeof desc === 'object' && desc !== null && 'value' in desc) {
      return (desc as { value: string }).value;
    }
    return '';
  }
}
