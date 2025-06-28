import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { fetchApprovedServices, BASE_URL } from "./api";
import ServiceApplicationForm from "./ServiceApplicationForm";

const categories = [
  {
    id: "1",
    title: "Design",
    services: "28 Services",
    image: require("../assets/graphic.jpg"),
  },
  {
    id: "2",
    title: "Cleaning Services",
    services: "25 Services",
    image: require("../assets/cleaning.jpg"),
  },
  {
    id: "3",
    title: "Painting",
    services: "32 Services",
    image: require("../assets/painting.png"),
  },
];

export default function ServicesScreen() {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchApprovedServices()
      .then((fetched) => {
        if (Array.isArray(fetched)) {
          setServices(fetched);
        } else {
          console.warn("Unexpected response format", fetched);
          setServices([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching services", error);
        setServices([]);
      });
  }, []);

  const getImageUrl = (photo) => {
    const photoStr = String(photo || "").trim();

    if (!photoStr || photoStr === "null" || photoStr === "undefined") {
      return `${BASE_URL}/backend/uploads/default.jpg`;
    }

    if (photoStr.startsWith("http")) return photoStr;

    return `${BASE_URL}/backend/${photoStr}`;
  };

  const renderServiceItem = ({ item }) => {
    const imageUrl = getImageUrl(item.photos);

    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() =>
          navigation.navigate("ServiceDetail", { serviceID: item.id })
        }
      >
        <Image source={{ uri: imageUrl }} style={styles.serviceImage} />
        <View style={styles.serviceInfo}>
          <View style={styles.providerContainer}>
            <Text style={styles.providerName}>{item.providerName}</Text>
          </View>

          <Text style={styles.serviceTitle}>{item.serviceName}</Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="location" size={16} color="#FF6600" />
            <Text style={styles.ratingText}>{item.location || "N/A"}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="#FF6600" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={styles.heroContainer}>
          <Image
            source={require("../assets/webdev.png")}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Find Top Services</Text>
            <Text style={styles.heroSubtitle}>
              From design to repairs, we've got you covered
            </Text>
          </View>
        </View>

        <View style={styles.containerInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllCategories")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("ServiceMain", { category: item.title })
                }
              >
                <Image source={item.image} style={styles.image} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.services}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sectionTitle}>Promoted Services</Text>
          <FlatList
            contentContainerStyle={{ paddingBottom: 40 }}
            data={services}
            keyExtractor={(item, index) =>
              item?.serviceID ? item.serviceID.toString() : `service-${index}`
            }
            renderItem={renderServiceItem}
          />

          <Modal visible={modalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-circle" size={30} color="#FF6600" />
              </TouchableOpacity>
              <ServiceApplicationForm />
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  containerInner: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 },
  heroContainer: {
    position: "relative",
    height: 200,
    overflow: "hidden",
    marginBottom: 20,
  },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6600",
    paddingTop: 20,
    paddingBottom: 20,
  },
  seeAll: { fontSize: 14, color: "#FF6600", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginRight: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: { width: "100%", height: 100, borderRadius: 10 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  cardSubtitle: { fontSize: 12, color: "gray", textAlign: "center" },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  serviceImage: { width: 130, height: 110, borderRadius: 10 },
  serviceInfo: { marginLeft: 15, justifyContent: "center", flex: 1 },
  serviceTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  serviceCategory: { fontSize: 14, color: "gray", marginTop: 3 },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  providerName: { fontSize: 14, fontWeight: "bold", color: "#333" },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  ratingText: { fontSize: 14, marginLeft: 5, color: "#444" },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6600",
    marginLeft: "auto",
  },
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
});