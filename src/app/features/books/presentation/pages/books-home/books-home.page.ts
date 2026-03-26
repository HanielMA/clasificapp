import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonList, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { BookService } from '../../../application/services/book.service';
import { Book } from '../../../domain/models/book.model';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { addIcons } from 'ionicons';
import { add, bookOutline } from 'ionicons/icons';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-books-home',
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonList, BookCardComponent, IonButtons, IonMenuButton],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mis Libros</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding" color="light">
      <div *ngIf="books.length === 0" class="empty-state">
        <ion-icon name="book-outline" size="large" color="medium"></ion-icon>
        <p>Aún no tienes libros registrados.</p>
        <ion-button fill="clear" color="primary" routerLink="create">Catalogar Primer Libro</ion-button>
      </div>

      <ion-list lines="none" *ngIf="books.length > 0" style="background: transparent;">
        <app-book-card 
          *ngFor="let book of books" 
          [book]="book"
          (click)="goToDetail(book.id)">
        </app-book-card>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button color="tertiary" routerLink="create">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`
    .empty-state { text-align: center; margin-top: 60px; color: #888; display:flex; flex-direction:column; align-items:center; gap: 12px;}
  `]
})
export class BooksHomePage implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, private router: Router) {
    addIcons({ add, bookOutline });
  }

  async ngOnInit() {
    await this.loadBooks();
  }

  async ionViewWillEnter() {
    await this.loadBooks();
  }

  async loadBooks() {
    this.books = await this.bookService.getBooks();
  }

  goToDetail(id: string) {
    this.router.navigate(['/books', id]);
  }
}
