import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonChip } from '@ionic/angular/standalone';
import { PlantService } from '../../../application/services/plant.service';
import { Plant } from '../../../domain/models/plant.model';
import { addIcons } from 'ionicons';
import { leafOutline, locationOutline, calendarOutline, listOutline, imageOutline } from 'ionicons/icons';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonChip],
  providers: [DatePipe, DecimalPipe],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/plants"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ plant?.nombre || 'Detalle de Planta' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" color="light">
      <div *ngIf="loading" class="center-spinner">
        <ion-spinner color="success" name="crescent"></ion-spinner>
      </div>

      <div *ngIf="!loading && !plant" class="center-spinner error-state">
        <ion-icon name="leaf-outline" size="large" color="medium"></ion-icon>
        <p>Planta no encontrada.</p>
      </div>

      <div *ngIf="plant" class="detail-container">
        <!-- Carousel / Grid -->
        <div class="photo-container" *ngIf="plant.fotos && plant.fotos.length > 0">
           <img *ngFor="let f of plant.fotos" [src]="f" class="detail-photo" />
        </div>
        
        <div class="photo-placeholder" *ngIf="!plant.fotos || plant.fotos.length === 0">
           <ion-icon name="image-outline" size="large" color="medium"></ion-icon>
           <p>Sin fotos disponibles</p>
        </div>

        <ion-card mode="ios" class="info-card">
          <ion-card-header>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <ion-card-title color="dark">{{ plant.nombre }}</ion-card-title>
                <ion-card-subtitle style="font-size: 1.1em; margin-top: 4px;"><i>{{ plant.nombreCientifico }}</i></ion-card-subtitle>
              </div>
              <ion-chip color="success">
                <ion-label><b>{{ plant.categoria }}</b></ion-label>
              </ion-chip>
            </div>
          </ion-card-header>

          <ion-card-content>
            <ion-list lines="full" class="detail-list">
              <ion-item>
                <ion-icon name="leaf-outline" slot="start" color="tertiary"></ion-icon>
                <ion-label>
                  <h3 class="label-title">Familia</h3>
                  <p class="label-value">{{ plant.familia }}</p>
                </ion-label>
              </ion-item>
              
              <ion-item *ngIf="plant.latitud && plant.longitud">
                <ion-icon name="location-outline" slot="start" color="danger"></ion-icon>
                <ion-label>
                  <h3 class="label-title">Coordenadas de Origen</h3>
                  <p class="label-value">{{ plant.latitud | number:'1.4-4' }}, {{ plant.longitud | number:'1.4-4' }}</p>
                </ion-label>
              </ion-item>
              
              <ion-item>
                <ion-icon name="calendar-outline" slot="start" color="medium"></ion-icon>
                <ion-label>
                  <h3 class="label-title">Fecha de Registro</h3>
                  <p class="label-value">{{ plant.fechaRegistro | date:'medium' }}</p>
                </ion-label>
              </ion-item>
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
    .photo-container { 
      display: flex; overflow-x: auto; scroll-snap-type: x mandatory; width: 100%; height: 280px; background: #eaeaea; scrollbar-width: none;
    }
    .photo-container::-webkit-scrollbar { display: none; }
    .detail-photo { scroll-snap-align: center; min-width: 100%; height: 280px; object-fit: cover; }
    .photo-placeholder { height: 280px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #e0e0e0; color: #777; font-weight: 500; font-size: 1.1em; }
    .info-card { margin: -30px 16px 20px 16px; border-radius: 16px; padding: 10px 0; position: relative; box-shadow: 0 8px 20px rgba(0,0,0,0.12); z-index: 10; }
    .label-title { font-weight: 600; color: var(--ion-color-dark); margin-bottom: 4px; font-size: 1.05em; }
    .label-value { font-size: 1em; color: #555; }
    ion-card-title { font-size: 1.6em; font-weight: bold; }
  `]
})
export class PlantDetailPage implements OnInit {
  plant: Plant | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private plantService: PlantService
  ) {
    addIcons({ leafOutline, locationOutline, calendarOutline, listOutline, imageOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plant = await this.plantService.getPlantById(id);
    }
    this.loading = false;
  }
}
