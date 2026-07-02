import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.todaysActivityContainer}>
        <View>
          <Text>Good Morning</Text>
          <Text>Sumeet</Text>
        </View>
      </View>
        <View>
          <Text>Today's Workout</Text>
          <Text>Chest & Triceps</Text>
          <View>
          <View>

          <Text>8</Text>
          <Text>Exercises</Text>
          </View>
          <View>
          <Text>60</Text>
          <Text>Estimated Calories Burnt</Text>
          </View>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
  },
  todaysActivityContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 20,
    maxHeight: 300,
    backgroundColor: '#4F46E5',
  },
});
  