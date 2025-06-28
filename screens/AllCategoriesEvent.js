import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', title: 'Concerts', image: require('../assets/concert.jpeg') },
  { id: '2', title: 'Festivals', image: require('../assets/festival.jpg') },
  { id: '3', title: 'Sports', image: require('../assets/sports.jpg') },
  { id: '4', title: 'Workshops', image: require('../assets/workshop.jpg') },
  { id: '5', title: 'Exhibitions', image: require('../assets/exhibition.png') },
  { id: '6', title: 'Conferences', image: require('../assets/conference.jpg') },
  { id: '7', title: 'Food & Drink', image: require('../assets/food.jpg') },
  { id: '8', title: 'Markets', image: require('../assets/market.jpg') },
  { id: '9', title: 'Outdoor Activities', image: require('../assets/outdoor.jpg') },
  { id: '10', title: 'Networking', image: require('../assets/networking.jpg') },
  { id: '11', title: 'Community Events', image: require('../assets/community.png') },
  { id: '12', title: 'Theater', image: require('../assets/theater.jpg') },
];

export default function AllCategoriesEvent({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>All Categories</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
      renderItem={({ item }) => (
  <TouchableOpacity 
    style={styles.categoryCard}
onPress={() =>
  navigation.navigate("EventMain", { category: item.title })
}
  >
    <Image source={item.image} style={styles.image} />
    <Text style={styles.categoryTitle}>{item.title}</Text>
  </TouchableOpacity>
)}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    paddingTop: 50, 
    paddingHorizontal: 10, 
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  backText: {
    color: '#FF5900',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  image: {
    width: 150,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});
