import { useState } from "react";

export const useRegisterViewModel = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const validateFields = () => {
    let newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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

  const handleRegister = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    // const result = await registerUseCase(email, password, name);

    // if (!result.success) alert("Registration failed. Please try again.");

    setIsLoading(false);
  };

  return {
    name,
    email,
    password,
    nameError: errors.name,
    emailError: errors.email,
    passwordError: errors.password,
    isLoading,
    showPassword,
    setName,
    setEmail,
    setPassword,
    setShowPassword,
    handleRegister,
  };
};
