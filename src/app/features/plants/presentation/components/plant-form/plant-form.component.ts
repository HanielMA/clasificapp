import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlantService } from '../../../application/services/plant.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonNote, IonSelect, IonSelectOption, IonText, IonModal } from '@ionic/angular/standalone';
import { MapPickerComponent } from '../../../../../shared/components/map-picker/map-picker.component';
import { addIcons } from 'ionicons';
import { saveOutline, cameraOutline, closeCircleOutline, mapOutline } from 'ionicons/icons';

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonNote, IonSelect, IonSelectOption, IonText, IonModal, MapPickerComponent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/plants"></ion-back-button>
        </ion-buttons>
        <ion-title>Añadir Planta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding" color="light">
      <form [formGroup]="plantForm" (ngSubmit)="onSubmit()">
        <ion-list lines="full" inset="true" class="custom-list">
          <ion-item>
            <ion-label position="stacked">Nombre Común <ion-text color="danger">*</ion-text></ion-label>
            <ion-input type="text" formControlName="nombre" placeholder="Ej: Rosal"></ion-input>
          </ion-item>
          <ion-note color="danger" *ngIf="plantForm.get('nombre')?.invalid && plantForm.get('nombre')?.touched" class="ion-padding-start">
            El nombre es obligatorio.
          </ion-note>

          <ion-item>
            <ion-label position="stacked">Nombre Científico <ion-text color="danger">*</ion-text></ion-label>
            <ion-input type="text" formControlName="nombreCientifico" placeholder="Ej: Rosa rubiginosa"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Categoría <ion-text color="danger">*</ion-text></ion-label>
            <ion-select formControlName="categoria" placeholder="Selecciona una">
              <ion-select-option value="Ornatu">Ornatu</ion-select-option>
              <ion-select-option value="Medicinal">Medicinal</ion-select-option>
              <ion-select-option value="Alimenticia">Alimenticia</ion-select-option>
              <ion-select-option value="Otra">Otra</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Familia <ion-text color="danger">*</ion-text></ion-label>
            <ion-input type="text" formControlName="familia" placeholder="Ej: Rosaceae"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Latitud y Longitud</ion-label>
            <div class="location-box">
              <span *ngIf="plantForm.get('latitud')?.value" class="coords">{{ plantForm.get('latitud')?.value | number:'1.4-4' }}, {{ plantForm.get('longitud')?.value | number:'1.4-4' }}</span>
              <span *ngIf="!plantForm.get('latitud')?.value" class="placeholder-text">Ninguna ubicación fijada</span>
              <ion-button size="small" fill="outline" color="success" (click)="openMapModal()" style="margin-left:auto;">
                <ion-icon slot="start" name="map-outline"></ion-icon>
                Fijar / Ver
              </ion-button>
            </div>
          </ion-item>
        </ion-list>

        <div class="ion-padding-horizontal ion-padding-bottom">
          <input type="file" accept="image/*" multiple #fileInput style="display: none;" (change)="onFileSelected($event)">
          <ion-button expand="block" fill="outline" color="medium" (click)="fileInput.click()" type="button" class="photo-btn">
            <ion-icon slot="start" name="camera-outline"></ion-icon>
            Añadir Foto(s)
          </ion-button>
          
          <div *ngIf="fotos.length > 0" class="photo-grid">
            <div *ngFor="let f of fotos; let i = index" class="photo-item">
               <img [src]="f" />
               <ion-icon name="close-circle-outline" color="danger" (click)="removePhoto(i)"></ion-icon>
            </div>
          </div>
        </div>

        <div class="ion-padding">
          <ion-button expand="block" type="submit" [disabled]="plantForm.invalid" color="success" class="submit-btn" shape="round">
            <ion-icon slot="start" name="save-outline"></ion-icon>
            Guardar Planta
          </ion-button>
        </div>
      </form>

      <!-- Map Modal -->
      <ion-modal [isOpen]="isMapModalOpen" (didDismiss)="closeMapModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="dark">
              <ion-buttons slot="end">
                <ion-button (click)="closeMapModal()">Cancelar</ion-button>
              </ion-buttons>
              <ion-title>Fijar Ubicación</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <app-map-picker 
              [initialLat]="plantForm.get('latitud')?.value || undefined"
              [initialLng]="plantForm.get('longitud')?.value || undefined"
              (locationSelected)="onLocationSelected($event)">
            </app-map-picker>
          </ion-content>
        </ng-template>
      </ion-modal>

    </ion-content>
  `,
  styles: [`
    ion-note { display: block; font-size: 0.8em; margin-top: 4px; }
    .custom-list { border-radius: 12px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .photo-btn { margin-top: 10px; }
    .photo-grid { display: flex; gap: 8px; margin-top: 16px; overflow-x: auto; padding-bottom: 8px; }
    .photo-item { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
    .photo-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .photo-item ion-icon { position: absolute; top: -8px; right: -8px; font-size: 24px; background: white; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .submit-btn { margin-top: 10px; height: 50px; font-weight: 600; }
    .location-box { display: flex; align-items: center; width: 100%; margin-top: 8px; margin-bottom: 8px; min-height: 40px; }
    .coords { font-weight: 600; font-size: 0.9em; color: var(--ion-color-dark); }
    .placeholder-text { color: #888; font-size: 0.9em; font-style: italic; }
  `]
})
export class PlantFormComponent {
  plantForm: FormGroup;
  fotos: string[] = [];
  isMapModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService,
    private router: Router
  ) {
    addIcons({ saveOutline, cameraOutline, closeCircleOutline, mapOutline });
    this.plantForm = this.fb.group({
      nombre: ['', Validators.required],
      nombreCientifico: ['', Validators.required],
      categoria: ['', Validators.required],
      familia: ['', Validators.required],
      latitud: [null],
      longitud: [null]
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fotos.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = ''; // Reset input to allow selecting same file again
  }

  removePhoto(index: number) {
    this.fotos.splice(index, 1);
  }

  async onSubmit() {
    if (this.plantForm.valid) {
      try {
        await this.plantService.createPlant({
          ...this.plantForm.value,
          fotos: this.fotos
        });
        this.router.navigate(['/plants']);
      } catch (error) {
        console.error('Error creando planta:', error);
      }
    }
  }

  openMapModal() {
    this.isMapModalOpen = true;
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }

  onLocationSelected(coords: {lat: number, lng: number}) {
    this.plantForm.patchValue({
      latitud: coords.lat,
      longitud: coords.lng
    });
    this.closeMapModal();
  }
}
