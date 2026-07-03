import { View, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import ProgressRing from '../common/ProgressRing';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

const MACROS = [
  { key: 'protein', label: 'Protein', color: colors.secondary, track: colors.secondaryContainer },
  { key: 'carbs', label: 'Carbs', color: colors.tertiary, track: colors.tertiaryContainer },
  { key: 'fat', label: 'Fat', color: colors.success, track: colors.successContainer },
];

export default function NutritionCard({ calories, protein, carbs, fat }) {
  const macroValues = { protein, carbs, fat };
  const caloriesProgress = calories.current / calories.goal;

  return (
    <AppCard style={styles.card}>
      <View style={styles.caloriesRow}>
        <ProgressRing size={64} strokeWidth={6} progress={caloriesProgress} color={colors.primary} trackColor={colors.primaryContainer}>
          <Ionicons name="flame" size={16} color={colors.primary} />
        </ProgressRing>
        <View style={styles.caloriesText}>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Calories Consumed
          </AppText>
          <AppText variant="headlineSmall">
            {calories.current}
            <AppText variant="titleMedium" color={colors.textSecondary}>
              {' '}
              / {calories.goal} kcal
            </AppText>
          </AppText>
        </View>
      </View>

      <View style={styles.macros}>
        {MACROS.map(({ key, label, color, track }) => {
          const macro = macroValues[key];
          return (
            <View key={key} style={styles.macroRow}>
              <View style={styles.macroLabelRow}>
                <AppText variant="labelLarge">{label}</AppText>
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  {macro.current}g / {macro.goal}g
                </AppText>
              </View>
              <ProgressBar
                progress={Math.min(macro.current / macro.goal, 1)}
                color={color}
                style={[styles.progressBar, { backgroundColor: track }]}
              />
            </View>
          );
        })}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  caloriesText: {
    flex: 1,
  },
  macros: {
    gap: spacing.sm,
  },
  macroRow: {
    gap: spacing.xxs,
  },
  macroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 6,
    borderRadius: radius.full,
  },
});
