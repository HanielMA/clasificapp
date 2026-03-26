import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../application/services/book.service';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonSpinner, IonRange, IonToast, IonText, IonTextarea, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, searchCircle, star, barcodeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonSpinner, IonRange, IonToast, IonText, IonTextarea, IonModal],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/books"></ion-back-button>
        </ion-buttons>
        <ion-title>Añadir Libro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding" color="light">
      
      <!-- API Search Panel -->
      <div class="search-panel">
        <p style="font-size:0.9em; color:#555; text-align:center;">Introduce el ISBN para recuperar datos reales de Google Books:</p>
        <ion-item lines="none" class="isbn-input">
           <ion-input type="text" placeholder="Ej: 9788498387087" [(ngModel)]="searchIsbn"></ion-input>
           
           <ion-button slot="end" (click)="openScanner()" color="secondary" shape="round">
              <ion-icon slot="icon-only" name="barcode-outline"></ion-icon>
           </ion-button>

           <ion-button slot="end" (click)="searchGoogleBooks()" [disabled]="searching" color="tertiary" shape="round">
              <ion-icon slot="icon-only" name="search-circle" *ngIf="!searching"></ion-icon>
              <ion-spinner name="crescent" *ngIf="searching"></ion-spinner>
           </ion-button>
        </ion-item>
      </div>

      <form [formGroup]="bookForm" (ngSubmit)="onSubmit()">
        <ion-list lines="full" inset="true" class="custom-list">
          <ion-item>
            <ion-label position="stacked">ISBN <ion-text color="danger">*</ion-text></ion-label>
            <ion-input type="text" formControlName="isbn"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Título <ion-text color="danger">*</ion-text></ion-label>
            <ion-input type="text" formControlName="titulo"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Autor(es) <ion-text color="danger">*</ion-text></ion-label>
            <ion-input type="text" formControlName="autor"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Categoría / Género</ion-label>
            <ion-input type="text" formControlName="categoria"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Ubicación Física</ion-label>
            <ion-input type="text" formControlName="ubicacion" placeholder="Ej: Estantería 3, Pasillo A"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Valoración (Estrellas)</ion-label>
            <ion-range formControlName="estrellas" min="1" max="5" step="1" snaps="true" ticks="true" color="warning" style="padding-top: 16px;">
               <ion-icon size="small" slot="start" name="star" color="medium"></ion-icon>
               <ion-icon slot="end" name="star" color="warning"></ion-icon>
            </ion-range>
          </ion-item>
          
          <ion-item>
            <ion-label position="stacked">Sinopsis</ion-label>
            <ion-textarea formControlName="descripcion" [autoGrow]="true" rows="4"></ion-textarea>
          </ion-item>
          
          <ion-item *ngIf="bookForm.get('portadaUrl')?.value" lines="none">
             <div class="preview-area">
                <img [src]="bookForm.get('portadaUrl')?.value" alt="Portada recuperada" />
             </div>
          </ion-item>
        </ion-list>

        <div class="ion-padding">
          <ion-button expand="block" type="submit" [disabled]="bookForm.invalid" color="primary" class="submit-btn" shape="round">
            <ion-icon slot="start" name="save-outline"></ion-icon>
            Guardar Libro
          </ion-button>
        </div>
      </form>
      
      <!-- Modal Scanner -->
      <ion-modal [isOpen]="isScannerOpen" (didDismiss)="closeScanner()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="dark">
              <ion-buttons slot="end">
                <ion-button (click)="closeScanner()">Cerrar</ion-button>
              </ion-buttons>
              <ion-title>Escanear Código</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding" color="dark">
             <div id="reader" width="100%"></div>
          </ion-content>
        </ng-template>
      </ion-modal>

      <ion-toast
        [isOpen]="toastOpen"
        [message]="toastMsg"
        [duration]="3000"
        (didDismiss)="toastOpen = false"
        color="danger">
      </ion-toast>
      
    </ion-content>
  `,
  styles: [`
    .search-panel { background: white; border-radius: 12px; padding: 12px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .isbn-input { --background: transparent; border: 1px solid #ccc; border-radius: 8px; margin-top: 8px;}
    .custom-list { border-radius: 12px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .submit-btn { height: 50px; font-weight: 600; }
    .preview-area { width: 100%; text-align: center; padding: 12px; }
    .preview-area img { max-height: 180px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  `]
})
export class BookFormComponent {
  bookForm: FormGroup;
  searchIsbn: string = '';
  searching = false;
  toastOpen = false;
  toastMsg = '';
  
  isScannerOpen = false;
  html5QrcodeScanner: any = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {
    addIcons({ saveOutline, searchCircle, star, barcodeOutline });
    this.bookForm = this.fb.group({
      isbn: ['', Validators.required],
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      categoria: [''],
      ubicacion: [''],
      estrellas: [3],
      portadaUrl: [''],
      descripcion: ['']
    });
  }

  async searchGoogleBooks() {
    if (!this.searchIsbn) return;
    this.searching = true;
    try {
      const result = await this.bookService.fetchBookDataFromIsbn(this.searchIsbn);
      this.bookForm.patchValue({
        isbn: this.searchIsbn,
        titulo: result.titulo || '',
        autor: result.autor || '',
        categoria: result.categoria || '',
        portadaUrl: result.portadaUrl || '',
        descripcion: result.descripcion || ''
      });
    } catch (e: any) {
      this.toastMsg = e.message || 'Error al buscar el libro';
      this.toastOpen = true;
    } finally {
      this.searching = false;
    }
  }

  openScanner() {
    this.isScannerOpen = true;
    setTimeout(() => {
      // Optimizamos el escáner para rendir al máximo
      this.html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10,
          // Eliminamos el qrbox para que analice toda la pantalla (100% video feed).
          // Eliminamos los formatos restrictivos para que intente procesar con todos sus algoritmos disponibles.
          videoConstraints: {
            facingMode: 'environment' // Forzar cámara principal con autoenfoque si el dispositivo tiene varias
          }
        },
        false
      );
      this.html5QrcodeScanner.render(
        (decodedText: string) => {
          console.log('¡CÓDIGO ENCONTRADO! 👉', decodedText);
          this.searchIsbn = decodedText;
          this.closeScanner();
          this.searchGoogleBooks(); // Auto-search on successful scan
        },
        (errorMessage: string) => {
          // Imprime por consola CADA VEZ que intenta leer un fotograma y falla
          console.log('Escaneando fotograma...', errorMessage);
        }
      );
    }, 400);
  }

  closeScanner() {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear().catch((e: any) => console.error(e));
      this.html5QrcodeScanner = null;
    }
    this.isScannerOpen = false;
  }

  async onSubmit() {
    if (this.bookForm.valid) {
      try {
        await this.bookService.saveBook(this.bookForm.value);
        this.router.navigate(['/books']);
      } catch (error) {
        console.error('Error guardando libro:', error);
      }
    }
  }
}
