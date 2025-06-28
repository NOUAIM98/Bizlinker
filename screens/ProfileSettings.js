import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://getbizlinker.site/backend";

// Fetch user profile
async function getUserProfile(userID) {
  const res = await fetch(`${BASE_URL}/getUser.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID }),
  });
  const data = await res.json();
  if (data.success && data.user) return data.user;
  throw new Error(data.message || "Failed to fetch user profile");
}

// Update user profile
async function updateUserProfile({ userID, firstName, lastName, email, phone }) {
  const res = await fetch(`${BASE_URL}/updateUser.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID, firstName, lastName, email, phone }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to update profile");
  return data;
}

// Upload profile picture
async function uploadProfilePicture(uri, userID) {
  const formData = new FormData();
  formData.append("profilePicture", {
    uri,
    type: "image/jpeg",
    name: "profile.jpg",
  });
  formData.append("userID", userID);
  const res = await fetch(`${BASE_URL}/uploadProfilePicture.php`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to upload picture");
  return data;
}

// Delete account
async function deleteAccount(userID) {
  const res = await fetch(`${BASE_URL}/deleteAccount.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Error deleting account");
  return data;
}

export default function ProfileSettings() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userID, setUserID] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem("user");
        let id = "";
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          id = userObj.userID || userObj.id;
        }
        setUserID(id);
        if (!id) return;
        const user = await getUserProfile(id);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        if (user.profilePicture) {
          setProfileImage(`${BASE_URL}/uploads/${user.profilePicture}`);
        }
      } catch (err) {
        setMessage("Failed to load profile");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!email) {
        setMessage("Email is required.");
        setMessageType("error");
        return;
      }
      await updateUserProfile({ userID, firstName, lastName, email, phone });
      if (profileImage && !profileImage.startsWith("http")) {
        await uploadProfilePicture(profileImage, userID);
      }
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Failed to update profile.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteAccount(userID);
              setMessage("Account deleted. Logging out...");
              setMessageType("success");
              await AsyncStorage.removeItem("user");
              setTimeout(() => {
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
              }, 1200);
            } catch (err) {
              setMessage(err.message || "Error deleting account");
              setMessageType("error");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Profile Settings</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require("../assets/emily.jpg")}
          style={styles.profileImage}
        />
        <Ionicons name="camera" size={24} color="#555" style={styles.cameraIcon} />
      </TouchableOpacity>
      <Input label="First Name" value={firstName} onChange={setFirstName} />
      <Input label="Last Name" value={lastName} onChange={setLastName} />
      <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
      <Input label="Phone Number" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Ionicons name="trash" size={20} color="#fff" />
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
      {message !== "" && (
        <View
          style={[
            styles.messageBox,
            { backgroundColor: messageType === "success" ? "#ff5900" : "#d9534f" },
          ]}
        >
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
    </ScrollView>
  );
}

function Input({ label, value, onChange, keyboardType, secure = false }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        secureTextEntry={secure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  backButton: { flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 10 },
  backText: { color: "#FF5900", fontWeight: "600", marginLeft: 5 },
  title: { fontSize: 22, fontWeight: "bold", alignSelf: "center", marginBottom: 20 },
  imageContainer: { alignSelf: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#ddd" },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", padding: 5, borderRadius: 50 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: "#555", marginBottom: 5, fontWeight: "600" },
  input: { height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, paddingHorizontal: 10, fontSize: 16 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancelButton: { backgroundColor: "#fff", borderColor: "#222", padding: 15, borderRadius: 10, flex: 1, marginRight: 10, alignItems: "center", borderWidth: 1 },
  saveButton: { backgroundColor: "#FF5900", padding: 15, borderRadius: 10, flex: 1, alignItems: "center" },
  cancelButtonText: { fontSize: 16, color: "#222" },
  buttonText: { fontSize: 16, color: "#fff" },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  messageBox: {
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 20,
  },
  messageText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

