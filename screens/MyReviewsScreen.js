import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchServiceReviews } from './api.js';

export default function MyReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const navigation = useNavigation();
  const { params } = useRoute();
  const serviceID = params?.serviceID;

  useEffect(() => {
    if (!serviceID) return;
    fetchServiceReviews(serviceID)
      .then(response => setReviews(response.data))
      .catch(error => {
        console.error('Error fetching service reviews:', error);
        Alert.alert('Error', 'Could not load service reviews.');
      });
  }, [serviceID]);

  const deleteReview = (id) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setReviews(prev => prev.filter(r => (r.feedbackID || r.id) !== id)),
        },
      ]
    );
  };

  const filterReviews = (category) => setFilteredCategory(category);
  const filteredReviews = filteredCategory === 'all'
    ? reviews
    : reviews.filter(r => r.category === filteredCategory);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flexDirection:'row', alignItems:'center', gap:4, padding:10, marginTop:10, marginLeft:10 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FF5900" />
        <Text style={{ color:'#FF5900', fontWeight:'600',fontSize: "18"}}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>All Reviews</Text>
      <View style={styles.filterContainer}>
        {['all','business','event','service'].map(cat => (
          <TouchableOpacity key={cat} onPress={() => filterReviews(cat)} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredReviews.length === 0 ? (
        <Text style={styles.noReviews}>No reviews yet.</Text>
      ) : (
        <FlatList
          data={filteredReviews}
          keyExtractor={item => (item.feedbackID || item.id).toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}><Icon name="event" size={16}/> {item.date}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_,i)=>(
                    <Icon key={i} name="star" size={18} color={i<item.rating?'gold':'#ccc'} />
                  ))}
                  <Text style={styles.cardRating}>{item.rating}/5</Text>
                </View>
                {item.image && <Image source={item.image} style={styles.reviewImage}/>}  
                <Text style={styles.cardReview}>{item.review}</Text>
                <Text style={styles.providerText}>Provider: {item.provider}</Text>
                <Text style={styles.locationText}>Location: {item.location}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={()=>deleteReview(item.feedbackID||item.id)} color="red" labelStyle={styles.deleteButtonText}>Delete</Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#F5F5F5', paddingTop:50 },
  title: { fontSize:24, fontWeight:'bold', textAlign:'center', marginBottom:20 },
  filterContainer:{ flexDirection:'row', justifyContent:'space-around', marginBottom:15 },
  filterButton:{ padding:10, backgroundColor:'#ddd', borderRadius:8 },
  filterButtonText:{ fontSize:16, fontWeight:'bold' },
  noReviews:{ textAlign:'center', fontSize:16, color:'#777', marginTop:20 },
  card:{ marginBottom:16, padding:10, backgroundColor:'#fff', borderRadius:12, elevation:4 },
  cardTitle:{ fontSize:20, fontWeight:'bold', color:'#333' },
  cardDate:{ fontSize:14, color:'#777', marginTop:5 },
  ratingContainer:{ flexDirection:'row', alignItems:'center', marginTop:8 },
  cardRating:{ marginLeft:8, fontSize:16, color:'#555' },
  cardReview:{ fontSize:16, color:'#333', marginTop:10 },
  reviewImage:{ width:'100%', height:200, borderRadius:8, marginTop:10, marginBottom:10, resizeMode:'cover' },
  providerText:{ fontSize:14, color:'#444', marginTop:8, fontStyle:'italic' },
  locationText:{ fontSize:14, color:'#444', marginTop:5 },
  deleteButtonText:{ fontSize:14, fontWeight:'bold' },
});
