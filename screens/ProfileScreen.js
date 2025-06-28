

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [user] = useState({
    firstName: "Jane",
    lastName: "Doe",
    profilePicture: "default.jpg",
    messages: [],
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace("UserProfile", {
        user,
        onLogout: () => setIsLoggedIn(false),
      });
    }
  }, [isLoggedIn]);

  if (isLoggedIn) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Welcome to <Text style={{ color: "#FF5900" }}>Bizlinker</Text>
        </Text>
        <Text style={styles.bodyText}>Discover the best around you</Text>
        <Text style={styles.bodyText}>Businesses, Services, and Events</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 40,
  },
  bodyText: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  button: {
    borderWidth: 2,
    borderColor: "#FF5900",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});