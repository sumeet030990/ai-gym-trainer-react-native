// Helpers mapping between the goals API shapes and the goals form's values.
// Form values are keyed by question id: checkbox → option id[], radio → option id | '', text → string.

export function flattenQuestions(categories) {
  return categories.flatMap(({ category, questions }) =>
    questions.map((question) => ({ ...question, categoryName: category?.name ?? null }))
  );
}

export function buildInitialValues(questions, userGoals) {
  const answersByQuestion = new Map(userGoals.map((group) => [group.question.id, group.answers]));
  const values = {};

  for (const question of questions) {
    const answers = answersByQuestion.get(question.id) ?? [];
    const optionIds = answers.map((answer) => answer.option?.id).filter(Boolean);
    if (question.question_type === 'checkbox') values[question.id] = optionIds;
    else if (question.question_type === 'radio') values[question.id] = optionIds[0] ?? '';
    else values[question.id] = answers[0]?.answer_text ?? '';
  }
  return values;
}

// POST replaces every answer, so answers to questions this form doesn't show (inactive or
// uncategorized ones, which /questions/ omits) are carried over unchanged rather than wiped.
export function buildPayload(questions, values, userGoals) {
  const shownIds = new Set(questions.map((question) => question.id));
  const carriedOver = userGoals
    .filter((group) => !shownIds.has(group.question.id))
    .map((group) => ({
      question_id: group.question.id,
      answers: group.answers.map((answer) => ({ option_id: answer.option?.id ?? null, answer_text: answer.answer_text })),
    }));

  const edited = questions
    .map((question) => {
      const value = values[question.id];
      let answers;
      if (question.question_type === 'checkbox') answers = value.map((id) => ({ option_id: id, answer_text: null }));
      else if (question.question_type === 'radio') answers = value ? [{ option_id: value, answer_text: null }] : [];
      else answers = value.trim() ? [{ option_id: null, answer_text: value.trim() }] : [];
      return { question_id: question.id, answers };
    })
    .filter((group) => group.answers.length > 0);

  return [...edited, ...carriedOver];
}

// Checkbox toggles membership; radio toggles between the option and unselected.
export function toggleOptionValue(question, currentValue, optionId) {
  if (question.question_type === 'checkbox') {
    return currentValue.includes(optionId)
      ? currentValue.filter((id) => id !== optionId)
      : [...currentValue, optionId];
  }
  return currentValue === optionId ? '' : optionId;
}
