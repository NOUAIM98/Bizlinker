import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, fetchServiceInfo } from "./api";

export default function ServiceDetail({ route }) {
  const navigation = useNavigation();
  const { serviceID } = route.params;
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [buyModal, setBuyModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);

  // For messaging
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const getService = async () => {
      try {
        const data = await fetchServiceInfo(serviceID);
        setService(data);
      } catch (err) {
        setService(null);
      }
    };
    getService();
  }, [serviceID]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!serviceID) return;
      try {
        const res = await fetch(`${BASE_URL}/backend/getReviews.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewType: "service", serviceID }),
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.reviews)) {
          setReviews(json.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [serviceID]);

  const handleSubmitReview = () => {
    setReviewModal(false);
    setTitle("");
    setComment("");
    setRating(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "Unknown Date";
    const date = new Date(dateStr);
    return isNaN(date)
      ? "Unknown Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const getImageUrl = (photo) => {
    if (!photo || photo === "default.jpg") {
      return "https://via.placeholder.com/300x200.png?text=No+Image";
    }
    if (photo.startsWith("http")) return photo;
    return `${BASE_URL}/backend/${photo}`;
  };

  // --- Send Message Logic ---
  const sendMessage = async () => {
    if (!messageText.trim() || !service?.providerID) {
      Alert.alert("Error", "Cannot send empty message or no recipient.");
      return;
    }
    setSending(true);
    try {
      const stored = await AsyncStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;
      const senderID = user?.userID || user?.id;
      const receiverID = service.providerID;
      if (!senderID || !receiverID) throw new Error("User info missing.");
      const res = await fetch(`${BASE_URL}/submitMessage.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderID,
          receiverID,
          content: messageText.trim(),
          type: "text"
        })
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Message sent!");
        setMessageText('');
        setMessageModal(false);
      } else {
        Alert.alert('Error', data.message || 'Failed to send message.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error.');
    } finally {
      setSending(false);
    }
  };

  if (!service) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading service details...</Text>
      </View>
    );
  }

  const firstPhoto = getImageUrl(service.photos?.[0]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={{ color: '#FF5900', fontWeight: '600', fontSize: 18, marginLeft: 5 }}>Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: firstPhoto }} style={styles.serviceImage} />

      <View style={styles.infoContainer}>
        <Text style={styles.serviceTitle}>{service.serviceTitle}</Text>
        {!!service.price && <Text style={styles.price}>${service.price}</Text>}

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={styles.rating}>
            {reviews.length
              ? (
                  reviews.reduce(
                    (sum, r) => sum + parseFloat(r.rating || 0),
                    0
                  ) / reviews.length
                ).toFixed(1)
              : "N/A"}
          </Text>
          <Text style={styles.reviews}>
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </Text>
        </View>

        <View style={styles.providerContainer}>
          <Image
            source={{
              uri:
                service.profile ||
                "https://via.placeholder.com/100x100?text=User",
            }}
            style={styles.providerImage}
          />
          <Text style={styles.providerName}>{service.providerName}</Text>
        </View>

        <View style={styles.contactContainer}>
          {service.contact?.phone && (
            <Text style={styles.contactText}>
              <Ionicons name="call-outline" size={16} /> {service.contact.phone}
            </Text>
          )}
          {service.contact?.email && (
            <Text style={styles.contactText}>
              <Ionicons name="mail-outline" size={16} /> {service.contact.email}
            </Text>
          )}
          {service.location && (
            <Text style={styles.contactText}>
              <Ionicons name="location-outline" size={16} /> {service.location}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.buyButton} onPress={() => setPaymentModal(true)}>
          <Text style={styles.buyText}><Ionicons name="ticket-outline" size={16} /> Buy Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageButton} onPress={() => setMessageModal(true)}>
          <Text style={styles.messageText}><Ionicons name="chatbubble-outline" size={16} /> Send Message</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>About the Service</Text>
        <Text style={styles.description}>
          {service.description || "No description available."}
        </Text>

        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.summaryText}>
          {service.providerAbout || "No additional information provided."}
        </Text>

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => setReviewModal(true)}
        >
          <Text style={styles.reviewButtonText}>
            <Ionicons name="pencil-outline" size={16} /> Write a Review
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>All Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={{ color: "gray" }}>No reviews yet.</Text>
        ) : (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <Image
                source={{
                  uri: getImageUrl(
                    review.reviewerProfileImage || "default.jpg"
                  ),
                }}
                style={styles.reviewUserImage}
              />
              <View>
                <Text style={styles.reviewUserName}>
                  {review.reviewerName || `User #${review.reviewerID}`}
                </Text>
                <Text style={styles.reviewText}>{review.comment}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{review.rating}</Text>
                  <Text style={styles.reviewDate}>
                    {" "}
                    Written {formatDate(review.reviewDate || review.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
      {/* MESSAGE MODAL */}
      <Modal visible={messageModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setMessageModal(false)}>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Send a Message</Text>
            <Text style={styles.modalText}>Write your message below and the freelancer will respond as soon as possible.</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Message"
              multiline
              value={messageText}
              onChangeText={setMessageText}
            />
            <Text style={styles.modalText}>You can check your inbox for replies.</Text>
            <TouchableOpacity
              style={[styles.modalButton, sending && { backgroundColor: "#aaa" }]}
              onPress={sendMessage}
              disabled={sending}
            >
              <Text style={styles.modalButtonText}>{sending ? "Sending..." : "Send"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* PAYMENT MODAL */}
      <Modal visible={paymentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPaymentModal(false)}>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Complete Your Payment</Text>
            <Text style={styles.modalText}>Select Payment Method:</Text>

            <View style={styles.paymentOptions}>
              <TouchableOpacity style={styles.paymentOption}><Text>Credit Card</Text></TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}><Text>PayPal</Text></TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}><Text>Crypto</Text></TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Name on Card" />
            <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.smallInput]} placeholder="MM/YY" keyboardType="numeric" />
              <TextInput style={[styles.input, styles.smallInput]} placeholder="CVC" keyboardType="numeric" />
            </View>

            <Text style={styles.modalText}>Payments are handled by our secure partner.</Text>
            <Text style={styles.summaryText}>Total: $5</Text>

            <TouchableOpacity style={styles.modalButton} onPress={() => setPaymentModal(false)}>
              <Text style={styles.modalButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* REVIEW MODAL */}
      <Modal visible={reviewModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setReviewModal(false)}
            >
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <Text style={styles.modalText}>Your Rating:</Text>

            <View style={styles.starContainer}>
              {[...Array(5)].map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                  <Ionicons
                    name={i < rating ? "star" : "star-outline"}
                    size={24}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Date of experience"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Title Your Review"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Write your review here"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <Text style={styles.modalText}>
              By submitting, you agree to our review policy.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.modalButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  serviceImage: { width: '100%', height: 200 },
  infoContainer: { padding: 16 },
  serviceTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rating: { marginLeft: 4, fontSize: 16, fontWeight: '500' },
  reviews: { marginLeft: 8, color: '#666' },
  providerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  providerImage: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  providerName: { fontSize: 16, fontWeight: '500' },
  contactContainer: { marginVertical: 8 },
  contactText: { color: '#444', marginVertical: 2 },
  buyButton: { backgroundColor: '#FF5900', padding: 12, borderRadius: 8, marginVertical: 10 },
  buyText: { color: '#fff', textAlign: 'center', fontWeight: '500' },
  messageButton: { borderWidth: 1, borderColor: '#1876D2', padding: 12, borderRadius: 8, marginVertical: 5 },
  messageText: { color: '#1876D2', textAlign: 'center', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  description: { color: '#555', marginBottom: 10 },
  reviewSummary: { backgroundColor: '#eee', padding: 10, borderRadius: 6 },
  summaryText: { color: '#444' },
  reviewButton: { marginVertical: 10, borderWidth: 1, borderColor: '#333', padding: 10, borderRadius: 6 },
  reviewButtonText: { textAlign: 'center', color: '#333', fontWeight: '500' },
  reviewContainer: { flexDirection: 'row', marginVertical: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  reviewUserImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  reviewUserName: { fontWeight: 'bold' },
  reviewText: { color: '#555', marginVertical: 5, width: '40%' },
  reviewDate: { fontSize: 12, color: '#888' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { color: '#555', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 },
  modalButton: {
    backgroundColor: '#FF5900',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: { color: '#fff', textAlign: 'center' },
  closeButton: { alignSelf: 'flex-end' },
  paymentOptions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  paymentOption: { borderWidth: 1, borderColor: '#aaa', padding: 8, borderRadius: 6, width: '30%', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  smallInput: { width: '48%' },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }
});
