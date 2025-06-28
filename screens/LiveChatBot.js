import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LiveChatBot() {
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const toggleModal = () => setModalVisible(!modalVisible);

  const sendChatMessage = async (message) => {
    try {
      const response = await fetch(
        "https://getbizlinker.site/backend/chatgpt.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();
      return data.reply || "Sorry, I didn't understand that.";
    } catch (error) {
      return "Nova is currently offline. Try again later.";
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const botReply = await sendChatMessage(input);
    const botMessage = {
      id: Date.now() + 1,
      text: botReply,
      sender: "bot",
    };
    setMessages((prev) => [...prev, botMessage]);

    setInput("");
  };

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <Ionicons name="chatbubbles-outline" size={26} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chat with Nova 🤖</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="close" size={24} color="#FF6600" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.chatContainer}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#FF6600" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FF6600",
    padding: 15,
    borderRadius: 30,
    zIndex: 999,
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 70,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6600",
  },
  chatContainer: {
    padding: 20,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FFDDC1",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    fontSize: 14,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 20,
  },
});