import { Injectable } from '@angular/core';
import { PlantRepository } from './plant.repository';
import { Plant } from '../../domain/models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStoragePlantRepository implements PlantRepository {
  private readonly STORAGE_KEY = 'clasificapp_plants';

  async create(plantData: Omit<Plant, 'id' | 'fechaRegistro'>): Promise<Plant> {
    const plants = await this.getAll();
    const newPlant: Plant = {
      ...plantData,
      id: crypto.randomUUID(),
      fechaRegistro: Date.now() // Timestamps act as robust dates for serialization
    };
    
    plants.push(newPlant);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plants));
    
    return newPlant;
  }

  async getAll(): Promise<Plant[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<Plant | null> {
    const plants = await this.getAll();
    return plants.find(p => p.id === id) || null;
  }
}
