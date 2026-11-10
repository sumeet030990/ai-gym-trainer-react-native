import { Tabs } from 'expo-router';
import Ionicicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useUserProfile } from '../../src/hooks/useUserProfile';

// Workout and Diet are paid features: each tab only exists while the matching
// flag on /users/me is true, so a user without access can neither see the tab
// nor navigate into its routes.
export default function TabLayout() {
  const { data: profile } = useUserProfile();
  const isWorkoutAllowed = Boolean(profile?.user?.is_workout_allowed);
  const isNutritionAllowed = Boolean(profile?.user?.is_nutrition_allowed);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Protected guard={isWorkoutAllowed}>
        <Tabs.Screen
          name="Workout"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicicons name="barbell-outline" size={size} color={color} />,
          }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard={isNutritionAllowed}>
        <Tabs.Screen
          name="Diet"
          options={{
            tabBarIcon: ({ color, size }) => <Ionicicons name="fast-food-outline" size={size} color={color} />,
          }}
        />
      </Tabs.Protected>
      <Tabs.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
  
}
