import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ onLoginSuccess }) {
  const navigation = useNavigation();

  const [secureText, setSecureText] = useState(true);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    console.log("📤 Attempting login with:", email, password);
    setLoading(true);

    try {
      const response = await fetch(
        "https://getbizlinker.site/backend/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("📥 Raw response:", response);

      const data = await response.json();
      console.log("✅ Parsed response JSON:", data);

      if (data.status?.toLowerCase() === "success" && data.user) {
        const userData = {
          userID: data.user.userID,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          phone: data.user.phone,
          profilePicture: data.user.profilePicture,
        };

        // ✅ Save user to AsyncStorage for use in all screens
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        console.log("👤 Saved user to AsyncStorage:", userData);

        if (onLoginSuccess) onLoginSuccess(userData, data.token || null);

        Alert.alert("Success", "Logged in!");
        // You can navigate to another screen here if you want, e.g.:
        // navigation.navigate("Profile");  // or Home, etc.
      } else {
        console.warn("⚠️ Login failed:", data.message);
        Alert.alert("Login Failed", data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("💥 Login error:", err.message || err);
      Alert.alert("Login Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setForgotPasswordModal(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome back!</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          style={styles.passwordInput}
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setForgotPasswordModal(true)}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or sign in with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => alert("Google login not implemented")}
        >
          <AntDesign name="google" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => alert("Apple login not implemented")}
        >
          <FontAwesome name="apple" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={forgotPasswordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setForgotPasswordModal(false)}
            >
              <Ionicons name="close-circle" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalSubtitle}>
              We’ll send a reset link to your email.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={resetEmail}
              onChangeText={setResetEmail}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.modalButtonText}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {resetSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>
            ✅ A reset link has been sent to your email!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  welcomeText: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  label: { marginBottom: 10, fontSize: 14 },
  input: {
    height: 40,
    borderColor: "#FF5900",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF5900",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  forgotText: {
    color: "black",
    fontSize: 12,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF5900",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: { marginHorizontal: 10, color: "#555" },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  socialIcon: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 50,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: { color: "#FF5900", marginLeft: 5, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  closeButton: { alignSelf: "flex-end" },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF5900",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#FF5900",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  successMessage: {
    backgroundColor: "#DFF5DD",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  successText: { color: "#3C763D", fontWeight: "600" },
});
