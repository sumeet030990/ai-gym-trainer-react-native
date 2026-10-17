import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import GoalsEditor from '../../../src/components/forms/goals/GoalsEditor';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function GoalsSettings() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Account" title="Goals" rightIcon="close" onRightPress={() => router.back()} />
      </View>
      <GoalsEditor onSaved={() => router.back()} onCleared={() => router.back()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    marginBottom: spacing.sm,
  },
});
