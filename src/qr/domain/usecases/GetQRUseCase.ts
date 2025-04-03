import { QRRepository, QRRepositoryInterface } from "../../data/repository/QRRepository";
import { QR } from "../model/QR";

export interface GetQRUseCaseInterface {
  execute(): Promise<QR>;
}

export class GetQRUseCase implements GetQRUseCaseInterface {
  private repository: QRRepositoryInterface;

  constructor(repository: QRRepositoryInterface = new QRRepository()) {
    this.repository = repository;
  }

  async execute(): Promise<QR> {
    try {
      const qrModel = await this.repository.getQRCode();
      return {
        imageBase64: qrModel.imageBase64,
        isActive: qrModel.isActive,
        entryTime: qrModel.entryTime,
        exitTime: qrModel.exitTime,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to execute GetQRUseCase");
    }
  }
}