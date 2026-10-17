import { authorizedFetch } from './client';

// Every active goal question, grouped by category: [{ category, questions: [{ id, question, question_type, options }] }].
export function getGoalQuestions() {
  return authorizedFetch('/questions/');
}

// The authenticated user's answers, grouped by question: [{ question, answers: [{ id, answer_text, option }] }].
export function getUserGoals() {
  return authorizedFetch('/users/profile/goals');
}

// Replaces ALL of the user's answers server-side, so the full answer set must be sent every time.
// userGoals: [{ question_id, answers: [{ option_id, answer_text }] }]
export function saveUserGoals(userGoals) {
  return authorizedFetch('/users/profile/goals', { method: 'POST', body: { user_goals: userGoals } });
}

export function deleteUserGoals() {
  return authorizedFetch('/users/profile/goals', { method: 'DELETE' });
}
