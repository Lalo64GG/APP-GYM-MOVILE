export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  age: number;
  photo: string;
  membershipStatus: boolean;
  entrada: string;
  salida: string;
  token: string; // Ahora el token es obligatorio porque siempre se recibe
}

export interface LoginResponse {
  status: string;
  msg: string;
  data: User;
  token: string;
}
