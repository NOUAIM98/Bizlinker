import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: '1', title: 'Restaurants', image: require('../assets/business1.jpg') },
  { id: '2', title: 'Health', image: require('../assets/hospital.jpg') },
  { id: '3', title: 'Hotels', image: require('../assets/hotel.png') },
  { id: '4', title: 'Fitness', image: require('../assets/fitness.jpeg') },
  { id: '5', title: 'Automotive', image: require('../assets/car.png') },
  { id: '6', title: 'Education', image: require('../assets/education.jpg') },
  { id: '7', title: 'Banks', image: require('../assets/bank.png') },
  { id: '8', title: 'Electronics', image: require('../assets/electronics.jpg') },
  { id: '9', title: 'Clothing Shops', image: require('../assets/clothes.jpg') },
  { id: '10', title: 'Beauty & Care', image: require('../assets/beauty.png') },
  { id: '11', title: 'Pet Services', image: require('../assets/pet.jpg') },
  { id: '12', title: 'Supermarkets', image: require('../assets/supermarket.jpg') },
  { id: '13', title: 'Real Estate', image: require('../assets/realestate.jpg') },
  { id: 'dummy', title: '', image: null }
];

export default function AllCategoriesBusiness() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Custom Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Page Title */}
      <Text style={styles.title}>All Categories</Text>

      {/* Category Grid */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
   renderItem={({ item }) => (
  <TouchableOpacity
    style={styles.categoryCard}
onPress={() => navigation.navigate("BusinessMain", { category: item.title })}
  >

  <Image source={item.image} style={styles.image} />
  <Text style={styles.categoryTitle} numberOfLines={1}>
    {item.title}
  </Text>
</TouchableOpacity>

        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    paddingTop: 40, 
    paddingHorizontal: 10 
  },

  backButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
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
    marginBottom: 20 
  },

  categoryCard: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  image: { 
    width: 150, 
    height: 120, 
    borderRadius: 10, 
    resizeMode: 'cover' 
  },

  categoryTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 10 
  },
});
