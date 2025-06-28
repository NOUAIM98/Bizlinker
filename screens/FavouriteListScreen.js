import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const favoriteData = [
  { id: '1', name: 'Cozy Cafe', category: 'Restaurant', icon: 'restaurant', location: 'Downtown', image: require('../assets/business7.jpg') },
  { id: '2', name: 'XX Festival', category: 'Event', icon: 'music-note', location: 'City Park', image: require('../assets/festival.jpg') },
  
];

export default function FavoriteListScreen() {
  const [favorites, setFavorites] = useState(favoriteData);
const navigation = useNavigation();

  const removeItem = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
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
  <Text style={{ color: '#FF5900', fontWeight: '600',fontSize: "18"}}>Back</Text>
</TouchableOpacity>
      <Text style={styles.title}>Favorite List</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardLocation}><Icon name="place" size={16} color="#555" /> {item.location}</Text>
              </View>
              <Button mode="contained" onPress={() => removeItem(item.id)} style={styles.removeButton}>
                Remove
              </Button>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  card: { marginBottom: 10, borderRadius: 12, elevation: 4, backgroundColor: '#fff', padding: 0 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardCategory: { fontSize: 14, color: '#666' },
  cardLocation: { fontSize: 14, color: '#444', marginTop: 5 },
  removeButton: { backgroundColor: '#D32F2F', marginLeft: 10, borderRadius: 8 },
});
