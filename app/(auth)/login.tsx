import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { Link } from "expo-router";
import { useLoginViewModel } from "@/src/login/presentation/loginViewModel";
import { styles } from "@/src/login/presentation/styles";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const {
    email,
    password,
    emailError,
    passwordError,
    isLoading,
    showPassword,
    setEmail,
    setPassword,
    handleLogin,
    setShowPassword,
  } = useLoginViewModel();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0} 
    >
      <View style={{ flex: 1 }}>
        {/* Esto mantiene la imagen fija */}
        <ImageBackground
          source={require("../../assets/images/gym.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.logo}>GSOFT</Text>
            <Text style={styles.welcomeText}>Welcome Again, please register</Text>

            <Text>  </Text>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              error={!!emailError}
              textColor="#fff" 
              placeholderTextColor="#bbb" 
              theme={{
                colors: {
                  primary: "#FFA500", 
                  background: "transparent",
                },
              }}
              left={
                <TextInput.Icon 
                  icon={() => <MaterialIcons name="email" size={24} color="#FFA500" />} 
                />
              }
            />

            {emailError ? (
              <HelperText type="error">{emailError}</HelperText>
            ) : null}

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={!!passwordError}
              style={styles.input}
              textColor="#fff" 
              placeholderTextColor="#bbb" 
              theme={{
                colors: {
                  primary: "#FFA500", 
                  background: "transparent",
                },
              }}
              left={
                <TextInput.Icon 
                  icon={() => <MaterialIcons name="lock" size={24} color="#FFA500" />} 
                />
              }
              right={
                <TextInput.Icon 
                  icon={() => (
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={24} 
                      color="#FFA500" 
                    />
                  )}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {passwordError ? (
              <HelperText type="error">{passwordError}</HelperText>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Logging in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Link href="/(auth)/register">
                <Text style={styles.registerLink}>Sign up here</Text>
              </Link>
            </Text>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;