import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonButton, IonDatetime, IonModal, IonButtons, ModalController, IonMenuButton, IonChip, ActionSheetController, ToastController } from '@ionic/angular/standalone';
import { PlantService } from '../../../application/services/plant.service';
import { PlantBackupService } from '../../../application/services/plant-backup.service';
import { Plant } from '../../../domain/models/plant.model';
import { PlantCardComponent } from '../../components/plant-card/plant-card.component';
import { addIcons } from 'ionicons';
import { add, filter, optionsOutline, closeCircle, leafOutline, ellipsisVertical, cloudDownloadOutline, cloudUploadOutline, documentOutline, documentTextOutline } from 'ionicons/icons';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-plants-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonFab, IonFabButton, IonIcon, IonList, PlantCardComponent, IonButton, IonDatetime, IonModal, IonButtons, IonMenuButton, IonChip, IonLabel],
  providers: [ModalController, ActionSheetController, ToastController],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="success">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mis Plantas</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="presentBackupActions()">
            <ion-icon slot="icon-only" name="ellipsis-vertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar color="success" class="search-toolbar">
        <div style="display: flex; align-items: center; width: 100%;">
          <ion-searchbar 
            placeholder="Buscar por nombre..." 
            [debounce]="300" 
            color="light"
            (ionInput)="onSearch($event)"
            style="padding-right: 0;">
          </ion-searchbar>
          <ion-button fill="clear" color="light" id="filter-modal-trigger" class="filter-btn">
            <ion-icon name="options-outline" slot="icon-only" size="large"></ion-icon>
          </ion-button>
        </div>
      </ion-toolbar>

      <ion-toolbar *ngIf="filterDate || filterCategory" class="active-filters" color="light">
        <div class="active-filters-container">
          <ion-chip color="success" *ngIf="filterCategory" (click)="clearCategory()">
            <ion-label>{{ filterCategory }}</ion-label>
            <ion-icon name="close-circle"></ion-icon>
          </ion-chip>
          <ion-chip color="tertiary" *ngIf="filterDate" (click)="clearDate()">
            <ion-label>{{ filterDate | date:'shortDate' }}</ion-label>
            <ion-icon name="close-circle"></ion-icon>
          </ion-chip>
        </div>
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

      <!-- Filtrado Avanzado (Bottom Sheet) -->
      <ion-modal trigger="filter-modal-trigger" #filterModal [initialBreakpoint]="0.65" [breakpoints]="[0, 0.65, 0.9]">
        <ng-template>
          <ion-content class="ion-padding">
            <h2 style="margin-top: 5px; font-weight: bold;">Filtros Avanzados</h2>
            
            <h3 class="filter-section-title">Categoría</h3>
            <div class="chip-group">
              <ion-chip [outline]="tempCategory !== 'Ornatu'" color="success" (click)="tempCategory = 'Ornatu'">Ornatu</ion-chip>
              <ion-chip [outline]="tempCategory !== 'Medicinal'" color="success" (click)="tempCategory = 'Medicinal'">Medicinal</ion-chip>
              <ion-chip [outline]="tempCategory !== 'Alimenticia'" color="success" (click)="tempCategory = 'Alimenticia'">Alimenticia</ion-chip>
              <ion-chip [outline]="tempCategory !== 'Otra'" color="success" (click)="tempCategory = 'Otra'">Otra</ion-chip>
            </div>

            <h3 class="filter-section-title" style="margin-top: 24px;">Fecha Mínima de Registro</h3>
            <ion-datetime 
              presentation="date" 
              (ionChange)="onDateFilterChange($event)"
              [preferWheel]="true"
              style="margin: 0 auto;"
              [value]="tempDateString">
            </ion-datetime>

            <div class="filter-actions">
               <ion-button expand="block" color="medium" fill="outline" style="flex: 1;" (click)="clearAllFilters(filterModal)">Limpiar</ion-button>
               <ion-button expand="block" color="success" style="flex: 1;" (click)="applyFilters(filterModal)">Aplicar</ion-button>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>

      <!-- Input invisible para importar CSV -->
      <input type="file" #fileInput accept=".csv" style="display: none;" (change)="onFileSelected($event)">
    </ion-content>
  `,
  styles: [`
    .empty-state { text-align: center; margin-top: 60px; color: #888; display:flex; flex-direction:column; align-items:center; gap: 12px;}
    .search-toolbar { padding-bottom: 4px; }
    .filter-btn { margin-right: 8px; margin-left: 0; }
    .active-filters { border-bottom: 1px solid #e0e0e0; }
    .active-filters-container { display: flex; overflow-x: auto; padding: 4px 16px; scrollbar-width: none; }
    .active-filters-container::-webkit-scrollbar { display: none; }
    .filter-section-title { color: var(--ion-color-medium); font-size: 0.85em; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
    .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
    .filter-actions { margin-top: 24px; display: flex; gap: 12px; padding-bottom: 24px; }
  `]
})
export class PlantsHomePage implements OnInit {
  plants: Plant[] = [];
  searchTerm: string = '';
  
  filterCategory?: string;
  filterDate?: number;

  tempCategory?: string;
  tempDate?: number;
  tempDateString?: string;

  constructor(
    private plantService: PlantService, 
    private plantBackupService: PlantBackupService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    addIcons({ add, filter, optionsOutline, closeCircle, leafOutline, ellipsisVertical, cloudDownloadOutline, cloudUploadOutline, documentOutline, documentTextOutline });
  }

  async ngOnInit() {
    await this.loadPlants();
  }

  async ionViewWillEnter() {
    await this.loadPlants();
  }

  async loadPlants() {
    this.plants = await this.plantService.filterPlants({ 
      name: this.searchTerm,
      startDate: this.filterDate ? new Date(this.filterDate).setHours(0,0,0,0) : undefined,
      endDate: this.filterDate ? new Date(this.filterDate).setHours(23,59,59,999) : undefined,
      category: this.filterCategory
    });
  }

  async onSearch(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    await this.loadPlants();
  }

  onDateFilterChange(event: any) {
    const dateStr = event.detail.value;
    if (dateStr) {
      this.tempDateString = dateStr;
      this.tempDate = new Date(dateStr).getTime();
    }
  }

  async applyFilters(modal: any) {
    this.filterCategory = this.tempCategory;
    this.filterDate = this.tempDate;
    await this.loadPlants();
    modal.dismiss();
  }

  async clearAllFilters(modal: any) {
    this.tempCategory = undefined;
    this.tempDate = undefined;
    this.tempDateString = undefined;
    
    this.filterCategory = undefined;
    this.filterDate = undefined;
    
    await this.loadPlants();
    modal.dismiss();
  }

  async clearCategory() {
    this.filterCategory = undefined;
    this.tempCategory = undefined;
    await this.loadPlants();
  }

  async clearDate() {
    this.filterDate = undefined;
    this.tempDate = undefined;
    this.tempDateString = undefined;
    await this.loadPlants();
  }

  goToDetail(id: string) {
    this.router.navigate(['/plants', id]);
  }

  async presentBackupActions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Copias de Seguridad',
      buttons: [
        {
          text: 'Exportar a CSV',
          icon: 'document-text-outline',
          handler: () => {
            this.exportCsv();
          }
        },
        {
          text: 'Exportar a PDF',
          icon: 'document-outline',
          handler: () => {
            this.exportPdf();
          }
        },
        {
          text: 'Importar desde CSV',
          icon: 'cloud-upload-outline',
          handler: () => {
            // Trigger file input click
            document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async exportCsv() {
    try {
      await this.plantBackupService.exportToCsv();
      this.showToast('Exportación CSV completada con éxito', 'success');
    } catch (error: any) {
      this.showToast(error.message, 'danger');
    }
  }

  async exportPdf() {
    try {
      await this.plantBackupService.exportToPdf();
      this.showToast('Exportación PDF completada con éxito', 'success');
    } catch (error: any) {
      this.showToast(error.message, 'danger');
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset file input so we can trigger the same file again if needed
    event.target.value = '';

    try {
      const count = await this.plantBackupService.importFromCsv(file);
      this.showToast(`Importación completada: ${count} plantas añadidas`, 'success');
      await this.loadPlants();
    } catch (error: any) {
      this.showToast(error.message, 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
