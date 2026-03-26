import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonChip } from '@ionic/angular/standalone';
import { BookService } from '../../../application/services/book.service';
import { Book } from '../../../domain/models/book.model';
import { addIcons } from 'ionicons';
import { bookOutline, locationOutline, star, personOutline, gridOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonChip],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/books"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle de Libro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" color="light">
      <div *ngIf="loading" class="center-spinner">
        <ion-spinner color="primary" name="crescent"></ion-spinner>
      </div>

      <div *ngIf="!loading && !book" class="center-spinner error-state">
        <ion-icon name="book-outline" size="large" color="medium"></ion-icon>
        <p>Libro no encontrado.</p>
      </div>

      <div *ngIf="book" class="detail-container">
        <div class="cover-backdrop">
           <div class="cover-wrapper">
             <img *ngIf="book.portadaUrl" [src]="book.portadaUrl" class="detail-cover" />
             <div *ngIf="!book.portadaUrl" class="cover-placeholder">
                <ion-icon name="book-outline"></ion-icon>
             </div>
           </div>
        </div>

        <ion-card mode="ios" class="info-card">
          <ion-card-header style="text-align: center;">
            <ion-card-title color="dark" class="mt-1">{{ book.titulo }}</ion-card-title>
            <div style="display:flex; justify-content: center; align-items:center; gap: 4px; margin-top: 8px;">
               <ion-icon name="star" *ngFor="let s of [1,2,3,4,5]" [color]="s <= (book.estrellas || 0) ? 'warning' : 'medium'"></ion-icon>
            </div>
            <ion-chip color="primary" *ngIf="book.categoria" style="margin-top:12px;">
              <ion-label><b>{{ book.categoria }}</b></ion-label>
            </ion-chip>
          </ion-card-header>

          <ion-card-content>
            <ion-list lines="full" class="detail-list">
              <ion-item>
                <ion-icon name="person-outline" slot="start" color="tertiary"></ion-icon>
                <ion-label>
                  <h3 class="label-title">Autor(es)</h3>
                  <p class="label-value">{{ book.autor }}</p>
                </ion-label>
              </ion-item>
              
              <ion-item>
                <ion-icon name="grid-outline" slot="start" color="success"></ion-icon>
                <ion-label>
                  <h3 class="label-title">ISBN</h3>
                  <p class="label-value">{{ book.isbn }}</p>
                </ion-label>
              </ion-item>

              <ion-item *ngIf="book.ubicacion">
                <ion-icon name="location-outline" slot="start" color="danger"></ion-icon>
                <ion-label>
                  <h3 class="label-title">Ubicación Física</h3>
                  <p class="label-value">{{ book.ubicacion }}</p>
                </ion-label>
              </ion-item>
              
              <div class="desc-box" *ngIf="book.descripcion">
                 <div class="desc-header">
                   <ion-icon name="information-circle-outline" color="medium"></ion-icon>
                   <span>Sinopsis</span>
                 </div>
                 <p [innerHTML]="book.descripcion"></p>
              </div>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .center-spinner { display: flex; justify-content: center; align-items: center; height: 50vh; }
    .error-state { flex-direction: column; color: #888; font-size: 1.1em; }
    .detail-container { position: relative; }
    
    .cover-backdrop { width: 100%; height: 260px; background: linear-gradient(180deg, #3880ff 0%, #3171e0 100%); display: flex; justify-content: center; align-items: center; }
    .cover-wrapper { width: 130px; height: 190px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); border-radius: 6px; overflow: hidden; background: white; }
    .detail-cover { width: 100%; height: 100%; object-fit: cover; }
    .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e0e0e0; }
    .cover-placeholder ion-icon { font-size: 60px; color: #aaa; }
    
    .info-card { margin: -30px 16px 20px 16px; border-radius: 16px; padding: 10px 0; position: relative; box-shadow: 0 8px 20px rgba(0,0,0,0.12); z-index: 10; }
    .label-title { font-weight: 600; color: var(--ion-color-dark); margin-bottom: 4px; font-size: 1.05em; }
    .label-value { font-size: 1em; color: #555; }
    ion-card-title { font-size: 1.6em; font-weight: bold; }
    .mt-1 { margin-top: 8px; }
    
    .desc-box { padding: 16px; background: #f9f9f9; border-radius: 12px; margin: 16px; border: 1px solid #eee; }
    .desc-header { display: flex; align-items: center; gap: 6px; font-weight: 700; color: #666; margin-bottom: 8px; text-transform: uppercase; font-size: 0.85em; }
    .desc-box p { font-size: 0.95em; line-height: 1.5; color: #444; margin: 0; }
  `]
})
export class BookDetailPage implements OnInit {
  book: Book | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {
    addIcons({ bookOutline, locationOutline, star, personOutline, gridOutline, informationCircleOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.book = await this.bookService.getBookById(id);
    }
    this.loading = false;
  }
}
