// data/datasource/QRDataSource.ts
export interface QRDataSourceInterface {
    fetchQRCode(userId: string, token: string): Promise<QRResponse>;
  }
  
  export interface QRResponse {
    success: boolean;
    data?: string; // base64 image
    qrdata?: QRData;
    messages?: string;
  }
  
  export interface QRData {
    membership_status: boolean;
    entrada: string;
    salida: string;
  }
  
  export class QRDataSource implements QRDataSourceInterface {
    async fetchQRCode(userId: string, token: string): Promise<QRResponse> {
      try {
        const response = await fetch(
          `https://gsoft.gallegosb.xyz/api/user/qr/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const result = await response.json();
        return result;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("Unknown error fetching QR code");
      }
    }
  }