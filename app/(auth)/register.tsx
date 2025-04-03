import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { Link } from "expo-router";
import { useRegisterViewModel } from "@/src/register/presentation/registerViewModel";
import { styles } from "@/src/register/presentation/styles";
import { MaterialIcons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const {
    name,
    email,
    password,
    nameError,
    emailError,
    passwordError,
    isLoading,
    showPassword,
    setName,
    setEmail,
    setPassword,
    setShowPassword,
    handleRegister,
  } = useRegisterViewModel();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
    >
        <View style={styles.overlay}>
          <Text style={styles.logo}>GSOFT</Text>
          <Text style={styles.welcomeText}>Create your account and start now!</Text>

          <Text></Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={!!nameError}
            style={styles.input}
             textColor="#fff"
            theme={{
              colors: {
                primary: "#FFA500",
                background: "transparent",
              },
            }}
            left={
              <TextInput.Icon
                icon={() => (
                  <MaterialIcons name="person" size={24} color="#FFA500" />
                )}
              />
            }
          />
          {nameError ? <HelperText type="error">{nameError}</HelperText> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={!!emailError}
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
                icon={() => (
                  <MaterialIcons name="email" size={24} color="#FFA500" />
                )}
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
                icon={() => (
                  <MaterialIcons name="lock" size={24} color="#FFA500" />
                )}
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
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Registering..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/(auth)/login">
              <Text style={styles.registerLink}>Login here</Text>
            </Link>
          </Text>
        </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
