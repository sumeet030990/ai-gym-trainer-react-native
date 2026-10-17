import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useFormik } from 'formik';
import Loader from '../../common/Loader';
import ErrorView from '../../common/ErrorView';
import EmptyState from '../../common/EmptyState';
import GoalsWizard from './GoalsWizard';
import GoalsList from './GoalsList';
import { useGoalQuestions, useUserGoals, useSaveGoalsMutation, useDeleteGoalsMutation } from '../../../hooks/useGoals';
import { flattenQuestions, buildInitialValues, buildPayload } from '../../../utils/goalAnswers';
import { spacing } from '../../../theme/spacing';

const VIEW_MODES = [
  { value: 'wizard', label: 'Step by step', icon: 'format-list-numbered' },
  { value: 'list', label: 'All questions', icon: 'format-list-bulleted' },
];

// Loads the goal questions and the user's answers, then renders the wizard/list form.
// onSaved runs after the answers are saved (navigate away, generate a plan, ...); if it
// throws, its message is shown on the form. onCleared enables "Clear all goals".
export default function GoalsEditor({ onSaved, onCleared, saveLabel }) {
  const questionsQuery = useGoalQuestions();
  const userGoalsQuery = useUserGoals();

  if (questionsQuery.isPending || userGoalsQuery.isPending) return <Loader />;

  const error = questionsQuery.error ?? userGoalsQuery.error;
  if (error) {
    const retry = () => {
      if (questionsQuery.isError) questionsQuery.refetch();
      if (userGoalsQuery.isError) userGoalsQuery.refetch();
    };
    return <ErrorView message={error.message} onRetry={retry} />;
  }

  if (!questionsQuery.data.length) return <EmptyState title="No goal questions yet" />;

  return (
    <GoalsForm
      categories={questionsQuery.data}
      userGoals={userGoalsQuery.data}
      onSaved={onSaved}
      onCleared={onCleared}
      saveLabel={saveLabel}
    />
  );
}

// Mounted only once both queries have data, so Formik's initialValues are built from the server state.
// Both views share one Formik instance, so switching views keeps unsaved answers.
function GoalsForm({ categories, userGoals, onSaved, onCleared, saveLabel }) {
  const [viewMode, setViewMode] = useState('wizard');
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const questions = useMemo(() => flattenQuestions(categories), [categories]);

  const saveGoals = useSaveGoalsMutation();
  const deleteGoals = useDeleteGoalsMutation();

  const { values, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues: buildInitialValues(questions, userGoals),
    onSubmit: async (formValues) => {
      setErrorMessage(null);
      const payload = buildPayload(questions, formValues, userGoals);
      try {
        // POST with nothing to insert would be an empty bulk insert; clearing is the same intent.
        if (payload.length) await saveGoals.mutateAsync(payload);
        else await deleteGoals.mutateAsync();
        await onSaved?.();
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
  });

  const confirmClear = () => {
    Alert.alert('Clear goals?', 'This removes all of your goal answers.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setErrorMessage(null);
          deleteGoals.mutate(undefined, { onSuccess: onCleared, onError: (error) => setErrorMessage(error.message) });
        },
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
          saveLabel={saveLabel}
          isBusy={isBusy}
          errorMessage={errorMessage}
        />
      ) : (
        <GoalsList
          categories={categories}
          values={values}
          onChange={setFieldValue}
          onSave={handleSubmit}
          saveLabel={saveLabel}
          onClear={onCleared && userGoals.length ? confirmClear : undefined}
          isBusy={isBusy}
          errorMessage={errorMessage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  toggle: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
});
