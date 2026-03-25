import { Injectable } from '@angular/core';
import { PlantRepository } from '../../infrastructure/repositories/plant.repository';
import { Plant } from '../../domain/models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  constructor(private plantRepository: PlantRepository) {}

  async createPlant(plantData: Omit<Plant, 'id' | 'fechaRegistro'>): Promise<Plant> {
    if (!plantData.nombre || !plantData.nombreCientifico) {
      throw new Error('El nombre y el nombre científico son obligatorios');
    }
    return this.plantRepository.create(plantData);
  }

  async getPlants(): Promise<Plant[]> {
    const plants = await this.plantRepository.getAll();
    // Default sorting desc by creation date
    return plants.sort((a, b) => b.fechaRegistro - a.fechaRegistro);
  }

  async getPlantById(id: string): Promise<Plant | null> {
    return this.plantRepository.getById(id);
  }

  async filterPlants(filters: { name?: string; startDate?: number; endDate?: number; category?: string }): Promise<Plant[]> {
    let plants = await this.getPlants();

    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      plants = plants.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm) || 
        p.nombreCientifico.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.startDate) {
      plants = plants.filter(p => p.fechaRegistro >= filters.startDate!);
    }

    if (filters.endDate) {
      plants = plants.filter(p => p.fechaRegistro <= filters.endDate!);
    }

    if (filters.category) {
      plants = plants.filter(p => p.categoria === filters.category);
    }

    return plants;
  }
}
