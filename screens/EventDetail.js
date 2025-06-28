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
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./api";

const { width } = Dimensions.get("window");

const getImageUrl = (img) => {
  if (!img) return `${BASE_URL}/uploads/default.jpg`;
  if (img.startsWith("http")) return img;
  if (img.startsWith("uploads/")) return `${BASE_URL}/backend/${img}`;
  return `${BASE_URL}/backend/uploads/${img}`;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function EventDetail({ route }) {
  const { eventID } = route.params;
  const navigation = useNavigation();

  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Review fields
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Loading state for reviews
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // DEBUG: Log mount
  useEffect(() => {
    console.log("EventDetail mounted with eventID:", eventID);
  }, []);

  // Fetch event details
  useEffect(() => {
    fetch(`${BASE_URL}/backend/getEvents.php`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((e) => e.id == eventID);
        if (found) setEvent(found);
      });
  }, [eventID]);

  // Fetch reviews
  const fetchEventReviews = () => {
    setReviewsLoading(true);
    fetch(`${BASE_URL}/backend/getReviews.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventID, reviewType: "event" }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched reviews", data); // DEBUG
        if (data.success) setReviews(data.reviews);
        setReviewsLoading(false);
      })
      .catch((e) => {
        setReviewsLoading(false);
        console.error("Reviews fetch failed", e);
      });
  };

  useEffect(fetchEventReviews, [eventID]);

  // Slideshow logic
  useEffect(() => {
    let timer;
    if (event && event.photos && event.photos.length > 1) {
      timer = setInterval(() => {
        setCurrentSlide((prev) =>
          (prev + 1) % event.photos.length
        );
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [event]);

  // Website logic for rating
  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      ).toFixed(1)
    : event?.rating || "4.5";

  if (!event) return <Text style={{ margin: 20 }}>Loading event...</Text>;

  // Main image slideshow
  const renderMainImage = () => {
    if (event.photos && event.photos.length > 1) {
      const uri = getImageUrl(event.photos[currentSlide]);
      return (
        <Image
          source={{ uri }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      );
    } else {
      const uri = getImageUrl(event.image || (event.photos && event.photos[0]));
      return (
        <Image
          source={{ uri }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      );
    }
  };

  // Submit review
  const submitReview = async () => {
    console.log("Submit Review button pressed");
    if (!reviewTitle || !reviewText || !reviewDate || !rating) {
      Alert.alert(
        "Error",
        `All fields required. title=${reviewTitle}, text=${reviewText}, date=${reviewDate}, rating=${rating}`
      );
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        eventID,
        reviewerID: 1, // Replace this with your userID
        reviewTitle,
        comment: reviewText,
        rating,
        reviewDate,
        reviewType: "event",
      };
      console.log("Payload", payload);
      const res = await fetch(`${BASE_URL}/backend/submitReview.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Review submit API result", data); // DEBUG
      if (data.success) {
        setReviewModal(false);
        setReviewTitle("");
        setReviewText("");
        setReviewDate("");
        setRating(0);
        fetchEventReviews(); // Immediately refetch reviews
        Alert.alert("Success", "Review submitted.");
      } else {
        Alert.alert("Error", data.message || "Review not submitted.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not submit review.");
      console.error("Review submit failed", err);
    }
    setSubmitting(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
      <Ionicons name="arrow-back" size={24} color="#FF5900" />
                      <Text style={{ color:'#FF5900', fontWeight:'600',fontSize: "18"}}>Back</Text>
                    </TouchableOpacity>
      <View>
        {renderMainImage()}
        {event.photos && event.photos.length > 1 && (
          <View style={styles.slideDots}>
            {event.photos.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { opacity: currentSlide === idx ? 1 : 0.3 },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <View style={styles.detailsRow}>
          <Ionicons name="calendar-outline" size={18} color="#333" />
          <Text style={styles.detailsText}>{formatDate(event.date)}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Ionicons name="location-outline" size={18} color="#333" />
          <Text style={styles.detailsText}>{event.location}</Text>
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => setPaymentModal(true)}
        >
          <Text style={styles.buyText}>
            <Ionicons name="ticket-outline" size={16} /> Buy Ticket
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF0000" : "#333"}
          />
          <Text style={styles.favoriteText}>
            {isFavorite ? "Saved" : "Save to Favorites"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => {
            console.log("Write a Review button clicked");
            setReviewModal(true);
          }}
        >
          <Text style={styles.reviewButtonText}>
            <Ionicons name="pencil-outline" size={16} /> Write a Review
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>About the Event</Text>
        <Text style={styles.description}>{event.description}</Text>

        <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
        <Text style={styles.ratingStars}>⭐ {avgRating}</Text>

        {reviewsLoading ? (
          <ActivityIndicator color="#FF6600" size="large" style={{ marginTop: 10 }} />
        ) : reviews.length === 0 ? (
          <Text style={{ color: "#888", marginTop: 10 }}>No reviews yet.</Text>
        ) : (
          reviews.map((rev, i) => (
            <View key={i} style={styles.reviewContainer}>
              <Image
                source={{
                  uri:
                    rev.reviewerProfileImage ||
                    "https://via.placeholder.com/60",
                }}
                style={styles.reviewUserImage}
              />
              <View>
                <Text style={styles.reviewUserName}>{rev.reviewerName}</Text>
                <Text style={styles.reviewText}>{rev.comment}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{rev.rating}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

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
            <Text style={styles.modalText}>Select Rating:</Text>
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
              placeholder="Date of Experience (YYYY-MM-DD)"
              value={reviewDate}
              onChangeText={setReviewDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Title Your Review"
              value={reviewTitle}
              onChangeText={setReviewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Write Your Review"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <Text style={styles.modalText}>
              By submitting, you agree to our community guidelines.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              disabled={submitting}
              onPress={() => {
                console.log("Submit Review button clicked");
                submitReview();
              }}
            >
              <Text style={styles.modalButtonText}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={paymentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPaymentModal(false)}
            >
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Complete Your Payment</Text>
            <Text style={styles.modalText}>Select Payment Method:</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity style={styles.paymentOption}>
                <Text>Credit Card</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}>
                <Text>PayPal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}>
                <Text>Crypto</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Name on Card" />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="numeric"
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="MM/YY"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="CVC"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.modalText}>
              Payments are handled by our secure partner.
            </Text>
            <Text style={styles.summaryText}>Total: ${event.price}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                Alert.alert("Success", "Payment Completed!");
                setPaymentModal(false);
              }}
            >
              <Text style={styles.modalButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 40 },
  backText: { color: '#FF6600', fontSize: 18, fontWeight: '600', marginLeft: 6 },
  eventImage: { width: width, height: 220 },
  slideDots: {
    position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center'
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6600', marginHorizontal: 3,
  },
  infoContainer: { padding: 16 },
  eventTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  detailsRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  detailsText: { fontSize: 16, marginLeft: 8, color: "#444" },
  buyButton: {
    backgroundColor: "#DFFFD6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  buyText: { fontSize: 16, fontWeight: "bold", color: "#008000" },
  favoriteButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginTop: 10, borderColor: "#FF6600", borderWidth: 1,
    paddingVertical: 10, borderRadius: 8,
  },
  favoriteText: { marginLeft: 10, fontSize: 16, fontWeight: "600", color: "#FF6600" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, color: "#333" },
  description: { fontSize: 14, color: "gray", marginTop: 5 },
  ratingStars: { fontSize: 16, color: "#FF6600", marginTop: 5, marginBottom: 10 },
  reviewContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#f8f8f8",
    padding: 10, borderRadius: 10, marginVertical: 5,
  },
  reviewUserImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewUserName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  reviewText: { fontSize: 14, color: "gray", marginTop: 5 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  rating: { fontSize: 16, marginLeft: 5, color: "#444" },
  reviewButton: {
    backgroundColor: "#FF6600", padding: 12, borderRadius: 10,
    alignItems: "center", marginVertical: 10,
  },
  reviewButtonText: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
  modalContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10,
    borderRadius: 5, marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#FF6600", padding: 12, borderRadius: 5, alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  closeButton: { position: "absolute", top: 10, right: 10 },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  paymentOption: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  summaryText: { fontWeight: 'bold', textAlign: 'center', fontSize: 16, marginTop: 10 },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  smallInput: { width: "47%" },
});
