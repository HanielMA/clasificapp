import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon, IonItem, IonLabel, IonThumbnail } from '@ionic/angular/standalone';
import { Plant } from '../../../domain/models/plant.model';
import { addIcons } from 'ionicons';
import { locationOutline, calendarOutline, leafOutline } from 'ionicons/icons';

@Component({
  selector: 'app-plant-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon, IonItem, IonLabel, IonThumbnail],
  template: `
    <ion-card mode="ios">
      <ion-item>
        <ion-thumbnail slot="start" *ngIf="plant.fotos && plant.fotos.length > 0">
          <img [src]="plant.fotos[0]" alt="Foto de {{ plant.nombre }}" style="object-fit: cover; border-radius: 8px;"/>
        </ion-thumbnail>
        <ion-thumbnail slot="start" *ngIf="!plant.fotos || plant.fotos.length === 0">
          <div style="width: 100%; height: 100%; background: #eaeaea; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            <ion-icon name="leaf-outline" color="medium" size="large"></ion-icon>
          </div>
        </ion-thumbnail>
        <ion-label>
          <h2>{{ plant.nombre }}</h2>
          <p><i>{{ plant.nombreCientifico }}</i></p>
        </ion-label>
      </ion-item>
      
      <ion-card-content>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <ion-icon name="leaf-outline" color="success"></ion-icon>
            <span style="font-size: 0.9em;"><b>Categoría:</b> {{ plant.categoria }} ({{ plant.familia }})</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;" *ngIf="plant.latitud && plant.longitud">
            <ion-icon name="location-outline" color="tertiary"></ion-icon>
            <span style="font-size: 0.9em;"><b>Ubicación:</b> {{ plant.latitud | number:'1.2-2' }}, {{ plant.longitud | number:'1.2-2' }}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <ion-icon name="calendar-outline" color="medium"></ion-icon>
            <span style="font-size: 0.9em;"><b>Registrada:</b> {{ plant.fechaRegistro | date:'shortDate' }}</span>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    ion-card { margin-bottom: 16px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); cursor: pointer; }
    h2 { font-weight: 600; font-size: 1.1em; color: var(--ion-color-dark); }
  `]
})
export class PlantCardComponent {
  @Input({ required: true }) plant!: Plant;

  constructor() {
    addIcons({ locationOutline, calendarOutline, leafOutline });
  }
}
