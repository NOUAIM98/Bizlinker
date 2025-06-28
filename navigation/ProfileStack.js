import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserProfile from "../screens/UserProfile";
import ProfileSettings from "../screens/ProfileSettings";
import Settings from "../screens/Settings";
import MessagesScreen from "../screens/MessagesScreen"; // This is your inbox/conversation list
import ChatScreen from "../screens/ChatScreen";         // Single chat window
import ReportsScreen from "../screens/ReportsScreen";
import FavouriteListScreen from "../screens/FavouriteListScreen";
import TicketsScreen from "../screens/TicketsScreen";
import MyReviewsScreen from "../screens/MyReviewsScreen";
import PurchaseHistoryScreen from "../screens/PurchaseHistoryScreen";
import NewReportScreen from "../screens/NewReportScreen";
import BusinessSettings from "../screens/BusinessSettings";
import ProfileScreen from "../screens/ProfileScreen"; // Fallback/optional

const Stack = createStackNavigator();

export default function ProfileStack({ user, onLoginSuccess, onLogout }) {
  return (
    <Stack.Navigator
      initialRouteName={user ? "UserProfile" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="UserProfile">
            {(props) => (
              <UserProfile {...props} user={user} onLogout={onLogout} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Tickets" component={TicketsScreen} />
          <Stack.Screen name="FavoriteList" component={FavouriteListScreen} />
          <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
          <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
          <Stack.Screen name="NewReport" component={NewReportScreen} />
          <Stack.Screen name="BusinessSettings" component={BusinessSettings} />
          <Stack.Screen name="ProfileScreen">
            {(props) => (
              <ProfileScreen {...props} user={user} onLogout={onLogout} />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
