import { Plant } from '../../domain/models/plant.model';

export abstract class PlantRepository {
  abstract create(plant: Omit<Plant, 'id' | 'fechaRegistro'>): Promise<Plant>;
  abstract getAll(): Promise<Plant[]>;
  abstract getById(id: string): Promise<Plant | null>;
}
