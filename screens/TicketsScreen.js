import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const ticketData = [
  { id: '1', eventName: 'Rock Concert', date: '2025-04-10', location: 'City Arena', price: '$50', seat: 'A12', image: require('../assets/concert.jpeg') },
  { id: '2', eventName: 'Art Exhibition', date: '2025-05-05', location: 'Downtown Gallery', price: '$30', seat: null, image: require('../assets/theater.jpg') },
];

export default function TicketsScreen() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigation = useNavigation();

  const generatePDF = async () => {
    if (!selectedTicket) return;
    
    const htmlContent = `
      <h1>${selectedTicket.eventName}</h1>
      <p><strong>Date:</strong> ${selectedTicket.date}</p>
      <p><strong>Location:</strong> ${selectedTicket.location}</p>
      <p><strong>Price:</strong> ${selectedTicket.price}</p>
      ${selectedTicket.seat ? `<p><strong>Seat:</strong> ${selectedTicket.seat}</p>` : ''}
    `;
  
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri, { mimeType: 'application/pdf' });
    } catch (error) {
      alert(`Error generating PDF: ${error.message}`);
    }
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
  <Text style={{ color: '#FF5900', fontWeight: '600' ,fontSize: "18" }}>Back</Text>
</TouchableOpacity>
      <Text style={styles.title}>My Tickets</Text>
      <FlatList
        data={ticketData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedTicket(item)}>
            <Card style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <Card.Content>
                <Text style={styles.cardTitle}>{item.eventName}</Text>
                <Text style={styles.cardCategory}>{item.date} - {item.location}</Text>
                <Text style={styles.cardPrice}>Price: {item.price}</Text>
                {item.seat && <Text style={styles.cardSeat}>Seat: {item.seat}</Text>}
              </Card.Content>
              <Divider />
              <Card.Actions>
            <Button style={styles.downloadButton} icon="event" mode="contained">
  View Details
</Button>

              </Card.Actions>
            </Card>
          </TouchableOpacity>
        )}
      />
      
      <Modal visible={!!selectedTicket} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedTicket && (
              <>
                <Image source={selectedTicket.image} style={styles.detailsImage} />
                <Text style={styles.detailsTitle}>{selectedTicket.eventName}</Text>
                <Text style={styles.detailsText}><Icon name="event" size={20} color="#555" /> <Text style={styles.boldText}>Date:</Text> {selectedTicket.date}</Text>
                <Text style={styles.detailsText}><Icon name="place" size={20} color="#555" /> <Text style={styles.boldText}>Location:</Text> {selectedTicket.location}</Text>
                <Text style={styles.detailsText}><Icon name="attach-money" size={20} color="#555" /> <Text style={styles.boldText}>Price:</Text> {selectedTicket.price}</Text>
                {selectedTicket.seat && <Text style={styles.detailsText}><Icon name="event-seat" size={20} color="#555" /> <Text style={styles.boldText}>Seat:</Text> {selectedTicket.seat}</Text>}
                <Text style={styles.detailsText}><Icon name="person" size={20} color="#555" /> <Text style={styles.boldText}>Organizer:</Text> Music Events Inc.</Text>
                <Text style={styles.detailsText}><Icon name="schedule" size={20} color="#555" /> <Text style={styles.boldText}>Duration:</Text> 3 hours</Text>
                <Text style={styles.descriptionText}>Experience an electrifying night with the best rock bands in the city. Be ready for an unforgettable show!</Text>
                <Button mode="contained" onPress={generatePDF} style={styles.downloadButton}>Download PDF</Button>
                <Button  onPress={() => setSelectedTicket(null)}>Close</Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { marginBottom: 12, borderRadius: 10, elevation: 4, backgroundColor: '#fff' },
  image: { width: '100%', height: 150, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 8 },
  cardCategory: { fontSize: 16, color: '#555', marginTop: 5 },
  cardPrice: { fontSize: 16, color: '#008000', marginTop: 5, fontWeight: 'bold' },
  cardSeat: { fontSize: 16, color: '#0000FF', marginTop: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: '#FFF', padding: 20, borderRadius: 10, alignItems: 'center' },
  detailsImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20 },
  detailsTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  detailsText: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  downloadButton: { marginTop: 10, backgroundColor: '#FF5900' },

});
