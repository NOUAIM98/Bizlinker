import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import SplashScreenView from "./screens/SplashScreenView";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  const onLoginSuccess = (userData, token) => {
    setUser(userData);
    // Optionally save token to AsyncStorage here
  };

  const onLogout = () => {
    setUser(null);
    // Optionally clear AsyncStorage here
  };

  if (showSplash) {
    return <SplashScreenView onAnimationEnd={() => setShowSplash(false)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <TabNavigator
          key={user ? "authenticated" : "unauthenticated"}
          user={user}
          onLoginSuccess={onLoginSuccess}
          onLogout={onLogout}
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}