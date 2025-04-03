import { RoutineRepository } from "../../domain/repository/reoutine_repository";
import { Routine } from "../../domain/model/routine";
import { RoutineDataSource } from "../datasource/RutinesDataSource"
import { LEVEL_TYPE } from "@/constants/Routines";

// Implementación concreta del repositorio de rutinas
export class RoutineRepositoryImpl implements RoutineRepository {
  private dataSource: RoutineDataSource;
  
  constructor(dataSource: RoutineDataSource) {
    this.dataSource = dataSource;
  }
  
  async getRoutines(): Promise<Routine[]> {
    try {
      const apiResponse = await this.dataSource.fetchRoutines();
      
      if (!apiResponse.data.data || apiResponse.data.data.length === 0) {
        return [];
      }
      
      // Mapear los datos de la API al modelo de dominio
      return apiResponse.data.data.map(routine => ({
        id: routine.id,
        title: `Rutina ${routine.tipo}`,
        level: `Nivel ${this.getNivelByTipo(routine.tipo)}`,
        duration: "4-8 semanas",
        exercises: "Completa",
        description: routine.description,
        url_rutina: routine.url_rutina
      }));
    } catch (error) {
      console.error("Error en el repositorio:", error);
      throw error;
    }
  }
  
  // Función auxiliar para determinar el nivel según el tipo
  private getNivelByTipo(tipo: string): number | string {
    const tipoLower = tipo.toLowerCase();
    
    switch (tipoLower) {
      case LEVEL_TYPE.PRINCIPIANTE:
        return 1;
      case LEVEL_TYPE.INTERMEDIO:
        return 2;
      case LEVEL_TYPE.AVANZADO:
        return 3;
      default:
        return "?";
    }
  }
}