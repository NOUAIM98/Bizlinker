import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Settings() {
  const navigation = useNavigation();

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

      <Text style={styles.title}>Settings</Text>

      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('ProfileSettings')}
        >
          <Ionicons name="person-outline" size={22} style={styles.icon} />
          <Text style={styles.optionText}>Profile Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('BusinessSettings')}
        >
          <Ionicons name="briefcase-outline" size={22} style={styles.icon} />
          <Text style={styles.optionText}>Business Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', paddingTop: 50 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 40,
    color: '#333',
  },
  optionContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});