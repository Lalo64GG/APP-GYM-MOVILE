import { useState } from "react";
import { Routine } from "../domain/model/routine";
import { GetRoutinesUseCase } from "../domain/usecase/get_routines_usecase";

export const useRoutinesViewModel = (getRoutinesUseCase: GetRoutinesUseCase) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Función para cargar las rutinas
  const fetchRoutines = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getRoutinesUseCase.execute();
      setRoutines(result);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Error al conectar con el servidor";
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    routines,
    loading,
    error,
    fetchRoutines,

  };
};