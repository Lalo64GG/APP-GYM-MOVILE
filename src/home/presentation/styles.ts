import { StyleSheet, StatusBar, Platform, Dimensions } from "react-native";

// Detectar si estamos en entorno web
const isWeb = Platform.OS === 'web';

// Obtener dimensiones de la ventana
const windowDimensions = Dimensions.get("window");
const { width } = windowDimensions;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    // Añadir paddingTop para Android
    paddingTop: Platform.select({
      android: StatusBar?.currentHeight || 0,
      ios: 0,
      web: 0
    }),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    ...(isWeb && {
      overflow: 'auto',
    }),
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0D0D0D",
    paddingBottom: Platform.select({
      android: 5,
      ios: 5,
      web: 5
    }),
    paddingTop: Platform.select({
      android: 15,
      ios: 0,
      web: 0
    }),
    ...(isWeb && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
  loadingText: {
    color: "#FFA500",
    marginTop: 10,
    fontSize: 16,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    padding: 20,
  },
  errorText: {
    color: "#FFA500",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
 retryButton: {
  backgroundColor: "#FFA500",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 8,
  ...(isWeb ? { cursor: 'pointer' } : {}), // Se aplica solo en web
},

  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
    ...(isWeb && { cursor: 'pointer' }), 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: Platform.select({
      android: 10,
      ios: 0,
      web: 0
    }),
  },
  gymName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 10,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 26,
    }),
  },
  divider: {
    height: 3,
    backgroundColor: "#FFA500",
    width: 60,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 1,
    ...(isWeb && windowDimensions.width > 768 && {
      width: 80,
    }),
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 25,
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  dateText: {
    color: "#FFF",
    marginLeft: 8,
    fontSize: 14,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  mainCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
    ...(isWeb && {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      maxWidth: windowDimensions.width > 768 ? 800 : '100%',
      marginHorizontal: 'auto',
    }),
  },
  mainCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 20,
    }),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  mainCardContent: {
    marginBottom: 15,
  },
  membershipDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailTextContainer: {
    marginLeft: 15,
  },
  detailLabel: {
    color: "#999",
    fontSize: 14,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 15,
    }),
  },
  detailValue: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  timeRemainingContainer: {
    marginTop: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
    ...(isWeb && windowDimensions.width > 768 && {
      height: 8,
    }),
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  timeRemainingText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 15,
    }),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    ...(isWeb && windowDimensions.width < 768 && {
      flexWrap: 'wrap',
      width: '100%',
    }),
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    ...(isWeb && {
      width: '100%',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      minWidth: 120,
      ':hover': {
        backgroundColor: '#262626',
      },
    }),
    ...(isWeb && windowDimensions.width < 768 && {
      flex: 0,
      width: '100%',
      marginBottom: 10,
    }),
  },
  actionButtonText: {
    color: "#FFF",
    marginTop: 5,
    fontSize: 12,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 14,
    }),
  },
  benefitsSection: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
    ...(isWeb && {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      maxWidth: windowDimensions.width > 768 ? 800 : '100%',
      marginHorizontal: 'auto',
    }),
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    color: "#FFF",
    marginLeft: 10,
    fontSize: 14,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  ...(isWeb && {
    webContainer: {
      display: 'flex',
      flexDirection: windowDimensions.width > 1024 ? 'row' : 'column',
      justifyContent: 'space-between',
      width: '100%',
      gap: 20,
    },
    webLeftColumn: {
      flex: windowDimensions.width > 1024 ? 2 : 'auto',
      marginRight: windowDimensions.width > 1024 ? 10 : 0,
    },
    webRightColumn: {
      flex: windowDimensions.width > 1024 ? 1 : 'auto',
      marginLeft: windowDimensions.width > 1024 ? 10 : 0,
    },
    // Hover states para elementos interactivos
    webHoverEffect: {
      transition: 'transform 0.2s ease, opacity 0.2s ease',
      ':hover': {
        transform: [{scale: 1.03}],
        opacity: 0.95,
      },
    },
  }),
});