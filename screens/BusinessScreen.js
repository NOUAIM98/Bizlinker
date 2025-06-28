import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BusinessApplicationForm from "./BusinessApplicationForm";
import { BASE_URL } from "./api";

const popularCategories = [
  {
    id: "1",
    title: "Restaurants",
    services: "68 Businesses",
    image: require("../assets/restaurant.jpg"),
  },
  {
    id: "2",
    title: "Hotels",
    services: "45 Businesses",
    image: require("../assets/hotel.png"),
  },
  {
    id: "3",
    title: "Fitness",
    services: "38 Businesses",
    image: require("../assets/fitness.jpeg"),
  },
];

export default function BusinessesScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [promotedBusiness, setPromotedBusiness] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/backend/getAllBusinesses.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPromotedBusiness(data.businesses);
        else console.error("Failed to load businesses:", data.message);
      })
      .catch((error) => {
        console.error("Failed to fetch promoted businesses:", error);
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Businesses</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="#FF6600" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.heroContainer}>
          <Image
            source={require("../assets/business.jpg")}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Explore Local Businesses</Text>
            <Text style={styles.heroSubtitle}>
              Find the best places in your city
            </Text>
          </View>
        </View>

        <View style={styles.containerInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllCategories")}
            >
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("BusinessMain", { category: item.title })
                }
              >
                <Image source={item.image} style={styles.image} />
                <Text
                  style={styles.cardTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle}>{item.services}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sectionTitlePromoted}>Promoted Businesses</Text>
          <FlatList
            data={promotedBusiness}
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => {
              const firstPhoto = Array.isArray(item.photos)
                ? item.photos[0]
                : typeof item.photos === "string"
                ? item.photos.split(",")[0]
                : null;

              const photoUri = firstPhoto
                ? firstPhoto.startsWith("http")
                  ? firstPhoto
                  : `${BASE_URL}/uploads/${firstPhoto}`
                : "https://via.placeholder.com/150";

              return (
                <TouchableOpacity
                  style={styles.businessCard}
                  onPress={() =>
                    navigation.navigate("BusinessDetail", {
                      businessID: item.id, // ✅ Correct!
                    })
                  }
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.businessImage}
                  />
                  <View style={styles.businessInfo}>
                    <Text style={styles.businessTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.businessCategory}>{item.about}</Text>
                    <Text style={styles.businessLocation}>{item.location}</Text>

                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                      <Text style={styles.reviewText}>
                        ({item.reviews} reviews)
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={30} color="#FF6600" />
          </TouchableOpacity>
          <BusinessApplicationForm />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  containerInner: { paddingHorizontal: 16, paddingTop: 10 },
  businessContainer: {
    backgroundColor: "#FF6600",
    padding: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSubText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6600",
  },
  seeAllButton: { fontSize: 14, color: "#FF6600", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    width: 160,
    textAlign: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: { width: "100%", height: 100, borderRadius: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  cardSubtitle: { fontSize: 12, color: "gray" },
  sectionTitlePromoted: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6600",
    marginTop: 30,
    marginBottom: 20,
  },
  businessCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  businessImage: { width: 130, height: 110, borderRadius: 10 },
  businessInfo: { marginLeft: 15, justifyContent: "center", flex: 1 },
  businessTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  businessCategory: { fontSize: 14, color: "gray", marginTop: 3 },
  businessLocation: { fontSize: 13, color: "gray", marginTop: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  ratingText: { marginLeft: 4, fontWeight: "bold", color: "#333" },
  reviewText: { fontSize: 12, color: "gray", marginLeft: 5 },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 50,
  },
  closeButton: { alignSelf: "flex-end" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#FF6600" },
  heroContainer: {
    position: "relative",
    height: 200,
    overflow: "hidden",
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 6,
    textAlign: "center",
  },
});