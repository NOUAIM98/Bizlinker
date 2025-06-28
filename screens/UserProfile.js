import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Avatar, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import LiveChatBot from "./LiveChatBot";

export default function UserProfile({ user: passedUser, onLogout }) {
  const navigation = useNavigation();
  const route = useRoute();

  const user =
    passedUser ??
    route.params?.user ?? {
      firstName: "Guest",
      lastName: "",
      profilePicture: "uploads/default.jpg",
      messages: [],
    };

  const profileUri =
    typeof user?.profilePicture === "string" && user.profilePicture !== ""
      ? user.profilePicture.startsWith("http")
        ? user.profilePicture
        : `https://getbizlinker.site/backend/${user.profilePicture}`
      : "https://getbizlinker.site/uploads/default.jpg";

  const [profilePhoto, setProfilePhoto] = useState(profileUri);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  // Helper for correct navigation to stack screens in Profile tab
  const goToProfileScreen = (screen) =>
    navigation.navigate("Profile", { screen });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="logout" size={24} onPress={handleLogout} />
          <IconButton
            icon="chat-outline"
            size={24}
            onPress={() =>
              goToProfileScreen("Messages")
            }
          />
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Avatar.Image source={{ uri: profilePhoto }} size={90} />
            <IconButton icon="pencil" size={20} style={styles.editIcon} />
          </TouchableOpacity>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem
            title="My Reviews"
            icon="account-circle-outline"
            onPress={() => goToProfileScreen("MyReviews")}
          />
          <MenuItem
            title="My Tickets"
            icon="ticket-outline"
            onPress={() => goToProfileScreen("Tickets")}
          />
          <MenuItem
            title="Purchase History"
            icon="wallet-outline"
            onPress={() => goToProfileScreen("PurchaseHistory")}
          />
          <MenuItem
            title="Favourite List"
            icon="star-outline"
            onPress={() => goToProfileScreen("FavoriteList")}
          />
          <MenuItem
            title="Reports"
            icon="file-outline"
            onPress={() => goToProfileScreen("Reports")}
          />
          <MenuItem
            title="Settings"
            icon="cog-outline"
            onPress={() => goToProfileScreen("Settings")}
          />
        </View>
      </ScrollView>
      <LiveChatBot />
    </SafeAreaView>
  );
}

const MenuItem = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <IconButton icon={icon} size={24} />
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <IconButton icon="chevron-right" size={24} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
  },
});
