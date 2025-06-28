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
import { fetchPromotedBusinesses, BASE_URL } from './api';

export default function BusinessMain() {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedCategory = route.params?.category || '';

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchPromotedBusinesses()
      .then(data => setBusinesses(data))
      .catch(err => console.error('Error fetching businesses', err));
  }, []);

  const filteredBusinesses = selectedCategory
    ? businesses.filter(b =>
        b.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      )
    : businesses;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{selectedCategory || 'Businesses'}</Text>

      {filteredBusinesses.length === 0 ? (
        <Text style={styles.noText}>No businesses found in this category.</Text>
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: `${BASE_URL}/storage/${item.photos}` }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.businessName}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>4.5</Text>
                  <Text style={styles.reviews}>(100 reviews)</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#FF5900',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5900',
    marginBottom: 20,
    textAlign: 'center',
  },
  noText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rating: {
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 6,
  },
});
