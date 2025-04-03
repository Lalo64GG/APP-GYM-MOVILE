import { AuthRemoteDataSource } from "../datasource/AuthRemoteDataSource";
import { User } from "../model/User";

class AuthRepositoryImpl {
  async login(email: string, password: string): Promise<User | null> {
    return await AuthRemoteDataSource.login(email, password);
  }
}

export const authRepository = new AuthRepositoryImpl();
