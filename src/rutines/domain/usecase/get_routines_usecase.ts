import { Routine } from "../model/routine";
import { RoutineRepository } from "../repository/reoutine_repository";


export class GetRoutinesUseCase {
  private repository: RoutineRepository;
  
  constructor(repository: RoutineRepository) {
    this.repository = repository;
  }
  
  async execute(): Promise<Routine[]> {
    return await this.repository.getRoutines();
  }
}