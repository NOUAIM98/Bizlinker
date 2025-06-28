import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import BusinessStack from "./BusinessStack";
import EventStack from "./EventStack";
import SearchScreen from "../screens/SearchScreen";
import ServicesStack from "./ServicesStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ user, onLoginSuccess, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Businesses":
              iconName = focused ? "business" : "business-outline";
              break;
            case "Events":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Services":
              iconName = focused ? "construct" : "construct-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF5900",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Businesses" component={BusinessStack} />
      <Tab.Screen name="Events" component={EventStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Services" component={ServicesStack} />
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileStack
            {...props}
            user={user}
            onLoginSuccess={onLoginSuccess}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}