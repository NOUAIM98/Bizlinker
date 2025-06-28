import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = "https://getbizlinker.site/backend";
const getMyUserID = async () => {
  const stored = await AsyncStorage.getItem('user');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed.userID || parsed.id;
  } catch {
    return null;
  }
};

export default function ConversationList() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyUserID().then(userID => {
      if (!userID) return;
      fetch(`${BASE_URL}/getConversations.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID })
      })
      .then(res => res.json())
      .then(data => {
        setConversations(data.conversations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.convoItem}
      onPress={() => navigation.navigate("Chat", {
        chat: { sender: item.partnerName, partnerID: item.partnerID }
      })}
    >
      <Text style={styles.name}>{item.partnerName}</Text>
      <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
      <Text style={styles.time}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : conversations.length === 0 ? (
        <Text style={styles.emptyText}>No messages yet.</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fb", padding: 20, paddingTop: 60 },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  emptyText: { textAlign: "center", marginTop: 30, color: "#888" },
  convoItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 18,
    elevation: 2,
  },
  name: { fontWeight: "bold", fontSize: 17, color: "#222" },
  lastMsg: { color: "#666", marginTop: 4, marginBottom: 2 },
  time: { color: "#bbb", fontSize: 12, marginTop: 4, textAlign: "right" },
});
