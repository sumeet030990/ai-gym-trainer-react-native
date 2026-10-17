import { View, StyleSheet, Pressable } from 'react-native';
import AppInput from '../../common/AppInput';
import AppText from '../../common/AppText';
import { toggleOptionValue } from '../../../utils/goalAnswers';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';

// The answer input for one goal question: a text field, or selectable chips for radio/checkbox.
export default function GoalQuestionField({ question, value, onChange }) {
  if (question.question_type === 'text') {
    return <AppInput placeholder="Optional" value={value} onChangeText={onChange} />;
  }

  return (
    <View style={styles.grid}>
      {question.options.map((option) => {
        const selected = Array.isArray(value) ? value.includes(option.id) : value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(toggleOptionValue(question, value, option.id))}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole={question.question_type === 'checkbox' ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: selected }}
          >
            <AppText variant="labelLarge" color={selected ? colors.onPrimary : colors.textPrimary}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
