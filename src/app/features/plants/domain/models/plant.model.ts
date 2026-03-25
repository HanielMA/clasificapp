export interface Plant {
  id: string;
  nombre: string;
  nombreCientifico: string;
  categoria: string;
  familia: string;
  latitud?: number;
  longitud?: number;
  fechaRegistro: number;
  fotos: string[];
}
