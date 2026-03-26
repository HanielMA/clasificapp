import { Component, OnInit, OnDestroy, Output, EventEmitter, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locate, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonFab, IonFabButton],
  template: `
    <div class="map-container">
      <div #map id="mapPicker" style="height: 100%; width: 100%;"></div>
      
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" style="margin-bottom: 70px; margin-right: 16px;">
        <ion-fab-button color="light" (click)="locateDevice()">
          <ion-icon name="locate" color="primary"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <div class="action-footer">
         <p class="helper-text" *ngIf="!selectedLat">Toca en el mapa para fijar tu ubicación</p>
         <ion-button expand="block" color="success" [disabled]="!selectedLat" (click)="confirmSelection()" shape="round">
            <ion-icon slot="start" name="checkmark-circle"></ion-icon>
            Confirmar Ubicación
         </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .map-container { position: relative; width: 100%; height: 100%; z-index: 1; }
    .action-footer { position: absolute; bottom: 16px; left: 16px; right: 16px; z-index: 1000; display:flex; flex-direction:column; gap:8px; pointer-events: none;}
    .action-footer ion-button { pointer-events: auto; }
    .helper-text { background: rgba(0,0,0,0.65); color: white; padding: 6px 16px; border-radius: 20px; text-align: center; margin: 0 auto; font-size: 0.85em; pointer-events: auto; box-shadow: 0 4px 10px rgba(0,0,0,0.2);}
  `]
})
export class MapPickerComponent implements OnInit, OnDestroy {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  @Input() initialLat?: number;
  @Input() initialLng?: number;
  @Output() locationSelected = new EventEmitter<{lat: number, lng: number}>();
  
  private map!: L.Map;
  private marker?: L.Marker;
  selectedLat?: number;
  selectedLng?: number;

  constructor() {
    addIcons({ locate, checkmarkCircle });
  }

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    const lat = this.initialLat ?? 40.4168; // Center of Spain default
    const lng = this.initialLng ?? -3.7038;
    const zoom = this.initialLat ? 16 : 5;

    this.map = L.map(this.mapElement.nativeElement, { zoomControl: false }).setView([lat, lng], zoom);
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Bypass Asset routing with pure SVG DivIcons
    const customIcon = L.divIcon({
      html: `<svg viewBox="0 0 24 24" fill="#e22a2a" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.4));">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
             </svg>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    L.Marker.prototype.options.icon = customIcon;

    if (this.initialLat && this.initialLng) {
      this.selectedLat = this.initialLat;
      this.selectedLng = this.initialLng;
      this.marker = L.marker([this.initialLat, this.initialLng]).addTo(this.map);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLng = e.latlng.lng;
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });

    // Fix render bug on Modals
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  locateDevice() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.selectedLat = position.coords.latitude;
          this.selectedLng = position.coords.longitude;
          const latlng: L.LatLngTuple = [this.selectedLat, this.selectedLng];
          this.map.flyTo(latlng, 16);
          if (this.marker) {
            this.marker.setLatLng(latlng);
          } else {
            this.marker = L.marker(latlng).addTo(this.map);
          }
        },
        (error) => {
          alert('Error: Asegúrate de dar permisos de GPS al navegador.');
        },
        { enableHighAccuracy: true }
      );
    }
  }

  confirmSelection() {
    if (this.selectedLat && this.selectedLng) {
      this.locationSelected.emit({ lat: this.selectedLat, lng: this.selectedLng });
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
