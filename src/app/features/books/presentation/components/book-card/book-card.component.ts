import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon, IonItem, IonLabel, IonThumbnail, IonChip } from '@ionic/angular/standalone';
import { Book } from '../../../domain/models/book.model';
import { addIcons } from 'ionicons';
import { locationOutline, star, bookOutline } from 'ionicons/icons';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon, IonItem, IonLabel, IonThumbnail, IonChip],
  template: `
    <ion-card mode="ios" class="book-card">
      <ion-item lines="none" class="header-item">
        <ion-thumbnail slot="start" class="book-thumb" *ngIf="book.portadaUrl">
          <img [src]="book.portadaUrl" alt="Portada de {{ book.titulo }}" />
        </ion-thumbnail>
        <ion-thumbnail slot="start" class="book-thumb-placeholder" *ngIf="!book.portadaUrl">
          <ion-icon name="book-outline" color="medium" size="large"></ion-icon>
        </ion-thumbnail>
        
        <ion-label>
          <h2 class="book-title">{{ book.titulo }}</h2>
          <p class="book-author"><i>{{ book.autor }}</i></p>
          <ion-chip color="tertiary" outline="true" class="cat-chip">
            <ion-label>{{ book.categoria }}</ion-label>
          </ion-chip>
        </ion-label>
      </ion-item>
      
      <ion-card-content>
        <div class="meta-row">
          <div class="meta-item" *ngIf="book.ubicacion">
            <ion-icon name="location-outline" color="medium"></ion-icon>
            <span>{{ book.ubicacion }}</span>
          </div>
          
          <div class="meta-item stars" *ngIf="book.estrellas">
            <!-- Draw 5 stars logic handled in template simply -->
            <ion-icon name="star" *ngFor="let s of [1,2,3,4,5]" [color]="s <= book.estrellas ? 'warning' : 'medium'"></ion-icon>
          </div>
        </div>
        
        <p class="book-desc" *ngIf="book.descripcion">{{ book.descripcion | slice:0:100 }}...</p>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .book-card { margin-bottom: 16px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); cursor: pointer; }
    .book-thumb, .book-thumb-placeholder { width: 60px; height: 90px; }
    .book-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .book-thumb-placeholder { background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
    .header-item { align-items: flex-start; margin-top: 8px; }
    .book-title { font-weight: 700; font-size: 1.15em; color: var(--ion-color-dark); margin-bottom: 4px; white-space: normal; line-height: 1.2; }
    .book-author { color: var(--ion-color-medium); margin-bottom: 8px; }
    .cat-chip { height: 20px; font-size: 0.7em; margin: 0; }
    
    .meta-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; margin-bottom: 8px; }
    .meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.9em; color: var(--ion-color-medium); }
    .stars ion-icon { font-size: 1.1em; }
    
    .book-desc { font-size: 0.85em; color: var(--ion-color-dark); line-height: 1.4; margin: 0; }
  `]
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;

  constructor() {
    addIcons({ locationOutline, star, bookOutline });
  }
}
