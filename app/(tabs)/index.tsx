import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Linking,
  TextStyle,
  ViewStyle,
  Alert,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMembershipViewModel } from "@/src/home/presentation/MembershipViewModel";
import { styles } from "@/src/home/presentation/styles";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';

// Configurar el comportamiento de las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const MembershipScreen = () => {
  const { membership, gymName, loading, getCurrentDate, expoPushToken, sendLocalNotification } =
    useMembershipViewModel();

  // Definir referencias para los listeners de notificaciones
  // Necesitan tener un tipo más específico para evitar errores TypeScript
  const notificationListener = useRef();
  const responseListener = useRef();

  // Define la función requestNotificationPermission
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Alert.alert(
          "Notificaciones",
          "Para recibir notificaciones importantes sobre tu membresía, necesitamos tu permiso.",
          [
            {
              text: "Cancelar",
              style: "cancel"
            },
            {
              text: "Permitir",
              onPress: async () => {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status === 'granted') {
                  Alert.alert("¡Perfecto!", "Ahora recibirás notificaciones importantes.");
                  // Si tienes la función sendLocalNotification, úsala aquí
                  if (sendLocalNotification) {
                    await sendLocalNotification(
                      "¡Notificaciones activadas!", 
                      "Te mantendremos informado sobre tu membresía y promociones."
                    );
                  }
                } else {
                  Alert.alert(
                    "Permiso denegado",
                    "No podrás recibir notificaciones. Puedes cambiar esto en la configuración."
                  );
                }
              }
            }
          ]
        );
      } else {
        // En Android, solicitar permiso directamente
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          Alert.alert("¡Perfecto!", "Ahora recibirás notificaciones importantes.");
          if (sendLocalNotification) {
            await sendLocalNotification(
              "¡Notificaciones activadas!", 
              "Te mantendremos informado sobre tu membresía y promociones."
            );
          }
        } else {
          Alert.alert(
            "Permiso denegado",
            "No podrás recibir notificaciones. Puedes cambiar esto en la configuración."
          );
        }
      }
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
    }
  };

  const sendTestNotification = async () => {
    try {
      if (sendLocalNotification) {
        await sendLocalNotification(
          "Notificación de prueba", 
          "Esta es una notificación de prueba. ¡Funciona correctamente!"
        );
      } else {
        // Si no, usa Notifications directamente
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Notificación de prueba",
            body: "Esta es una notificación de prueba enviada directamente desde la aplicación.",
          },
          trigger: null, // mostrar inmediatamente
        });
      }
      
    } catch (error) {
      console.error("Error al enviar notificación de prueba:", error);
      Alert.alert("Error", "No se pudo enviar la notificación de prueba.");
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('¡No se otorgaron permisos para notificaciones!');
        return;
      }
      token = (await Notifications.getDevicePushTokenAsync()).data; // Token nativo para FCM/APNs
      console.log('Token:', token);
    } else {
      alert('Debes usar un dispositivo físico para notificaciones push');
    }
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  useEffect(() => {
    // Registrar el dispositivo y obtener el token
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        // Guardar el token en Firestore (puedes asociarlo a un usuario)
        console.log("Token para enviar a Firebase:", token);
      }
    });

    // Escuchar notificaciones recibidas mientras la app está en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    // Escuchar cuando el usuario interactúa con una notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Interacción con notificación:', response);
    });

    // Limpiar los listeners al desmontar el componente
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
    
  const openEmailSupport = () => {
    const email = "novacode@gallegosb.xyz";
    const subject = encodeURIComponent("Soporte Técnico");
    const body = encodeURIComponent("Hola, necesito ayuda con...");

    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(mailto).catch((err) => {
      console.error("Error al abrir Gmail:", err);
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer as ViewStyle}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText as TextStyle}>Cargando información...</Text>
      </View>
    );
  }

  if (!membership) {
    return (
      <View style={styles.errorContainer as ViewStyle}>
        <MaterialIcons name="error-outline" size={60} color="#FFA500" />
        <Text style={styles.errorText as TextStyle}>
          No se pudo cargar la información de membresía
        </Text>
        <TouchableOpacity style={styles.retryButton as ViewStyle}>
          <Text style={styles.retryButtonText as TextStyle}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activa":
      case "active":
        return "#4CAF50"; // green
      case "pendiente":
      case "pending":
        return "#FF9800"; // orange
      case "vencida":
      case "expired":
        return "#F44336"; // red
      default:
        return "#FFA500"; // default orange
    }
  };

  const statusColor = getStatusColor(membership.status);

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/"); // Separar en partes
    return `${year}-${month}-${day}`; // Reordenar a formato válido
  };

  const calculateDaysRemaining = () => {
    if (!membership.expirationDate) return null;

    const formattedDate = formatDate(membership.expirationDate);
    const expirationDate = new Date(formattedDate);

    if (isNaN(expirationDate.getTime())) {
      console.error("Fecha inválida:", formattedDate);
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar horas para evitar errores

    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log("Días restantes:", diffDays);

    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <SafeAreaView style={styles.safeArea as ViewStyle}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <ScrollView contentContainerStyle={styles.scrollContainer as ViewStyle}>
        <View style={styles.container as ViewStyle}>
          {/* Gym header */}
          <View style={styles.header as ViewStyle}>
            <MaterialIcons name="fitness-center" size={24} color="#FFA500" />
            <Text style={styles.gymName as TextStyle}>{gymName}</Text>
          </View>
          <View style={styles.divider as ViewStyle} />

          {/* Date display */}
          <TouchableOpacity style={styles.dateButton as ViewStyle}>
            <MaterialIcons name="calendar-today" size={18} color="#FFA500" />
            <Text style={styles.dateText as TextStyle}>{getCurrentDate()}</Text>
          </TouchableOpacity>

          {/* Main membership card */}
          <LinearGradient
            colors={["#1A1A1A", "#0D0D0D"]}
            style={styles.mainCard as ViewStyle}
          >
            <View style={styles.mainCardHeader as ViewStyle}>
              <Text style={styles.mainCardTitle as TextStyle}>Estado de Membresía</Text>
              <View
                style={[
                  styles.statusBadge as ViewStyle,
                  { backgroundColor: `${statusColor}20` },
                ]}
              >
                <View
                  style={[styles.statusDot as ViewStyle , { backgroundColor: statusColor }]}
                />
                <Text style={[styles.statusText as TextStyle, { color: statusColor }]}>
                  {membership.status}
                </Text>
              </View>
            </View>

            <View style={styles.mainCardContent as ViewStyle}>
              <View style={styles.membershipDetail as ViewStyle}>
                <MaterialIcons
                  name="card-membership"
                  size={24}
                  color="#FFA500"
                />
                <View style={styles.detailTextContainer as ViewStyle}>
                  <Text style={styles.detailLabel as TextStyle}>Tipo</Text>
                  <Text style={styles.detailValue as TextStyle}>{membership.type}</Text>
                </View>
              </View>

              <View style={styles.membershipDetail as ViewStyle}>
                <MaterialIcons name="attach-money" size={24} color="#FFA500" />
                <View style={styles.detailTextContainer as ViewStyle}>
                  <Text style={styles.detailLabel as TextStyle}>Precio</Text>
                  <Text style={styles.detailValue as TextStyle}>
                    ${membership.price} / mes
                  </Text>
                </View>
              </View>

              <View style={styles.membershipDetail as ViewStyle}>
                <MaterialIcons name="event" size={24} color="#FFA500" />
                <View style={styles.detailTextContainer as ViewStyle}>
                  <Text style={styles.detailLabel as TextStyle}>Vencimiento</Text>
                  <Text style={styles.detailValue as TextStyle}>
                    {membership.expirationDate}
                  </Text>
                </View>
              </View>
            </View>

            {daysRemaining !== null && (
              <View style={styles.timeRemainingContainer as ViewStyle}>
                <View style={styles.progressBarContainer as ViewStyle}>
                  <View
                    style={[
                      styles.progressBar as ViewStyle,
                      {
                        width: `${Math.min(
                          Math.max((daysRemaining / 30) * 100, 5),
                          100
                        )}%`,
                        backgroundColor:
                          daysRemaining <= 7
                            ? "#F44336"
                            : daysRemaining <= 14
                            ? "#FF9800"
                            : "#4CAF50",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.timeRemainingText as TextStyle}>
                  {daysRemaining > 0
                    ? `${daysRemaining} ${
                        daysRemaining === 1 ? "día" : "días"
                      } restantes`
                    : "Membresía vencida"}
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* Additional options */}
          <View style={styles.actionButtons as ViewStyle} >
            <TouchableOpacity
              style={styles.actionButton as ViewStyle}
              onPress={openEmailSupport}
            >
              <MaterialIcons name="support-agent" size={24} color="#FFA500" />
              <Text style={styles.actionButtonText as TextStyle}>Soporte</Text>
            </TouchableOpacity>
            
            {/* Botón para notificaciones */}
            <TouchableOpacity
              style={styles.actionButton as ViewStyle}
              onPress={requestNotificationPermission}
            >
              <MaterialIcons name="notifications" size={24} color="#FFA500" />
              <Text style={styles.actionButtonText as TextStyle}>Notificaciones</Text>
            </TouchableOpacity>
            
            {/* Botón para enviar notificación de prueba */}
            <TouchableOpacity
              style={styles.actionButton as ViewStyle}
              onPress={sendTestNotification}
            >
              <MaterialIcons name="notifications-active" size={24} color="#FFA500" />
              <Text style={styles.actionButtonText as TextStyle}>Probar</Text>
            </TouchableOpacity>
          </View>

          {/* Benefits section */}
          <View style={styles.benefitsSection as ViewStyle}>
            <Text style={styles.sectionTitle as TextStyle}>Beneficios de tu membresía</Text>

            <View style={styles.benefitItem as ViewStyle}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText as TextStyle}>
                Acceso ilimitado a equipamiento
              </Text>
            </View>

            <View style={styles.benefitItem as ViewStyle}>
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText as TextStyle}>Clases grupales incluidas</Text>
            </View>

            <View style={styles.benefitItem as ViewStyle} >
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText as TextStyle}>
                Asesoramiento personalizado
              </Text>
            </View>
            
            {/* Beneficio de notificaciones */}
            <View style={styles.benefitItem as ViewStyle} >
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText as TextStyle}>
                Notificaciones de vencimiento y promociones
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MembershipScreen;