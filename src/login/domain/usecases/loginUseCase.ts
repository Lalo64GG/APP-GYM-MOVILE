import { authRepository } from "../../data/repository/AuthRespository";

export const loginUseCase = async (email: string, password: string) => {
  return await authRepository.login(email, password);
};
