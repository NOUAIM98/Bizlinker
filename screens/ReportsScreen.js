import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReportsScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [expandedId, setExpandedId] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myUserID, setMyUserID] = useState(null);

  // Get logged-in user ID
  useEffect(() => {
    AsyncStorage.getItem('user').then(stored => {
      const user = stored ? JSON.parse(stored) : null;
      setMyUserID(user?.userID || user?.id);
    });
  }, []);

  // Fetch all reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://getbizlinker.site/backend/getReports.php');
      const data = await res.json();
      if (data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [isFocused]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Delete report (only own report)
  const handleDeleteReport = async (reportID) => {
    Alert.alert("Delete Report", "Are you sure you want to delete this report?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            const res = await fetch('https://getbizlinker.site/backend/deleteReport.php', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reportID }),
            });
            const data = await res.json();
            if (data.success) {
              setReports(reports.filter(r => (r.reportID || r.id) !== reportID));
            } else {
              Alert.alert('Error', data.message || 'Could not delete report.');
            }
          } catch {
            Alert.alert('Error', 'Network error.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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
          <Text style={{ color: '#FF5900', fontWeight: '600', fontSize: 18 }}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Reports</Text>

        {loading ? (
          <ActivityIndicator color="#FF5900" size="large" style={{ marginTop: 40 }} />
        ) : reports.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#777' }}>
            No reports yet.
          </Text>
        ) : (
          reports.map((report) => (
            <TouchableOpacity
              key={report.reportID || report.id}
              onPress={() => toggleExpand(report.reportID || report.id)}
              activeOpacity={0.85}
            >
              <View style={styles.card}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.title}>{report.targetName || report.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Only show delete button if user is the owner */}
                    {myUserID && (report.userID === myUserID) && (
                      <TouchableOpacity
                        style={{ marginRight: 8 }}
                        onPress={() => handleDeleteReport(report.reportID || report.id)}
                      >
                        <Ionicons name="trash" size={22} color="red" />
                      </TouchableOpacity>
                    )}
                    <Ionicons
                      name={
                        expandedId === (report.reportID || report.id)
                          ? 'chevron-up-outline'
                          : 'chevron-down-outline'
                      }
                      size={22}
                      color="#FF5900"
                    />
                  </View>
                </View>
                <Text style={styles.info}>Category: {report.issue || report.category}</Text>
                <Text style={styles.info}>Type: {report.targetType || report.type}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        (report.status || '').toLowerCase() === 'pending'
                          ? 'orange'
                          : (report.status || '').toLowerCase() === 'resolved'
                            ? 'green'
                            : '#007aff',
                    },
                  ]}
                >
                  Status: {report.status}
                </Text>
                {expandedId === (report.reportID || report.id) && (
                  <Text style={styles.description}>
                    {report.details || report.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewReport')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', paddingTop: 60 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  status: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    backgroundColor: '#FF5900',
    borderRadius: 50,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
