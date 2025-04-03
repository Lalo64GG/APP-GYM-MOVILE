import { Routine } from '../model/routine';

// Interfaz que define el contrato para el repositorio de rutinas
export interface RoutineRepository {
  getRoutines(): Promise<Routine[]>;
}