import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EventScreen from '../screens/EventScreen'; 
import AllCategoriesEvent from '../screens/AllCategoriesEvent';
import EventMain from '../screens/EventMain'; 
import EventDetail from '../screens/EventDetail';

const Stack = createStackNavigator();

export default function EventStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventHome" component={EventScreen} />
      <Stack.Screen name="AllCategories" component={AllCategoriesEvent} />
      <Stack.Screen name="EventMain" component={EventMain} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
    </Stack.Navigator>
  );
}