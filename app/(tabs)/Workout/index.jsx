import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import SectionHeader from '../../../src/components/common/SectionHeader';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import WorkoutCard from '../../../src/components/cards/WorkoutCard';
import AppCard from '../../../src/components/cards/AppCard';
import AppText from '../../../src/components/common/AppText';
import { useTodayWorkout } from '../../../src/hooks/useWorkout';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';

const QUICK_LINKS = [
  { key: 'library', label: 'Exercise Library', icon: 'library-outline', color: colors.primary, background: colors.primaryContainer, href: '/Workout/library' },
  { key: 'history', label: 'History', icon: 'time-outline', color: colors.secondary, background: colors.secondaryContainer, href: '/Workout/history' },
];

export default function WorkoutHome() {
  const { data: workout, isLoading, isError, refetch } = useTodayWorkout();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Workout" title="Today's Workout" />

        {isLoading ? (
          <Loader height={260} />
        ) : isError ? (
          <ErrorView message="Couldn't load today's workout." onRetry={refetch} />
        ) : (
          <WorkoutCard
            title={workout.title}
            subtitle={workout.subtitle}
            exerciseCount={workout.exerciseCount}
            calories={workout.calories}
            duration={workout.duration}
            aiReason={workout.aiReason}
            onStart={() => router.push('/Workout/summary')}
            onRegenerate={refetch}
          />
        )}

        <View style={styles.section}>
          <SectionHeader title="Quick Access" />
          <View style={styles.quickLinks}>
            {QUICK_LINKS.map((link) => (
              <Pressable key={link.key} onPress={() => router.push(link.href)} style={styles.quickLinkWrap}>
                <AppCard style={styles.quickLinkCard}>
                  <View style={[styles.quickLinkIcon, { backgroundColor: link.background }]}>
                    <Ionicons name={link.icon} size={20} color={link.color} />
                  </View>
                  <AppText variant="labelLarge" numberOfLines={2} style={styles.quickLinkLabel}>
                    {link.label}
                  </AppText>
                </AppCard>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  section: {
    gap: 0,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickLinkWrap: {
    flexGrow: 1,
    flexBasis: '30%',
  },
  quickLinkCard: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkLabel: {
    textAlign: 'center',
  },
});
