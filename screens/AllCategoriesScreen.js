
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const categories = [
  { id: '1', title: 'Web Development', image: require('../assets/webdev.png') },
  { id: '2', title: 'Design', image: require('../assets/graphic.jpg') },
  { id: '3', title: 'Video Editing', image: require('../assets/video.jpg') },
  { id: '4', title: 'Cleaning Services', image: require('../assets/cleaning.jpg') },
  { id: '5', title: 'Painting', image: require('../assets/painting.png') },
  { id: '6', title: 'Electrical Repair', image: require('../assets/electrical.jpg') },
  { id: '7', title: 'Handyman Services', image: require('../assets/handyman.png') },
  { id: '8', title: 'Home Maintenance', image: require('../assets/maintenance.jpg') },
];
export default function AllCategoriesService() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>All Service Categories</Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() =>
              navigation.navigate('ServiceMain', { category: item.title })
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
