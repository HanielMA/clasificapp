import { Injectable } from '@angular/core';
import { PlantService } from './plant.service';
import { Plant } from '../../domain/models/plant.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PlantBackupService {
  constructor(private plantService: PlantService) {}

  async exportToCsv(): Promise<void> {
    const plants = await this.plantService.getPlants();
    if (plants.length === 0) {
      throw new Error('No hay plantas para exportar.');
    }

    const header = ['id', 'nombre', 'nombreCientifico', 'categoria', 'familia', 'latitud', 'longitud', 'fechaRegistro'];
    const csvRows = [];
    csvRows.push(header.join(','));

    for (const plant of plants) {
      const values = header.map(fieldName => {
        let value = (plant as any)[fieldName];
        // Handle undefined or null
        if (value === undefined || value === null) {
          value = '';
        }
        // Escape quotes and commas
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    this.downloadFile(csvString, 'backup_plantas.csv', 'text/csv');
  }

  async exportToPdf(): Promise<void> {
    const plants = await this.plantService.getPlants();
    if (plants.length === 0) {
      throw new Error('No hay plantas para exportar.');
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Catálogo de Plantas', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const dateStr = new Date().toLocaleDateString();
    doc.text(`Generado el: ${dateStr}`, 14, 30);

    // Table Data
    const tableColumn = ["Nombre", "Nombre Científico", "Categoría", "Familia", "Fecha Registro"];
    const tableRows = plants.map(p => [
      p.nombre,
      p.nombreCientifico,
      p.categoria,
      p.familia,
      new Date(p.fechaRegistro).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 167, 69] } // Success color to match app
    });

    doc.save('backup_plantas.pdf');
  }

  async importFromCsv(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (!text) {
          return reject(new Error('Archivo CSV vacío.'));
        }

        try {
          // Un simple parseo de CSV
          const lines = text.split('\n').filter(line => line.trim() !== '');
          if (lines.length < 2) {
             return reject(new Error('El archivo no tiene suficientes datos.'));
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          
          let count = 0;
          for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i];
            // Match pattern for comma separated fields, allowing quotes (basic parser)
            const obj: any = {};
            const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
            const values = currentLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            for (let j = 0; j < headers.length; j++) {
              let val = values[j] ? values[j].trim() : '';
              if (val.startsWith('"') && val.endsWith('"')) {
                 val = val.substring(1, val.length - 1).replace(/""/g, '"');
              }
              obj[headers[j]] = val;
            }

            // Create plant parsing fields
            const plantData: Omit<Plant, 'id'> = {
              nombre: obj['nombre'],
              nombreCientifico: obj['nombreCientifico'],
              categoria: obj['categoria'],
              familia: obj['familia'],
              latitud: obj['latitud'] ? parseFloat(obj['latitud']) : undefined,
              longitud: obj['longitud'] ? parseFloat(obj['longitud']) : undefined,
              fechaRegistro: obj['fechaRegistro'] ? parseInt(obj['fechaRegistro'], 10) : Date.now(),
              fotos: [] // Fotos no se exportan/importan fácilmente en CSV simple.
            };

            await this.plantService.createPlant(plantData as any);
            count++;
          }
          resolve(count);

        } catch (error) {
          reject(new Error('Error al parsear el CSV. Asegúrate de que tiene el formato correcto.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error de lectura de archivo.'));
      };

      reader.readAsText(file);
    });
  }

  private downloadFile(content: string, fileName: string, contentType: string) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
