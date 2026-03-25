import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonButton, IonDatetime, IonModal, IonButtons, ModalController, IonMenuButton } from '@ionic/angular/standalone';
import { PlantService } from '../../../application/services/plant.service';
import { Plant } from '../../../domain/models/plant.model';
import { PlantCardComponent } from '../../components/plant-card/plant-card.component';
import { addIcons } from 'ionicons';
import { add, filter } from 'ionicons/icons';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-plants-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, IonFabButton, IonIcon, IonList, PlantCardComponent, IonButton, IonDatetime, IonModal, IonButtons, IonMenuButton],
  providers: [ModalController],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mis Plantas</ion-title>
        <ion-buttons slot="end">
          <ion-button id="filter-modal-trigger">
            <ion-icon slot="icon-only" name="filter"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="success">
        <ion-searchbar 
          placeholder="Buscar por nombre..." 
          [debounce]="300" 
          color="light"
          (ionInput)="onSearch($event)">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding" color="light">
      <div *ngIf="plants.length === 0" class="empty-state">
        <ion-icon name="leaf-outline" size="large" color="medium"></ion-icon>
        <p>No se encontraron plantas.</p>
        <ion-button fill="clear" color="success" routerLink="create">Añadir Primera Planta</ion-button>
      </div>

      <ion-list lines="none" *ngIf="plants.length > 0" style="background: transparent;">
        <app-plant-card 
          *ngFor="let plant of plants" 
          [plant]="plant"
          (click)="goToDetail(plant.id)">
        </app-plant-card>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button color="tertiary" routerLink="create">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Filtrado por fecha -->
      <ion-modal trigger="filter-modal-trigger" #filterModal [initialBreakpoint]="0.6" [breakpoints]="[0, 0.6, 1]">
        <ng-template>
          <div class="block">
            <h2 class="ion-padding" style="margin:0; text-align: center; font-weight: bold; padding-bottom: 0;">Filtrar por Fecha de Registro</h2>
            <ion-datetime 
              presentation="date" 
              (ionChange)="onDateFilterChange($event, filterModal)"
              [preferWheel]="true"
              style="margin: 0 auto;">
            </ion-datetime>
            <div class="ion-padding" style="width: 100%;">
               <ion-button expand="block" color="medium" fill="outline" (click)="clearDateFilter(filterModal)">Limpiar Filtro</ion-button>
            </div>
          </div>
        </ng-template>
      </ion-modal>

    </ion-content>
  `,
  styles: [`
    .empty-state { text-align: center; margin-top: 60px; color: #888; display:flex; flex-direction:column; align-items:center; gap: 12px;}
    .block {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class PlantsHomePage implements OnInit {
  plants: Plant[] = [];
  searchTerm: string = '';
  filterDate?: number;

  constructor(private plantService: PlantService, private router: Router) {
    addIcons({ add, filter });
  }

  async ngOnInit() {
    await this.loadPlants();
  }

  async ionViewWillEnter() {
    // Recarga las plantas al entrar por si se ha añadido una
    await this.loadPlants();
  }

  async loadPlants() {
    this.plants = await this.plantService.filterPlants({ 
      name: this.searchTerm,
      startDate: this.filterDate ? new Date(this.filterDate).setHours(0,0,0,0) : undefined,
      endDate: this.filterDate ? new Date(this.filterDate).setHours(23,59,59,999) : undefined
    });
  }

  async onSearch(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    await this.loadPlants();
  }

  async onDateFilterChange(event: any, modal: any) {
    const dateStr = event.detail.value;
    if (dateStr) {
      this.filterDate = new Date(dateStr).getTime();
      await this.loadPlants();
      modal.dismiss();
    }
  }

  async clearDateFilter(modal: any) {
    this.filterDate = undefined;
    await this.loadPlants();
    modal.dismiss();
  }

  goToDetail(id: string) {
    this.router.navigate(['/plants', id]);
  }
}
