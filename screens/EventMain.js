import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchEvents, BASE_URL } from './api';

export default function EventMain() {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedCategory = route.params?.category || "";

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents()
      .then((res) => {
        // Uncomment one of these depending on your actual API structure:
        // console.log("API full response:", res);
        // console.log("API .data:", res.data);

        // Try all, one will be your real data:
        if (Array.isArray(res)) setEvents(res);
        else if (Array.isArray(res.data)) setEvents(res.data);
        else if (Array.isArray(res.data?.data)) setEvents(res.data.data);
        else setEvents([]); // fallback
      })
      .catch((err) => console.error('Error fetching events', err));
  }, []);

  // Debug: see all category values
  // events.forEach((e) => console.log("Event category:", e.category));

  const filteredEvents = selectedCategory
    ? events.filter((item) =>
        (item.category || "")
          .toString()
          .toLowerCase()
          .trim() === selectedCategory.toLowerCase().trim()
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {selectedCategory ? `${selectedCategory} ` : "Events"}
      </Text>

      {filteredEvents.length === 0 ? (
        <Text style={styles.noEventsText}>No events found in this category.</Text>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item, i) => (item.eventID || item.id || i).toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            // Try to find image field, fallback to placeholder
            let imageUrl =
              item.image?.startsWith("http")
                ? item.image
                : item.image
                ? `${BASE_URL}/${item.image}`
                : "https://via.placeholder.com/300";

            // Try different field names for event details
            const eventName = item.eventName || item.name || "Untitled Event";
            const eventDate = item.eventDate || item.date || "";
            const address = item.address || item.location || "";

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('EventDetail', { event: item })
                }
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cardImage}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{eventName}</Text>
                  <Text style={styles.cardMeta}>{address}</Text>
                  <Text style={styles.cardDate}>{eventDate}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#FF5900",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5900",
    marginBottom: 20,
    textAlign: "center",
  },
  noEventsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
  card: {
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  cardMeta: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  cardDate: {
    fontSize: 13,
    color: "#FF5900",
    marginTop: 4,
    fontWeight: "600",
  },
});
