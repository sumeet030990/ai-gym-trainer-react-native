import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import AppInput from '../../../src/components/common/AppInput';
import AppText from '../../../src/components/common/AppText';
import PrimaryButton from '../../../src/components/common/PrimaryButton';
import { useGoalsStore } from '../../../src/store/goalsStore';
import { goalsSchema, GOAL_TYPES } from '../../../src/utils/schemas/settingsSchemas';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';

export default function GoalsSettings() {
  const goals = useGoalsStore();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      goalType: goals.goalType,
      targetWeightKg: goals.targetWeightKg ? String(goals.targetWeightKg) : '',
      weeklyWorkoutTarget: String(goals.weeklyWorkoutTarget),
      dailyCalorieTarget: String(goals.dailyCalorieTarget),
      proteinTargetG: goals.proteinTargetG ? String(goals.proteinTargetG) : '',
    },
  });

  const onSubmit = (values) => {
    goals.updateGoals(values);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Account" title="Goals" rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Field label="Goal">
          <Controller
            control={control}
            name="goalType"
            render={({ field }) => (
              <View style={styles.grid}>
                {GOAL_TYPES.map((option) => {
                  const selected = field.value === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => field.onChange(option.value)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <AppText variant="labelLarge" color={selected ? colors.onPrimary : colors.textPrimary}>
                        {option.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </Field>

        <Field label="Target Weight (kg)" error={errors.targetWeightKg?.message}>
          <Controller
            control={control}
            name="targetWeightKg"
            render={({ field }) => (
              <AppInput placeholder="Optional" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
            )}
          />
        </Field>

        <View style={styles.row}>
          <Field label="Workouts / Week" error={errors.weeklyWorkoutTarget?.message} style={styles.half}>
            <Controller
              control={control}
              name="weeklyWorkoutTarget"
              render={({ field }) => (
                <AppInput placeholder="4" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
              )}
            />
          </Field>
          <Field label="Daily Calories" error={errors.dailyCalorieTarget?.message} style={styles.half}>
            <Controller
              control={control}
              name="dailyCalorieTarget"
              render={({ field }) => (
                <AppInput placeholder="2200" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
              )}
            />
          </Field>
        </View>

        <Field label="Daily Protein (g)" error={errors.proteinTargetG?.message}>
          <Controller
            control={control}
            name="proteinTargetG"
            render={({ field }) => (
              <AppInput placeholder="Optional" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
            )}
          />
        </Field>

        <PrimaryButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} style={styles.submit}>
          Save Goals
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, error, children, style }) {
  return (
    <View style={[styles.field, style]}>
      <AppText variant="labelLarge" color={colors.textSecondary} style={styles.fieldLabel}>
        {label}
      </AppText>
      {children}
      {error ? (
        <AppText variant="bodySmall" color={colors.error} style={styles.fieldError}>
          {error}
        </AppText>
      ) : null}
    </View>
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
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: spacing.xxs,
  },
  fieldError: {
    marginTop: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
