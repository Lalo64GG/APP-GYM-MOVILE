import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { useState, useEffect } from "react";
// Función para detectar si estamos en entorno web
const isWeb = Platform.OS === 'web';

// Obtener dimensiones de la ventana
const windowDimensions = Dimensions.get("window");
const { width } = windowDimensions;

// Tamaño del QR adaptativo pero con límites en web
const QR_SIZE = width * 0.65;
const MAX_QR_SIZE = 400; // Máximo tamaño en web para evitar que sea demasiado grande

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: Platform.select({
      android: StatusBar?.currentHeight || 0,
      ios: 0,
      web: 0
    }),
  },
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    paddingTop: Platform.select({
      android: 40,
      ios: 30,
      web: 30
    }),
    paddingHorizontal: 20,
    paddingBottom: Platform.select({
      android: 120,
      ios: 200,
      web: isWeb && windowDimensions.width > 768 ? 100 : 120
    }),
    ...(isWeb && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: Platform.select({
      android: 10,
      ios: 0,
      web: 0
    }),
    ...(isWeb && windowDimensions.width > 768 && {
      marginBottom: 40,
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 28,
    }),
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#FFA500",
    marginVertical: 8,
    borderRadius: 2,
    ...(isWeb && windowDimensions.width > 768 && {
      width: 80,
    }),
  },
  qrCardContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 25,
    ...(isWeb && {
      width: '100%',
    }),
  },
  qrCard: {
    width: isWeb ? Math.min(QR_SIZE, MAX_QR_SIZE) : QR_SIZE,
    height: isWeb ? Math.min(QR_SIZE, MAX_QR_SIZE) : QR_SIZE,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#FFA500",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    ...(isWeb && {
      boxShadow: '0 5px 10px rgba(255, 165, 0, 0.2)',
    }),
  },
  qrContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#F44336",
    marginTop: 8,
    textAlign: "center",
  },
  qrInfoBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FFA500",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    zIndex: 1,
  },
  qrInfoText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  timeInfoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
    ...(isWeb && windowDimensions.width > 768 && {
      maxWidth: 600,
    }),
  },
  currentTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  currentTimeText: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  timeRemainingContainer: {
    alignItems: "center",
  },
  timeRemainingLabel: {
    color: "#999",
    fontSize: 14,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  timeRemainingValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 24,
    }),
  },
  accessTimesContainer: {
    width: "100%",
    marginBottom: 20,
    ...(isWeb && windowDimensions.width > 768 && {
      maxWidth: 700,
    }),
  },
  accessTimeCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    ...(isWeb && {
      boxSizing: 'border-box',
    }),
  },
  accessTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  accessTimeLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accessTimeLabel: {
    color: "#999",
    fontSize: 16,
    marginLeft: 8,
  },
  accessTimeValue: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  timelineSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  timelineLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  // Estilos específicos para web en diferentes breakpoints
  ...(isWeb && {
    contentContainer: {
      display: 'flex',
      flexDirection: windowDimensions.width > 1024 ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: windowDimensions.width > 1024 ? 'space-between' : 'center',
      width: '100%',
    },
    leftColumn: {
      flex: windowDimensions.width > 1024 ? 1 : undefined,
      marginRight: windowDimensions.width > 1024 ? 20 : 0,
    },
    rightColumn: {
      flex: windowDimensions.width > 1024 ? 1 : undefined,
      marginLeft: windowDimensions.width > 1024 ? 20 : 0,
      width: '100%',
    }
  }),
});

