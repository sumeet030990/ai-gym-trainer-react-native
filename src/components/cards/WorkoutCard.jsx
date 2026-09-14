import { Fragment } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import PrimaryButton from '../common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { elevation } from '../../theme/elevation';

export default function WorkoutCard({
  title,
  subtitle,
  exerciseCount,
  calories,
  duration,
  aiReason,
  badgeLabel,
  badgeIcon,
  onStart,
  onRegenerate,
}) {
  return (
    <LinearGradient colors={['#4F46E5', '#6D5AF5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.badge}>
        <Ionicons name={badgeIcon ?? (aiReason ? 'sparkles' : 'flash')} size={12} color={colors.white} />
        <AppText variant="labelSmall" color={colors.white} style={styles.badgeText}>
          {badgeLabel ?? (aiReason ? 'AI ADJUSTED' : "TODAY'S WORKOUT")}
        </AppText>
      </View>

      <AppText variant="headlineSmall" color={colors.white} style={styles.title}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="bodyMedium" color="rgba(255,255,255,0.8)">
          {subtitle}
        </AppText>
      ) : null}

      {aiReason ? (
        <View style={styles.reasonBanner}>
          <Ionicons name="bulb-outline" size={14} color={colors.white} style={styles.reasonIcon} />
          <AppText variant="bodySmall" color="rgba(255,255,255,0.9)" style={styles.reasonText}>
            {aiReason}
          </AppText>
        </View>
      ) : null}

      <View style={styles.statsRow}>
        {[
          { icon: 'barbell-outline', value: exerciseCount, label: 'Exercises' },
          { icon: 'flame-outline', value: calories, label: 'Est. Calories' },
          { icon: 'time-outline', value: duration, label: 'Duration' },
        ]
          .filter((stat) => stat.value !== null && stat.value !== undefined)
          .map((stat, index, stats) => (
            <Fragment key={stat.label}>
              <Stat icon={stat.icon} value={stat.value} label={stat.label} />
              {index < stats.length - 1 ? <View style={styles.divider} /> : null}
            </Fragment>
          ))}
      </View>

      {onStart ? (
        <PrimaryButton
          icon="play"
          onPress={onStart}
          buttonColor={colors.white}
          textColor={colors.primary}
          style={styles.cta}
        >
          Start Workout
        </PrimaryButton>
      ) : null}

      {aiReason && onRegenerate ? (
        <Pressable onPress={onRegenerate} hitSlop={8} style={styles.regenerate}>
          <Ionicons name="refresh" size={14} color="rgba(255,255,255,0.85)" />
          <AppText variant="labelMedium" color="rgba(255,255,255,0.85)">
            Not feeling it? Get another suggestion
          </AppText>
        </Pressable>
      ) : null}
    </LinearGradient>
  );
}

function Stat({ icon, value, label }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color="rgba(255,255,255,0.85)" />
      <AppText variant="titleMedium" color={colors.white} style={styles.statValue}>
        {value}
      </AppText>
      <AppText variant="bodySmall" color="rgba(255,255,255,0.75)">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...elevation.level2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    gap: 4,
    marginBottom: spacing.sm,
  },
  badgeText: {
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 2,
  },
  reasonBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.xxs,
  },
  reasonIcon: {
    marginTop: 1,
  },
  reasonText: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    marginTop: 2,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cta: {
    marginTop: spacing.xs,
  },
  regenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    marginTop: spacing.sm,
  },
});
