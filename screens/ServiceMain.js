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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchApprovedServices, BASE_URL } from './api';

export default function ServiceMain() {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedCategory = route.params?.category || '';

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchApprovedServices()
      .then((res) => {
        const fetched = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setServices(fetched);
      })
      .catch((err) => console.error('Error fetching services', err));
  }, []);

  const filteredServices = Array.isArray(services)
    ? selectedCategory
      ? services.filter(
          (item) =>
            item.category?.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        )
      : services
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{selectedCategory}</Text>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.serviceID?.toString()}
        renderItem={({ item }) => {
          const imageUrl = item.photos?.startsWith('http')
            ? item.photos
            : `${BASE_URL}/${item.photos}`;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ServiceDetail', { service: item })}
            >
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.serviceName}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <View style={styles.row}>
                  <Ionicons name="location" size={14} color="#FF5900" />
                  <Text style={styles.location}>{item.location || 'N/A'}</Text>
                  <Text style={styles.price}>${item.servicePrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
  category: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#FF5900',
    marginLeft: 'auto',
    fontSize: 14,
  },
});
