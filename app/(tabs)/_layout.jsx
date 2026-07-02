import { Tabs } from 'expo-router';
import Ionicicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Workout"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicicons name="barbell-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Diet"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicicons name="fast-food-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
  
}