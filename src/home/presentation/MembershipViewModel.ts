import { useState, useEffect } from "react";
import { GetMembershipUseCase } from "../domain/usecases/GetMembershipUseCase";
import { Membership } from "../domain/model/MemberShip";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export const useMembershipViewModel = () => {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [gymName, setGymName] = useState<string>("");
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  // Registrar para recibir notificaciones push usando Expo
  const registerForPushNotificationsAsync = async () => {
    try {
      // Verificar si es un dispositivo físico
      if (!Device.isDevice) {
        console.log("Las notificaciones push requieren un dispositivo físico");
        return null;
      }

      // Verificar los permisos existentes
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si no tenemos permiso, solicitarlo
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Si todavía no tenemos permiso después de solicitarlo
      if (finalStatus !== 'granted') {
        console.log("No se obtuvieron permisos para las notificaciones");
        return null;
      }

      // Obtener el token de Expo
      let token;
      
      try {
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId
        })).data;
        
        console.log("Expo Push Token:", token);
      } catch (error) {
        console.error("Error al obtener token de Expo:", error);
        return null;
      }

      // Configurar canal de notificaciones en Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error("Error general en registro de notificaciones:", error);
      return null;
    }
  };

  // Configurar listeners para notificaciones
  const setupNotificationListeners = () => {
    // Listener para recibir notificaciones cuando la app está en primer plano
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notificación recibida en primer plano:", notification);
      // Aquí puedes manejar la notificación recibida
    });

    // Listener para cuando el usuario interactúa con una notificación
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Respuesta de usuario a notificación:", response);
      // Aquí puedes manejar la respuesta del usuario (ej. navegación)
    });

    // Devolver función para limpiar listeners
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Configurar el manejador de notificaciones
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        // Registrar para notificaciones
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          console.log("Token listo para ser enviado al servidor:", token);
          
          // Aquí podrías enviar el token a tu servidor backend
          // const result = await sendTokenToServer(token);
          // console.log("Token enviado al servidor:", result);
        }
      } catch (error) {
        console.error("Error en configuración de notificaciones:", error);
      }
    };

    // Configurar notificaciones
    setupNotifications();

    // Configurar listeners
    const cleanupListeners = setupNotificationListeners();

    // Cargar datos de membresía (usando tu código existente)
    setTimeout(() => {
      // Datos estáticos
      const staticMembership: Membership = {
        id: "1",
        status: "Activa",
        type: "Normal",
        price: 300,
        expirationDate: "28/04/2025",
      };

      const staticGymName = "Elite Gym"; // Nombre del gym

      setMembership(staticMembership);
      setGymName(staticGymName);
      setLoading(false);
    }, 1000);

    // Limpieza al desmontar
    return () => {
      cleanupListeners();
    };
  }, []);

  // Función para enviar una notificación local de prueba
  const sendLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'datos adicionales' },
      },
      trigger: null, // Mostrar inmediatamente
    });
  };

  // Obtener la fecha actual en formato DD/MM/YYYY
  const getCurrentDate = (): string => {
    const date = new Date();
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Exponer funciones y estado
  return { 
    membership, 
    gymName, 
    loading, 
    getCurrentDate, 
    expoPushToken, // Cambiado de fcmToken a expoPushToken
    sendLocalNotification // Añadido para permitir enviar notificaciones locales de prueba
  };
};