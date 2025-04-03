import AsyncStorage from "@react-native-async-storage/async-storage";
import { QRDataSource, QRDataSourceInterface, QRResponse } from "../datasource/QRDataSource";
import { QRModel } from "../model/QRModel";

export interface QRRepositoryInterface {
  getQRCode(): Promise<QRModel>;
}

export class QRRepository implements QRRepositoryInterface {
  private dataSource: QRDataSourceInterface;

  constructor(dataSource: QRDataSourceInterface = new QRDataSource()) {
    this.dataSource = dataSource;
  }

  async getQRCode(): Promise<QRModel> {
    try {
      // Get user credentials from storage
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        throw new Error("No se encontró ID de usuario o token");
      }

      const response = await this.dataSource.fetchQRCode(userId, token);

      if (!response.success) {
        throw new Error(response.messages || "Error al obtener el código QR");
      }

      // Parse entry and exit times
      let entryTime = null;
      let exitTime = null;

      if (response.qrdata?.entrada && response.qrdata.entrada !== "No registrado") {
        try {
          entryTime = new Date(response.qrdata.entrada);
        } catch (e) {
          entryTime = this.getDefaultEntryTime();
        }
      } else {
        entryTime = this.getDefaultEntryTime();
      }

      if (response.qrdata?.salida && response.qrdata.salida !== "No registrado") {
        try {
          exitTime = new Date(response.qrdata.salida);
        } catch (e) {
          exitTime = this.getDefaultExitTime();
        }
      } else {
        exitTime = this.getDefaultExitTime();
      }

      return {
        imageBase64: response.data || "",
        isActive: response.qrdata?.membership_status || false,
        entryTime,
        exitTime,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Unknown error in repository");
    }
  }

  private getDefaultEntryTime(): Date {
    const defaultTime = new Date();
    defaultTime.setHours(15, 0, 0);
    return defaultTime;
  }

  private getDefaultExitTime(): Date {
    const defaultTime = new Date();
    defaultTime.setHours(18, 0, 0);
    return defaultTime;
  }
}