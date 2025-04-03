import { StyleSheet,Dimensions, Platform } from "react-native";


const isWeb = Platform.OS === 'web';

const windowDimensions = Dimensions.get("window");
const { width } = windowDimensions;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 20,
    paddingTop: 24,
    ...(isWeb && {
      maxWidth: 1200,
      marginHorizontal: 'auto',
      width: '100%',
    }),
  },
  headerContainer: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 32,
    }),
  },
  underline: {
    width: 60,
    height: 3,
    backgroundColor: "#FFA500",
    marginBottom: 8,
    borderRadius: 2,
    ...(isWeb && windowDimensions.width > 768 && {
      width: 80,
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
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  subHeader: {
    fontSize: 16,
    color: "#999",
    marginBottom: 16,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  listContainer: {
    paddingBottom: 24,
    width: "100%",
    ...(isWeb && windowDimensions.width > 768 && {
      paddingHorizontal: 10,
    }),
  },
  cardContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: "100%",
    ...(isWeb && {
      boxShadow: '0 5px 10px rgba(255, 165, 0, 0.2)',
    }),
  },
  card: {
    padding: 20,
    borderRadius: 20,
    minHeight: 200,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  levelIndicator: {
    backgroundColor: "rgba(255, 165, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  levelText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "bold",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 15,
    }),
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 24,
    }),
  },
  cardDescription: {
    fontSize: 15,
    color: "#999",
    marginBottom: 16,
    lineHeight: 22,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
      lineHeight: 24,
    }),
  },
  cardDetails: {
    flexDirection: "row",
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailText: {
    color: "#999",
    fontSize: 15,
    marginLeft: 8,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  downloadButton: {
    backgroundColor: "#FFA500",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 10,
  },
  downloadText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 17,
    }),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 20,
    }),
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 18,
    }),
  },
  retryButton: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  retryText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
    ...(isWeb && windowDimensions.width > 768 && {
      fontSize: 16,
    }),
  },
});