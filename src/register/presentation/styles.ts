import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    justifyContent: "center",
    minHeight: height, 
  },
  overlay: { padding: 20, borderRadius: 10, marginHorizontal: 20 },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,  
    marginTop: -40,  
  },
  welcomeText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30, 
    marginTop: -20,  
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 8,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    marginTop:20,
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footerText: {
    color: "#bbb",
    textAlign: "center",
    marginTop: 30,
    fontSize: 15,
  },
  registerLink: { color: "#FFA500", fontWeight: "bold" },
});
