import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ServicesScreen from '../screens/ServicesScreen'; 
import AllCategoriesScreen from '../screens/AllCategoriesScreen'; 
import ServiceMain from '../screens/ServiceMain';
import ServiceDetail from '../screens/ServiceDetail'; 

const Stack = createStackNavigator();

export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="ServicesHome" component={ServicesScreen} />

      <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />

      <Stack.Screen name="ServiceMain" component={ServiceMain} />

      <Stack.Screen 
        name="ServiceDetail" 
        component={ServiceDetail} 
        options={{ 
          headerShown: false, 
          title: 'Service Details',
          headerBackTitle: 'Back',
        }}
      />

    </Stack.Navigator>
  );
}
