import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { loginUseCase } from "@/src/login/domain/usecases/loginUseCase";

export const useLoginViewModel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Manejo de autenticación

  const validateFields = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return false;

    setIsLoading(true);

    try {
      const success = await loginUseCase(email, password);

      if (!success) {
        setErrors({ email: "", password: "Invalid credentials" });
        return false;
      }

      console.log("Login success:", success);

      // Guardar id y token en AsyncStorage
      await AsyncStorage.setItem("userId", success.id);
      await AsyncStorage.setItem("token", success.token);

      login();
      return true;
    } catch (error) {
      setErrors({ email: "", password: "An error occurred. Please try again." });
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    emailError: errors.email,
    passwordError: errors.password,
    isLoading,
    showPassword,
    setEmail,
    setPassword,
    handleLogin,
    setShowPassword,
  };
};
