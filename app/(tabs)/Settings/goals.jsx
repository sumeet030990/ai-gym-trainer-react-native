import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import EmptyState from '../../../src/components/common/EmptyState';
import GoalsWizard from '../../../src/components/forms/goals/GoalsWizard';
import GoalsList from '../../../src/components/forms/goals/GoalsList';
import {
  useGoalQuestions,
  useUserGoals,
  useSaveGoalsMutation,
  useDeleteGoalsMutation,
} from '../../../src/hooks/useGoals';
import { flattenQuestions, buildInitialValues, buildPayload } from '../../../src/utils/goalAnswers';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

const VIEW_MODES = [
  { value: 'wizard', label: 'Step by step', icon: 'format-list-numbered' },
  { value: 'list', label: 'All questions', icon: 'format-list-bulleted' },
];

export default function GoalsSettings() {
  const questionsQuery = useGoalQuestions();
  const userGoalsQuery = useUserGoals();

  const isLoading = questionsQuery.isPending || userGoalsQuery.isPending;
  const error = questionsQuery.error ?? userGoalsQuery.error;
  const retry = () => {
    if (questionsQuery.isError) questionsQuery.refetch();
    if (userGoalsQuery.isError) userGoalsQuery.refetch();
  };

  let body;
  if (isLoading) body = <Loader />;
  else if (error) body = <ErrorView message={error.message} onRetry={retry} />;
  else if (!questionsQuery.data.length) body = <EmptyState title="No goal questions yet" />;
  else body = <GoalsForm categories={questionsQuery.data} userGoals={userGoalsQuery.data} />;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Account" title="Goals" rightIcon="close" onRightPress={() => router.back()} />
      </View>
      {body}
    </SafeAreaView>
  );
}

// Mounted only once both queries have data, so Formik's initialValues are built from the server state.
// Both views share one Formik instance, so switching views keeps unsaved answers.
function GoalsForm({ categories, userGoals }) {
  const [viewMode, setViewMode] = useState('wizard');
  const [step, setStep] = useState(0);
  const questions = useMemo(() => flattenQuestions(categories), [categories]);

  const saveGoals = useSaveGoalsMutation();
  const deleteGoals = useDeleteGoalsMutation();
  const errorMessage = (saveGoals.error ?? deleteGoals.error)?.message;

  const { values, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues: buildInitialValues(questions, userGoals),
    onSubmit: async (formValues) => {
      const payload = buildPayload(questions, formValues, userGoals);
      try {
        // POST with nothing to insert would be an empty bulk insert; clearing is the same intent.
        if (payload.length) await saveGoals.mutateAsync(payload);
        else await deleteGoals.mutateAsync();
        router.back();
      } catch {
        // Surfaced via errorMessage.
      }
    },
  });

  const confirmClear = () => {
    Alert.alert('Clear goals?', 'This removes all of your goal answers.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => deleteGoals.mutate(undefined, { onSuccess: () => router.back() }),
      },
    ]);
  };

  const isBusy = isSubmitting || deleteGoals.isPending;

  return (
    <View style={styles.form}>
      <SegmentedButtons value={viewMode} onValueChange={setViewMode} buttons={VIEW_MODES} style={styles.toggle} />

      {viewMode === 'wizard' ? (
        <GoalsWizard
          questions={questions}
          values={values}
          onChange={setFieldValue}
          step={step}
          onStepChange={setStep}
          onSave={handleSubmit}
          isBusy={isBusy}
          errorMessage={errorMessage}
        />
      ) : (
        <GoalsList
          categories={categories}
          values={values}
          onChange={setFieldValue}
          onSave={handleSubmit}
          onClear={userGoals.length ? confirmClear : undefined}
          isBusy={isBusy}
          errorMessage={errorMessage}
        />
      )}
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
  form: {
    flex: 1,
  },
  toggle: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
