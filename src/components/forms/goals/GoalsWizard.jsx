import { View, ScrollView, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import AppText from '../../common/AppText';
import PrimaryButton from '../../common/PrimaryButton';
import SecondaryButton from '../../common/SecondaryButton';
import GoalQuestionField from './GoalQuestionField';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

// One question per step, with a progress bar on top and Previous/Next (Save on the last step) at the bottom.
export default function GoalsWizard({ questions, values, onChange, step, onStepChange, onSave, isBusy, errorMessage }) {
  const question = questions[step];
  const isFirst = step === 0;
  const isLast = step === questions.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <View style={styles.progressLabels}>
          <AppText variant="labelLarge" color={colors.textSecondary}>
            {question.categoryName ?? ''}
          </AppText>
          <AppText variant="labelLarge" color={colors.textSecondary}>
            {step + 1} of {questions.length}
          </AppText>
        </View>
        <ProgressBar
          progress={(step + 1) / questions.length}
          color={colors.primary}
          style={styles.progressBar}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="titleLarge" style={styles.question}>
          {question.question}
        </AppText>
        {question.question_type === 'checkbox' ? (
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.hint}>
            Select all that apply
          </AppText>
        ) : null}
        <GoalQuestionField
          key={question.id}
          question={question}
          value={values[question.id]}
          onChange={(value) => onChange(question.id, value)}
        />
      </ScrollView>

      <View style={styles.footer}>
        {errorMessage ? (
          <AppText variant="bodySmall" color={colors.error} style={styles.error}>
            {errorMessage}
          </AppText>
        ) : null}
        <View style={styles.buttons}>
          <SecondaryButton onPress={() => onStepChange(step - 1)} disabled={isFirst || isBusy} style={styles.button}>
            Previous
          </SecondaryButton>
          {isLast ? (
            <PrimaryButton onPress={onSave} disabled={isBusy} loading={isBusy} style={styles.button}>
              Save
            </PrimaryButton>
          ) : (
            <PrimaryButton onPress={() => onStepChange(step + 1)} disabled={isBusy} style={styles.button}>
              Next
            </PrimaryButton>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progress: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  question: {
    marginBottom: spacing.xs,
  },
  hint: {
    marginBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.background,
  },
  error: {
    marginBottom: spacing.xs,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
