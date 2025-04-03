import { useEffect, useState } from "react";
import { GetQRUseCase, GetQRUseCaseInterface } from "../domain/usecases/GetQRUseCase";
import { QR } from "../domain/model/QR";

interface TimeInfo {
  text: string;
  time: string;
}

export interface QRState {
  qr: QR | null;
  loading: boolean;
  error: string | null;
  currentTime: string;
  timeInfo: TimeInfo;
}

export const useQRViewModel = (getQRUseCase: GetQRUseCaseInterface = new GetQRUseCase()) => {
  const [state, setState] = useState<QRState>({
    qr: null,
    loading: true,
    error: null,
    currentTime: "",
    timeInfo: { text: "Cargando información...", time: "..." },
  });

  const fetchQRCode = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const qr = await getQRUseCase.execute();
      setState((prevState) => ({
        ...prevState,
        qr,
        loading: false,
        error: null,
      }));
    } catch (error) {
      let errorMessage = "Error desconocido";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setState((prevState) => ({
        ...prevState,
        error: errorMessage,
        loading: false,
      }));
    }
  };

  const updateCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setState((prevState) => ({ ...prevState, currentTime: formattedTime }));
  };

  const calculateTimeRemaining = (): TimeInfo => {
    const { qr } = state;
    if (!qr || !qr.entryTime || !qr.exitTime) {
      return { text: "Cargando información...", time: "..." };
    }

    const now = new Date();
    const entryTime = qr.entryTime;
    const exitTime = qr.exitTime;

    if (now < entryTime) {
      return {
        text: "Tu acceso inicia en",
        time: formatTimeDifference(entryTime, now),
      };
    } else if (now > exitTime) {
      return { text: "Tu acceso ha expirado", time: "0h 0m" };
    } else {
      return {
        text: "Tiempo restante",
        time: formatTimeDifference(exitTime, now),
      };
    }
  };

  const formatTimeDifference = (timeA: Date, timeB: Date): string => {
    const diffMs = timeA.getTime() - timeB.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  const formatEntryTime = (): string => {
    const { qr } = state;
    if (qr && qr.entryTime) {
      return qr.entryTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "3:00 PM";
  };

  const formatExitTime = (): string => {
    const { qr } = state;
    if (qr && qr.exitTime) {
      return qr.exitTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "6:00 PM";
  };

  useEffect(() => {
    fetchQRCode();
    
    // Set up timer to refresh QR code every 5 minutes
    const refreshInterval = setInterval(fetchQRCode, 300000);
    
    // Set up timer to update current time every minute
    updateCurrentTime();
    const timeInterval = setInterval(updateCurrentTime, 60000);
    
    return () => {
      clearInterval(refreshInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Update time info whenever time changes or QR data changes
  useEffect(() => {
    const timeInfoUpdate = calculateTimeRemaining();
    setState((prevState) => ({ ...prevState, timeInfo: timeInfoUpdate }));
    
    // Set up timer to update time info every minute
    const timeInfoInterval = setInterval(() => {
      const updatedTimeInfo = calculateTimeRemaining();
      setState((prevState) => ({ ...prevState, timeInfo: updatedTimeInfo }));
    }, 60000);
    
    return () => clearInterval(timeInfoInterval);
  }, [state.currentTime, state.qr]);

  return {
    ...state,
    formatEntryTime,
    formatExitTime,
    refreshQR: fetchQRCode,
  };
};