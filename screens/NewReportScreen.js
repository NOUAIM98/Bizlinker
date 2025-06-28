import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createReport } from './api';

export default function NewReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [reportType, setReportType] = useState('Restaurant');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const typeMap = {
    Restaurant: 'Business',
    Business: 'Business',
    Event: 'Event',
    'Freelance Service': 'Service',
  };

  const handleSubmit = async () => {
    console.log("Submit clicked");
    if (!title || !description || !category || !reportType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('userData', userData);
      const user = userData ? JSON.parse(userData) : null;
      if (!user || !user.userID) {
        Alert.alert('Error', 'You must be logged in to report');
        setLoading(false);
        return;
      }

      // This matches your website's backend logic:
      const payload = {
        reportedBy: user.userID,
        targetType: typeMap[reportType],
        targetName: title.trim(),
        issue: category,
        details: description.trim(),
      };
      console.log('Payload', payload);

      const result = await createReport(payload);
      console.log('API Result', result);

      Alert.alert('Success', 'Your report has been submitted');
      navigation.goBack();
    } catch (err) {
      console.error('Report submit error', err.response?.data || err);
      Alert.alert(
        'Error',
        err.response?.data?.message ||
          'There was a problem submitting your report'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={{ color: '#FF5900', fontWeight: '600', fontSize: 18 }}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Create a New Report</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.radioContainer}>
        {['Customer Experience', 'Pricing', 'Staff Conduct', 'Other'].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.radioButton}
            onPress={() => setCategory(item)}
          >
            <View style={[styles.circle, category === item && styles.checkedCircle]} />
            <Text style={styles.radioText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Report Type</Text>
      <View style={styles.radioContainer}>
        {['Restaurant', 'Event', 'Freelance Service', 'Business'].map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.radioButton}
            onPress={() => setReportType(type)}
          >
            <View style={[styles.circle, reportType === type && styles.checkedCircle]} />
            <Text style={styles.radioText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20, paddingTop: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  radioContainer: { marginBottom: 20 },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  circle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FF5900',
    marginRight: 10,
  },
  checkedCircle: { backgroundColor: '#FF5900' },
  radioText: { fontSize: 15, color: '#333' },
  submitButton: {
    backgroundColor: '#FF5900',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
