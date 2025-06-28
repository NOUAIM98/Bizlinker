import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Avatar, Card } from 'react-native-paper';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const messages = route.params?.messages || [];

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
  <Text style={{ color: '#FF5900', fontWeight: '600' }}>Back</Text>
</TouchableOpacity>
      <Text style={styles.header}>Messages</Text>
      {messages.length > 0 ? (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { chat: item })}>
              <Card style={styles.messageCard}>
                <View style={styles.row}>
                  <Avatar.Image source={{ uri: item.senderPhoto }} size={50} />
                  <View style={styles.textContainer}>
                    <Text style={styles.sender}>{item.sender}</Text>
                    <Text style={styles.lastMessage}>{item.text}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No messages yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20, paddingTop: 60 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  messageCard: { marginBottom: 10, padding: 15, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center' },
  textContainer: { marginLeft: 10 },
  sender: { fontSize: 16, fontWeight: 'bold' },
  lastMessage: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16 },
});
