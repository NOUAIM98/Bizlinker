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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "./api";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BusinessDetail() {
  const route = useRoute();
  const businessID = route?.params?.businessID;
  const [businessDetails, setBusinessDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]); // ✅ NEW
  const navigation = useNavigation();

  const getImageUrl = (img) => {
    if (!img || img === "default.jpg") return `${BASE_URL}/uploads/default.jpg`;
    if (img.startsWith("http")) return img;

    const cleanPath = img.includes("/uploads/")
      ? img
      : `uploads/${img.replace(/^\/?uploads\/?/, "")}`;
    return `${BASE_URL}/${cleanPath}`;
  };

  const fetchBusinessDetailsFromWebsite = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/backend/businessInfo.php?businessID=${businessID}`
      );
      const data = await res.json();
      if (data?.success || data?.status === "success") {
        setBusinessDetails(data.business);
      } else {
        setBusinessDetails(null);
      }
    } catch (err) {
      console.error("Error fetching business details", err);
      setBusinessDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessReviews = async () => {
    try {
      const res = await fetch(`${BASE_URL}/backend/getReviews.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewType: "business",
          id: businessID,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        console.warn("Failed to load reviews:", data.message);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  useEffect(() => {
    if (businessID) {
      fetchBusinessDetailsFromWebsite();
      fetchBusinessReviews(); // ✅ NEW
    }
  }, [businessID]);

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

  const handleSubmitReview = () => {
    setReviewModal(false);
    setTitle("");
    setComment("");
    setRating(0);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!businessDetails) {
    return (
      <View style={styles.container}>
        <Text>Business not found.</Text>
      </View>
    );
  }

  const {
    name,
    photos,
    about: description,
    phone,
    email,
    address,
    reviewSummary,
    workingHours,
  } = businessDetails;

  const photoUri = photos?.length
    ? getImageUrl(photos[0])
    : `${BASE_URL}/uploads/default.jpg`;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
                        <Text style={{ color:'#FF5900', fontWeight:'600',fontSize: "18"}}>Back</Text>
                      </TouchableOpacity>
      <Image source={{ uri: photoUri }} style={styles.businessImage} />

      <View style={styles.infoContainer}>
        <Text style={styles.businessTitle}>{name}</Text>

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

        <View style={styles.contactContainer}>
          {phone && (
            <Text style={styles.contactText}>
              <Ionicons name="call-outline" size={16} /> {phone}
            </Text>
          )}
          {email && (
            <Text style={styles.contactText}>
              <Ionicons name="mail-outline" size={16} /> {email}
            </Text>
          )}
          {address && (
            <Text style={styles.contactText}>
              <Ionicons name="location-outline" size={16} /> {address}
            </Text>
          )}
        </View>

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
            {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
          </Text>
        </TouchableOpacity>

        {workingHours && (
          <>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            {Array.isArray(workingHours)
              ? workingHours.map((wh, i) => (
                  <Text key={i} style={styles.workingHours}>
                    {wh.day}: {wh.hours}
                  </Text>
                ))
              : Object.entries(workingHours).map(([day, hours], i) => (
                  <Text key={i} style={styles.workingHours}>
                    {day}: {hours}
                  </Text>
                ))}
          </>
        )}

        {reviewSummary && (
          <>
            <Text style={styles.sectionTitle}>
              What People Think (AI Summary)
            </Text>
            <Text style={styles.aiSummary}>{reviewSummary}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>About the Business</Text>
        <Text style={styles.description}>
          {description?.trim() ? description : "No description available."}
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
          <Text style={{ color: "#777", marginTop: 5 }}>No reviews yet.</Text>
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

      {/* Review Modal */}
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
  container: { flex: 1, backgroundColor: "#fff" },
  businessImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  backButton: { flexDirection: "row", alignItems: "center", margin: 10 },
  backText: { marginLeft: 5, color: "#FF5900" },
  infoContainer: { padding: 20 },
  businessTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: { fontSize: 16, marginLeft: 5 },
  reviews: { marginLeft: 10, fontSize: 14, color: "gray" },
  contactContainer: { marginVertical: 10 },
  contactText: { fontSize: 14, marginVertical: 2 },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF6600",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF6600",
    fontWeight: "600",
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  description: { fontSize: 14, marginTop: 5, color: "#444" },
  reviewContainer: { flexDirection: "row", marginTop: 15 },
  reviewUserImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  reviewUserName: { fontWeight: "bold" },
  reviewText: { marginVertical: 5, color: "#333" },
  reviewDate: { fontSize: 12, color: "gray" },
  workingHours: { fontSize: 14, marginTop: 5, color: "#444" },
  aiSummary: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: "italic",
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  reviewButton: {
    backgroundColor: "#FF6600",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  modalButton: {
    backgroundColor: "#FF6600",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});