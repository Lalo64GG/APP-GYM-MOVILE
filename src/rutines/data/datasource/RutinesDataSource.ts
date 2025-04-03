import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "../model/routine_responses";


export class RoutineDataSource {
  async fetchRoutines(): Promise<ApiResponse> {
    const token = await AsyncStorage.getItem("token");
    
    if (!token) {
      throw new Error("No hay sesión activa. Por favor inicia sesión nuevamente.");
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const response = await fetch("https://gsoft.gallegosb.xyz/api/routines/1", {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`);
    }
    
    const result: ApiResponse = await response.json();
    
    if (!result.status) {
      throw new Error("La API ha respondido con un estado fallido");
    }
    
    return result;
  }
}