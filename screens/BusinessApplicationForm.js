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
import { BASE_URL } from "./api";

export default function BusinessApplicationForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    phone: "",
    websiteURL: "",
    description: "",
    location: "",
    openingDays: "",
    openingHours: "",
    instagram: "",
    facebook: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [govDoc, setGovDoc] = useState(null);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const selectImages = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1, selectionLimit: 0 },
      (response) => {
        if (!response.didCancel && !response.errorCode && response.assets) {
          setImages((prev) => [...prev, ...response.assets]);
        }
      }
    );
  };

  const selectGovDoc = () => {
    launchImageLibrary({ mediaType: "mixed" }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets) {
        setGovDoc(response.assets[0]);
      }
    });
  };

  const submitForm = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("category", selectedCategory);
    formData.append(
      "workingHours",
      JSON.stringify([{ day: form.openingDays, time: form.openingHours }])
    );
    formData.append("facebook", form.facebook);
    formData.append("instagram", form.instagram);
    formData.append("other", "");

    images.forEach((img, index) => {
      formData.append(`photos[${index}]`, {
        uri: img.uri,
        type: img.type ? img.type : "image/jpeg",
        name:
          img.fileName && img.fileName.includes(".")
            ? img.fileName
            : `photo${index}.jpg`,
      });
    });

    if (govDoc) {
      formData.append("governmentDoc", {
        uri: govDoc.uri,
        type: govDoc.type || "application/pdf",
        name: govDoc.fileName || "document.pdf",
      });
    }

    try {
      const response = await fetch(
        `${BASE_URL}/backend/submitBusinessApplication.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      const data = JSON.parse(text);

      if (data.success) {
        Alert.alert("Success", "Business application submitted!");
        setStep(1);
      } else {
        Alert.alert("Error", data.message || "Submission failed.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong while submitting.");
    }
  };

  const categories = [
    "Restaurants",
    "Health",
    "Hotels",
    "Fitness",
    "Automotive",
    "Education",
    "Banks",
    "Electronics",
    "Clothing Shops",
    "Beauty & Care",
    "Pet Services",
    "Supermarkets",
    "Real Estate",
  ];

  const renderStepDots = () => (
    <View style={styles.stepContainer}>
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <View key={s} style={[styles.dot, step === s && styles.activeDot]} />
      ))}
    </View>
  );

  const input = (placeholder, key, opts = {}) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={form[key]}
      onChangeText={(value) => handleChange(key, value)}
      {...opts}
    />
  );

  if (step === 1) {
    return (
      <View style={styles.container}>
        {renderStepDots()}
        <Text style={styles.title}>Add Your Business</Text>
        <Text style={styles.subtitle}>
          Join our platform to promote your business.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Start Application</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 2) {
    return (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Business Information</Text>
        {input("Business Name", "businessName")}
        <Text style={styles.sectionTitle}>Select a Category</Text>
        <View style={styles.tagContainer}>
          {categories.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.tag,
                selectedCategory === item && styles.tagSelected,
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedCategory === item && styles.tagTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={selectImages}>
          <Text style={styles.buttonText}>Upload Business Photos</Text>
        </TouchableOpacity>
        {images.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img.uri }}
            style={styles.previewImage}
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={selectGovDoc}>
          <Text style={styles.buttonText}>Upload Government Document</Text>
        </TouchableOpacity>
        {govDoc && (
          <Text style={{ textAlign: "center" }}>{govDoc.fileName}</Text>
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
    );
  }

  if (step === 3) {
    return (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {input("Business Email", "email", { keyboardType: "email-address" })}
        {input("Phone Number", "phone", { keyboardType: "phone-pad" })}
        {input("Website (optional)", "websiteURL", { keyboardType: "url" })}
        <Text style={styles.sectionTitle}>Description</Text>
        {input("Description", "description")}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (step === 4) {
    return (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Business Location</Text>
        {input("Full Address", "location")}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (step === 5) {
    return (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        {input("Opening Days", "openingDays")}
        {input("Opening Hours", "openingHours")}
        <Text style={styles.sectionTitle}>Social Media (Optional)</Text>
        {input("Instagram", "instagram")}
        {input("Facebook", "facebook")}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (step === 6) {
    return (
      <ScrollView style={styles.container}>
        {renderStepDots()}
        <TouchableOpacity style={styles.button} onPress={submitForm}>
          <Text style={styles.buttonText}>Submit Business</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6600",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 25,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6600",
    marginVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF6600",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
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
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  notice: { fontSize: 14, color: "#666", marginTop: 20, marginBottom: 15 },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#ECECEC",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagSelected: { backgroundColor: "#FF6600" },
  tagText: { fontSize: 14, color: "#333" },
  tagTextSelected: { color: "#fff", fontWeight: "600" },
});