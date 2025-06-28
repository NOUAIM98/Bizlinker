import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [secureText, setSecureText] = useState(true);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    // Simple email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignUp = async () => {
    if (!first_name || !last_name || !email || !password) {
      Alert.alert("Validation", "Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Validation", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://getbizlinker.site/backend/signup.php",
        {
          first_name,
          last_name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.status === "success" || data.success === true) {
        Alert.alert("Success", data.message || "Registered successfully");
        // Clear fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        // Navigate to Login after slight delay
        setTimeout(() => navigation.navigate("Login"), 1500);
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Get started with <Text style={{ color: "#FF5900" }}>Bizlinker!</Text>
      </Text>

      <Text style={styles.label}> First Name</Text>
      <TextInput
        placeholder="Enter your first name"
        style={styles.input}
        value={first_name}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <Text style={styles.label}> Last Name</Text>
      <TextInput
        placeholder="Enter your last name"
        style={styles.input}
        value={last_name}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <Text style={styles.label}> Email</Text>
      <TextInput
        placeholder="Enter your email address"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
      />
      <Text style={styles.label}> Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          style={styles.passwordInput}
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete="password"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.SignUpButton, loading && { opacity: 0.7 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.SignUpText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signinText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: "#FF5900",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "orange",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  SignUpButton: {
    backgroundColor: "#FF5900",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  SignUpText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signinText: {
    color: "#FF5900",
    marginLeft: 5,
  },
});