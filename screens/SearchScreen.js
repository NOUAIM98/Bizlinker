import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;

const typeOptions = ["Business", "Events", "Services"];

const businessCategories = [
  "Restaurants", "Health", "Hotels", "Fitness", "Automotive",
  "Education", "Banks", "Electronics", "Clothing Shops",
  "Beauty & Care", "Pet Services", "Supermarkets", "Real Estate"
];

const eventCategories = [
  "Concerts", "Festivals", "Sports", "Workshops", "Exhibitions",
  "Conferences", "Food & Drink", "Markets", "Outdoor Activities",
  "Networking", "Community Events", "Theater"
];

const serviceCategories = [
  "Web Development", "Design", "Video Editing", "Cleaning Services",
  "Painting", "Electrical Repair", "Handyman Services", "Home Maintenance"
];

const locations = ["Nicosia", "Kyrenia", "Famagusta", "Guzelyurt", "Iskele", "Lefke"];
const ratings = ["★", "★★", "★★★", "★★★★", "★★★★★"];

export default function SearchScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [type, setType] = useState("Business");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const getCategories = () => {
    switch (type) {
      case "Business": return businessCategories;
      case "Events": return eventCategories;
      case "Services": return serviceCategories;
      default: return [];
    }
  };

  const toggleTag = (value, selected, setSelected) => {
    setSelected(selected === value ? "" : value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover Local Gems</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search for something..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterButton}>
          <Feather name="filter" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.emptyState}>
        <Image source={require("./search.png")} style={styles.emptyImage} />
        <Text style={styles.emptyText}>Start exploring your city now!</Text>
      </View>

      <Modal animationType="slide" transparent visible={filterVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Search</Text>
                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Feather name="x" size={24} />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Type</Text>
              <View style={styles.tagRow}>
                {typeOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.tag, type === item && styles.activeTag]}
                    onPress={() => setType(item)}
                  >
                    <Text style={type === item && styles.activeText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.tagRow}>
                {getCategories().map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.tag, category === item && styles.activeTag]}
                    onPress={() => toggleTag(item, category, setCategory)}
                  >
                    <Text style={category === item && styles.activeText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>City</Text>
              <View style={styles.tagRow}>
                {locations.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.tag, location === item && styles.activeTag]}
                    onPress={() => toggleTag(item, location, setLocation)}
                  >
                    <Text style={location === item && styles.activeText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.tagRow}>
                {ratings.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.tag, selectedRating === item && styles.activeTag]}
                    onPress={() => toggleTag(item, selectedRating, setSelectedRating)}
                  >
                    <Text style={selectedRating === item && styles.activeText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
<TouchableOpacity
  style={styles.applyButton}
  onPress={() => {
    console.log("Type:", type);
    console.log("Category:", category);
    console.log("Location:", location);
    console.log("Rating:", selectedRating);
    setFilterVisible(false); // Modalı kapatır
  }}
>
  <Text style={styles.applyButtonText}>Apply Filters</Text>
</TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5", marginTop: 50 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, marginLeft: 10, color: "#333" },
  filterButton: {
    backgroundColor: "#FF5900",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  emptyState: { alignItems: "center", marginTop: 30 },
  emptyImage: { width: 200, height: 200, resizeMode: "contain" },
  emptyText: { marginTop: 10, fontSize: 16, color: "#666" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    height: screenHeight * 0.85,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  activeTag: {
    backgroundColor: "#FA752E",
  },
  activeText: {
    fontWeight: "bold",
    color: "#333",
  },
  applyButton: {
  backgroundColor: "#FF5900",
  paddingVertical: 14,
  borderRadius: 12,
  marginTop: 25,
  alignItems: "center",
},
applyButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},

});
