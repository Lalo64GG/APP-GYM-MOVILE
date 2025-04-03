// Data model que representa la respuesta directa de la API
export interface ApiRoutine {
    id: string;
    tipo: string;
    description: string;
    url_rutina: string;
    id_gimnacio: string;
  }
  
  export interface ApiResponse {
    status: boolean;
    data: {
      data: ApiRoutine[];
      total: number;
    };
  }