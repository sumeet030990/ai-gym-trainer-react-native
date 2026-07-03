import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import SettingsRow from '../../../src/components/common/SettingsRow';
import AppText from '../../../src/components/common/AppText';
import AppCard from '../../../src/components/cards/AppCard';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';

export default function AboutSettings() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Support" title="About" rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <View style={styles.logoWrap}>
            <Ionicons name="barbell" size={28} color={colors.onPrimary} />
          </View>
          <AppText variant="titleLarge" style={styles.appName}>
            AI Gym Trainer
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Version {version}
          </AppText>
        </View>

        <AppCard>
          <SettingsRow icon="apps-outline" label="Platform" value="React Native + Expo" right="value" />
          <SettingsRow icon="hardware-chip-outline" label="AI Engine" value="Groq" right="value" isLast />
        </AppCard>

        <AppText variant="bodySmall" color={colors.textSecondary} style={styles.footer}>
          AI Gym Trainer & Nutrition Coach helps you plan workouts, track nutrition, and stay consistent with AI-adapted
          guidance.
        </AppText>
      </ScrollView>
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
  content: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    marginBottom: 2,
  },
  footer: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
