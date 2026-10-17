import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import SectionHeader from '../../common/SectionHeader';
import AppText from '../../common/AppText';
import PrimaryButton from '../../common/PrimaryButton';
import GoalQuestionField from './GoalQuestionField';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

// Every question on one scrollable page, grouped under its category.
export default function GoalsList({ categories, values, onChange, onSave, onClear, isBusy, errorMessage }) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {categories.map(({ category, questions }) => (
        <View key={category?.id ?? 'uncategorized'} style={styles.section}>
          {category ? <SectionHeader title={category.name} /> : null}
          {questions.map((question) => (
            <View key={question.id} style={styles.field}>
              <AppText variant="labelLarge" color={colors.textSecondary} style={styles.fieldLabel}>
                {question.question}
              </AppText>
              <GoalQuestionField
                question={question}
                value={values[question.id]}
                onChange={(value) => onChange(question.id, value)}
              />
            </View>
          ))}
        </View>
      ))}

      {errorMessage ? (
        <AppText variant="bodySmall" color={colors.error} style={styles.error}>
          {errorMessage}
        </AppText>
      ) : null}

      <PrimaryButton onPress={onSave} disabled={isBusy} loading={isBusy} style={styles.submit}>
        Save Goals
      </PrimaryButton>

      {onClear ? (
        <Pressable onPress={onClear} disabled={isBusy} hitSlop={8} style={styles.clear}>
          <AppText variant="labelLarge" color={colors.error}>
            Clear all goals
          </AppText>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: spacing.xxs,
  },
  error: {
    marginBottom: spacing.xs,
  },
  submit: {
    marginTop: spacing.sm,
  },
  clear: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
});
