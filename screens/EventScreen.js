import React, { useState, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import EventApplicationForm from "./EventApplicationForm";
import { BASE_URL } from "./api";

const { width } = Dimensions.get("window");

const categories = [
  { id: "1", title: "Concerts", events: "45 Events", image: require("../assets/concert.jpeg") },
  { id: "2", title: "Festivals", events: "30 Events", image: require("../assets/festival.jpg") },
  { id: "3", title: "Theater", events: "20 Events", image: require("../assets/theater.jpg") },
];

const getImageUrl = (img) => {
  if (!img) return `${BASE_URL}/uploads/default.jpg`;
  if (img.startsWith("http")) return img;
  if (img.startsWith("uploads/")) return `${BASE_URL}/backend/${img}`;
  return `${BASE_URL}/backend/uploads/${img}`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function EventScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/backend/getEvents.php`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const renderEventImage = (item) => {
    if (item.photos && Array.isArray(item.photos) && item.photos.length > 1) {
      return (
        <Image
          source={{ uri: getImageUrl(item.photos[0]) }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <Image
          source={{ uri: getImageUrl(item.image || (item.photos && item.photos[0])) }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="#FF6600" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.heroContainer}>
          <Image source={require("../assets/conference.jpg")} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Discover Exciting Events</Text>
            <Text style={styles.heroSubtitle}>Concerts, workshops, festivals and more</Text>
          </View>
        </View>

        <View style={styles.containerInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.EventTitle}>Popular Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllCategories")}>
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
                onPress={() => navigation.navigate("EventMain", { category: item.title })}
              >
                <Image source={item.image} style={styles.image} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.events}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sectionTitle}>Promoted Events</Text>

          <FlatList
            data={events}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() => navigation.navigate("EventDetail", { eventID: item.id })}
              >
                {renderEventImage(item)}
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.name}</Text>
                  <Text style={styles.eventVenue}>{item.location}</Text>
                  <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {item.rating ? Number(item.rating).toFixed(1) : "4.5"}
                    </Text>
                    <Text style={styles.price}>${item.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="close-circle" size={30} color="#FF6600" />
          </TouchableOpacity>
          <EventApplicationForm />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  containerInner: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 },
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
  heroContainer: { position: "relative", height: 200, overflow: "hidden", marginBottom: 20 },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" },
  heroSubtitle: { fontSize: 14, color: "#eee", marginTop: 6, textAlign: "center" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  EventTitle: { fontSize: 20, fontWeight: "bold", color: "#FF6600" },
  sectionTitle: { marginTop: 30, marginBottom: 20, fontSize: 20, fontWeight: "bold", color: "#FF6600" },
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
  image: { width: "100%", height: 100, borderRadius: 10, resizeMode: "cover" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 5, textAlign: "center" },
  cardSubtitle: { fontSize: 12, color: "gray", textAlign: "center" },
  eventCard: {
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
  eventImage: { width: 130, height: 110, borderRadius: 10 },
  eventInfo: { marginLeft: 15, justifyContent: "center", flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  eventVenue: { fontSize: 14, color: "gray", marginTop: 3 },
  eventDate: { fontSize: 14, color: "gray", marginTop: 3 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  ratingText: { marginLeft: 5, marginRight: 10, fontWeight: "bold" },
  price: { marginLeft: "auto", fontWeight: "bold", color: "#FF6600" },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  closeButton: { alignSelf: "flex-end" },
});
