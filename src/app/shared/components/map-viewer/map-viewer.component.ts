import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `<div #map id="mapViewer" style="height: 100%; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); z-index: 1;"></div>`
})
export class MapViewerComponent implements OnInit, OnDestroy {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  @Input({ required: true }) lat!: number;
  @Input({ required: true }) lng!: number;
  @Input() zoom: number = 15;
  @Input() popupText?: string;
  
  private map!: L.Map;

  ngOnInit() {
    this.initMap();
  }

  private initMap() {
    // Disable zooming/panning to prevent scroll hijacking on mobile pages
    this.map = L.map(this.mapElement.nativeElement, {
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false
    }).setView([this.lat, this.lng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OSM'
    }).addTo(this.map);

    const customIcon = L.divIcon({
      html: `<svg viewBox="0 0 24 24" fill="#e22a2a" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.4));">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
             </svg>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const marker = L.marker([this.lat, this.lng], { icon: customIcon }).addTo(this.map);
    
    if (this.popupText) {
      marker.bindPopup(`<b>${this.popupText}</b>`).openPopup();
    }

    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
