// screens/BusinessSettings.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Settings from "./Settings";
import { useNavigation } from "@react-navigation/native";

export default function BusinessSettings() {
  const [businessName, setBusinessName] = useState("My Business");
  const [email, setEmail] = useState("contact@business.com");
  const [phone, setPhone] = useState("+90 555 123 4567");
  const [address, setAddress] = useState("Mecidiyeköy, Istanbul");
const navigation = useNavigation(); // ← navigation objesini tanımlar

  const handleSave = () => {
    console.log("Business info saved!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
               style={{
                 flexDirection: 'row',
                 alignItems: 'center',
                 gap: 4,
                 padding: 10,
                 marginTop: 10,
                 marginLeft: 10,
               }}
onPress={() => navigation.goBack()}
             >
               <Ionicons name="arrow-back" size={24} color="#FF5900" />
               <Text style={{ color: '#FF5900', fontWeight: '600',fontSize: "18" }}>Back</Text>
             </TouchableOpacity>
      <Text style={styles.title}>Business Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#222",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#FF5900",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
