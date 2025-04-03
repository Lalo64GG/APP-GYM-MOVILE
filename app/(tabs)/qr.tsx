import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQRViewModel } from "@/src/qr/presentation/QRViewModel";
import { styles } from "@/src/qr/presentation/styles";

const { width } = Dimensions.get("window");
const QR_SIZE = width * 0.65;

const QRScreen = () => {
  const {
    qr,
    loading,
    error,
    currentTime,
    timeInfo,
    formatEntryTime,
    formatExitTime,
  } = useQRViewModel();

  // Animation for pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Configure pulsing animation
  useEffect(() => {
    if (true) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      pulseAnim.stopAnimation();
    };
  }, [qr?.isActive]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TU CÓDIGO QR</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Escanea para acceder al gimnasio</Text>
        </View>

        {/* QR Card */}
        <Animated.View
          style={[
            styles.qrCardContainer,
            {
              transform: [{ scale: pulseAnim }],
              opacity: qr?.isActive ? 1 : 0.7,
            },
          ]}
        >
          <LinearGradient colors={["#1F1F1F", "#131313"]} style={styles.qrCard}>
            <View style={styles.qrContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#FFA500" />
              ) : error ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons
                    name="error-outline"
                    size={40}
                    color="#F44336"
                  />
                  <Text style={styles.errorText}>Error al cargar QR</Text>
                </View>
              ) : (
                // Mostrar la imagen QR desde la respuesta de la API
                <Image
                  source={{ uri: `${qr?.imageBase64}` }}
                  style={{ width: QR_SIZE * 0.8, height: QR_SIZE * 0.8 }}
                  resizeMode="contain"
                />
              )}
            </View>
          </LinearGradient>

          <View style={styles.qrInfoBadge}>
            <MaterialIcons name="access-time" size={14} color="#FFF" />
            <Text style={styles.qrInfoText}>Temporal</Text>
          </View>
        </Animated.View>

        {/* Time Info */}
        <View style={styles.timeInfoContainer}>
          <View style={styles.currentTimeContainer}>
            <MaterialIcons name="schedule" size={18} color="#FFA500" />
            <Text style={styles.currentTimeText}>{currentTime}</Text>
          </View>

          <View style={styles.timeRemainingContainer}>
            <Text style={styles.timeRemainingLabel}>{timeInfo.text}</Text>
            <Text style={styles.timeRemainingValue}>{timeInfo.time}</Text>
          </View>
        </View>

        {/* Access Times */}
        <View style={styles.accessTimesContainer}>
          <LinearGradient
            colors={["#1A1A1A", "#131313"]}
            style={styles.accessTimeCard}
          >
            <View style={styles.accessTimeRow}>
              <View style={styles.accessTimeLabelContainer}>
                <MaterialIcons name="login" size={20} color="#FFA500" />
                <Text style={styles.accessTimeLabel}>Entrada:</Text>
              </View>
              <Text style={styles.accessTimeValue}>{formatEntryTime()}</Text>
            </View>

            <View style={styles.timelineSeparator}>
              <View style={styles.timelineLine} />
              <MaterialIcons name="more-vert" size={18} color="#333" />
              <View style={styles.timelineLine} />
            </View>

            <View style={styles.accessTimeRow}>
              <View style={styles.accessTimeLabelContainer}>
                <MaterialIcons name="logout" size={20} color="#FFA500" />
                <Text style={styles.accessTimeLabel}>Salida:</Text>
              </View>
              <Text style={styles.accessTimeValue}>{formatExitTime()}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QRScreen;
