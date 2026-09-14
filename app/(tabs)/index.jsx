import { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Loader from '../../src/components/common/Loader';
import ErrorView from '../../src/components/common/ErrorView';
import AppCard from '../../src/components/cards/AppCard';
import AppText from '../../src/components/common/AppText';
import PrimaryButton from '../../src/components/common/PrimaryButton';
import Avatar from '../../src/components/common/Avatar';
import SectionHeader from '../../src/components/common/SectionHeader';
import WorkoutCard from '../../src/components/cards/WorkoutCard';
import RestDayCard from '../../src/components/cards/RestDayCard';
import { useTodayWorkout, useWeekPlan, useRegenerationStatus, useRegeneratePlan } from '../../src/hooks/useWorkout';
import { useUserProfile } from '../../src/hooks/useUserProfile';
import { useAttendanceStreak } from '../../src/hooks/useAttendanceStreak';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

const QUICK_LINKS = [
  { key: 'library', label: 'Exercise Library', icon: 'library-outline', color: colors.primary, background: colors.primaryContainer, href: '/Workout/library' },
  { key: 'history', label: 'History', icon: 'time-outline', color: colors.secondary, background: colors.secondaryContainer, href: '/Workout/history' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Home() {
  const { data: profile } = useUserProfile();
  const { data: workout, isLoading: workoutLoading, isError: workoutError, refetch } = useTodayWorkout();
  const { data: week, isLoading: weekLoading } = useWeekPlan();
  const { data: streak, isLoading: streakLoading } = useAttendanceStreak(profile?.user?.id);
  const { data: regeneration } = useRegenerationStatus();
  const regeneratePlan = useRegeneratePlan();

  const [selectedDayKey, setSelectedDayKey] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const firstName = profile?.user?.first_name ?? 'there';
  const streakCount = streak?.streak ?? 0;
  const selectedDay = week?.find((day) => day.key === selectedDayKey) ?? null;
  const showDayPreview = Boolean(selectedDay && !selectedDay.isToday);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Avatar name={profile?.user?.first_name} size={48} />
          <View style={styles.headerText}>
            <AppText variant="bodyMedium" color={colors.textSecondary}>
              {getGreeting()}
            </AppText>
            <AppText variant="headlineSmall" numberOfLines={1}>
              {firstName}
            </AppText>
          </View>
          <Pressable
            onPress={() => {}}
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <Loader height={84} isLoading={streakLoading}>
            <AppCard style={styles.streakCard}>
              <View style={styles.streakIconWrap}>
                <Ionicons name="flame" size={24} color={colors.tertiary} />
              </View>
              <View style={styles.streakTextWrap}>
                <AppText variant="titleLarge">
                  {streakCount} {streakCount === 1 ? 'day' : 'days'}
                </AppText>
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  Current streak
                </AppText>
              </View>
              {streakCount > 0 ? (
                <View style={styles.streakBadge}>
                  <AppText variant="labelMedium" color={colors.onTertiaryContainer}>
                    Keep it up
                  </AppText>
                </View>
              ) : null}
            </AppCard>
          </Loader>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(120)}>
          <SectionHeader title="This Week" />
          <Loader height={72} isLoading={weekLoading}>
            <View style={styles.weekRow}>
              {week?.map((day) => {
                const isSelected = day.key === selectedDayKey;
                return (
                  <Pressable
                    key={day.key}
                    onPress={() => setSelectedDayKey((prev) => (prev === day.key ? null : day.key))}
                    style={styles.dayChip}
                  >
                    <AppText variant="labelSmall" color={colors.textSecondary}>
                      {day.letter}
                    </AppText>
                    <View
                      style={[
                        styles.dayNumberWrap,
                        day.isToday && styles.dayNumberToday,
                        isSelected && !day.isToday && styles.dayNumberSelected,
                      ]}
                    >
                      <AppText
                        variant="titleSmall"
                        color={day.isToday ? colors.onPrimary : isSelected ? colors.primary : colors.textPrimary}
                      >
                        {day.dayNumber}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.dayDot,
                        { backgroundColor: day.isRestDay ? colors.outline : colors.primary },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>
          </Loader>

          {showDayPreview ? (
            <View style={styles.dayPreviewWrap}>
              <View style={styles.dayPreviewHeader}>
                <AppText variant="labelLarge" color={colors.textSecondary} style={styles.dayPreviewTitle}>
                  Previewing {selectedDay.weekday}
                </AppText>
                <Pressable onPress={() => setSelectedDayKey(null)} hitSlop={8}>
                  <Ionicons name="close" size={18} color={colors.textSecondary} />
                </Pressable>
              </View>

              {selectedDay.isRestDay ? (
                <RestDayCard message={`No workout scheduled for ${selectedDay.weekday}.`} />
              ) : (
                <WorkoutCard
                  title={selectedDay.title}
                  subtitle={selectedDay.weekday}
                  exerciseCount={selectedDay.exerciseCount}
                  aiReason={selectedDay.notes}
                  badgeLabel={selectedDay.weekday.toUpperCase()}
                  badgeIcon="calendar-outline"
                />
              )}
            </View>
          ) : null}
        </Animated.View>

        {regeneration?.regeneration_required ? (
          <Animated.View entering={FadeInDown.duration(400).delay(140)}>
            <AppCard style={styles.banner} backgroundColor={colors.tertiaryContainer}>
              <View style={styles.bannerHeader}>
                <View style={styles.bannerIconWrap}>
                  <Ionicons name="bulb" size={18} color={colors.onTertiaryContainer} />
                </View>
                <AppText variant="titleMedium" color={colors.onTertiaryContainer} style={styles.bannerTitle}>
                  Time for a new plan
                </AppText>
              </View>
              <AppText variant="bodyMedium" color={colors.onTertiaryContainer} style={styles.bannerMessage}>
                {regeneration.reason ?? 'Your workout plan is due for a refresh.'}
              </AppText>
              <PrimaryButton
                onPress={() => regeneratePlan.mutate()}
                loading={regeneratePlan.isPending}
                style={styles.bannerAction}
              >
                Regenerate Plan
              </PrimaryButton>
            </AppCard>
          </Animated.View>
        ) : null}

        {showDayPreview ? null : (
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            {workoutLoading ? (
              <Loader height={220} />
            ) : workoutError || !workout ? (
              <ErrorView message="Couldn't load today's workout." onRetry={refetch} />
            ) : workout.isRestDay ? (
              <RestDayCard />
            ) : (
              <WorkoutCard
                title={workout.title}
                subtitle={workout.subtitle}
                exerciseCount={workout.exerciseCount}
                calories={workout.calories}
                duration={workout.duration}
                aiReason={workout.aiReason}
                onStart={() => router.push('/Workout')}
                onRegenerate={() => regeneratePlan.mutate()}
              />
            )}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
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
        </Animated.View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  streakIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tertiaryContainer,
  },
  streakTextWrap: {
    flex: 1,
    gap: 2,
  },
  streakBadge: {
    backgroundColor: colors.tertiaryContainer,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
    width: 40,
  },
  dayNumberWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberToday: {
    backgroundColor: colors.primary,
  },
  dayNumberSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
  },
  dayPreviewWrap: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  dayPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dayPreviewTitle: {
    flex: 1,
  },
  banner: {
    gap: spacing.xxs,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bannerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  bannerTitle: {
    flex: 1,
  },
  bannerMessage: {
    marginBottom: spacing.xs,
  },
  bannerAction: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
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
