import { User } from "../model/User";
import Constants from "expo-constants";

export class AuthRemoteDataSource {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      // const API_URL = Constants.expoConfig?.extra?.API_URL; 

      // if (!API_URL) {
      //   console.error("API_URL no está definida en las variables de entorno.");
      //   return null;
      // }

      const response = await fetch(`https://gsoft.gallegosb.xyz/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return null;

      const jsonResponse = await response.json();

      if (jsonResponse.status !== "success" || !jsonResponse.data || !jsonResponse.token) return null;

      const { id, name, last_name, email: userEmail, phone, sex, old, photo, membership_status, entrada, salida } =
        jsonResponse.data;

      return {
        id,
        name,
        lastName: last_name,
        email: userEmail,
        phone,
        sex,
        age: old,
        photo,
        membershipStatus: membership_status,
        entrada,
        salida,
        token: jsonResponse.token
      };
    } catch (error) {
      console.error("AuthRemoteDataSource Error:", error);
      return null;
    }
  }
}
