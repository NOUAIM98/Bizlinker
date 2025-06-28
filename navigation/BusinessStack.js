import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BusinessScreen from '../screens/BusinessScreen'; 
import AllCategoriesBusiness from '../screens/AllCategoriesBusiness';
import BusinessMain from '../screens/BusinessMain'; 
import BusinessDetail from '../screens/BusinessDetail';

const Stack = createStackNavigator();

export default function BusinessStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="BusinessHome" component={BusinessScreen} />

      <Stack.Screen name="AllCategories" component={AllCategoriesBusiness} />

      <Stack.Screen name="BusinessMain" component={BusinessMain} />

      <Stack.Screen name="BusinessDetail" component={BusinessDetail} />
      
    </Stack.Navigator>
  );
}
