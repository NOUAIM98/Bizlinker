import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

export default function EventApplicationForm() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [eventName, setEventName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketCount, setTicketCount] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [other, setOther] = useState("");

  const resetStep2Fields = () => {
    setEventName("");
    setSelectedCategory("");
    setImage(null);
  };

  const handleNext = () => {
    if (step === 1) resetStep2Fields();
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const selectImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets?.length
      ) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("category", selectedCategory);
    formData.append("websiteURL", website);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("eventDate", eventDate);
    formData.append("eventTime", eventTime);
    formData.append("ticketType", ticketType);
    formData.append("ticketPrice", ticketPrice);
    formData.append("totalTickets", ticketCount);
    formData.append("facebook", facebook);
    formData.append("instagram", instagram);
    formData.append("otherPlatforms", other);

    if (image) {
      formData.append("photos[]", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.fileName || "event.jpg",
      });
    }

    try {
      const res = await fetch(
        "https://getbizlinker.site/backend/submitEventApplication.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Event submitted successfully.");
        setStep(1);
      } else {
        Alert.alert("Error", data.message || "Submission failed.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const categoryOptions = [
    { label: "Concerts", value: "concerts" },
    { label: "Festivals", value: "festivals" },
    { label: "Sports", value: "sports" },
    { label: "Workshops", value: "workshops" },
    { label: "Exhibitions", value: "exhibitions" },
    { label: "Conferences", value: "conferences" },
    { label: "Food & Drink", value: "food_drink" },
    { label: "Markets", value: "markets" },
    { label: "Outdoor Activities", value: "outdoor" },
    { label: "Networking", value: "networking" },
    { label: "Community Events", value: "community" },
    { label: "Theater & Performances", value: "theater" },
  ];

  const renderChips = (options, selectedValue, setSelected) => (
    <View style={styles.chipWrap}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => setSelected(option.value)}
          style={[
            styles.chip,
            selectedValue === option.value && styles.activeChip,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              selectedValue === option.value && styles.activeChipText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStepDots = () => (
    <View style={styles.stepContainer}>
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <View key={s} style={[styles.dot, step === s && styles.activeDot]} />
      ))}
    </View>
  );

  const stepScreens = {
    1: (
      <View style={styles.container}>
        {renderStepDots()}
        <Text style={styles.title}>Create an Event</Text>
        <Text style={styles.subtitle}>
          Share your events with a wider audience! From concerts to workshops
          and seminars, publish your events and reach your target audience
          easily.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    ),
    2: (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Event Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={eventName}
          onChangeText={setEventName}
        />
        <Text style={styles.label}>Select Category</Text>
        {renderChips(categoryOptions, selectedCategory, setSelectedCategory)}
        <TouchableOpacity style={styles.button} onPress={selectImage}>
          <Text style={styles.buttonText}>Upload Event Image</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ),
    3: (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Contact & Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Website URL"
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Event Location (Address)"
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Description"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ),
    4: (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Event Schedule</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Date"
          value={eventDate}
          onChangeText={setEventDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Event Time"
          value={eventTime}
          onChangeText={setEventTime}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ),
    5: (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Tickets & Socials</Text>
        <TextInput
          style={styles.input}
          placeholder="Ticket Type"
          value={ticketType}
          onChangeText={setTicketType}
        />
        <TextInput
          style={styles.input}
          placeholder="Ticket Price"
          value={ticketPrice}
          onChangeText={setTicketPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Available Tickets"
          value={ticketCount}
          onChangeText={setTicketCount}
          keyboardType="numeric"
        />
        <Text style={styles.sectionTitle}>Social Media (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Facebook"
          value={facebook}
          onChangeText={setFacebook}
        />
        <TextInput
          style={styles.input}
          placeholder="Instagram"
          value={instagram}
          onChangeText={setInstagram}
        />
        <TextInput
          style={styles.input}
          placeholder="Other"
          value={other}
          onChangeText={setOther}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ),
    6: (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Review & Submit</Text>
        <Text style={styles.notice}>
          Please review all your event details before submitting. Once reviewed
          by our team, your event will be published if approved.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    ),
  };

  return stepScreens[step] || null;
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6600",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF6600",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  label: { fontSize: 16, marginBottom: 10, fontWeight: "500", color: "#444" },
  button: {
    backgroundColor: "#FF6600",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: "#FF6600" },
  previewImage: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
  },
  notice: { fontSize: 14, color: "#666", marginTop: 10 },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#ECECEC",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: "#FF6600",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  activeChipText: {
    color: "#fff",
    fontWeight: "600",
  },
});