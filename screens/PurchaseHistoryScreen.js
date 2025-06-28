import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const initialPurchases = [
  {
    id: '1',
    title: 'Concert Ticket',
    category: 'Event',
    price: 50,
    date: '2025-03-20',
    image: require('../assets/concert.jpeg'),
    provider: 'Live Music Events',
  },
  {
    id: '2',
    title: 'Yoga Class Subscription',
    category: 'Service',
    price: 30,
    date: '2025-02-15',
    image: require('../assets/concert.jpeg'),
    provider: 'Yoga Center',
  },
  {
    id: '3',
    title: 'Cleaning Service',
    category: 'Service',
    price: 80,
    date: '2025-01-10',
    image: require('../assets/concert.jpeg'),
    provider: 'Home Cleaning Comp.',
  },
];

export default function PurchaseHistoryScreen() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Purchase History</Text>

      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>
                <Icon name="event" size={16} /> {item.date}
              </Text>
              <Text style={styles.cardCategory}>Category: {item.category}</Text>

              {item.image && (
                <Image source={item.image} style={styles.purchaseImage} />
              )}

              <Text style={styles.cardPrice}>${item.price}</Text>
              <Text style={styles.providerText}>Provider: {item.provider}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() => {}}
                color="blue"
                labelStyle={styles.viewDetailsButton}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
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
    fontSize: 18,
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  cardCategory: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  cardPrice: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 10,
  },
  purchaseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  providerText: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    fontStyle: 'italic',
  },
  viewDetailsButton: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
