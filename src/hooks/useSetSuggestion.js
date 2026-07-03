import { useEffect, useState } from 'react';
import { EXERCISE_SET_HISTORY, WEIGHT_INCREMENT_BY_EQUIPMENT } from '../utils/constants/exercises';

// TODO: replace mock with a call to ai.api.ts once the backend can suggest
// weight/reps from logged history + progressive-overload modeling.
export function useSetSuggestion(exercise, setIndex, previousSets = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!exercise) return undefined;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(getSuggestedSet(exercise, setIndex, previousSets));
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id, setIndex, previousSets.length]);

  return { data, isLoading };
}

function parseRepRange(repsLabel) {
  const match = String(repsLabel).match(/(\d+)\s*-\s*(\d+)/);
  if (match) return { min: Number(match[1]), max: Number(match[2]) };
  const single = parseInt(repsLabel, 10);
  return Number.isFinite(single) ? { min: single, max: single } : null;
}

function getSuggestedSet(exercise, setIndex, previousSets) {
  const range = parseRepRange(exercise.reps);

  // Mid-exercise: repeat whatever the user just logged for this exercise today.
  const lastSetThisSession = previousSets[previousSets.length - 1];
  if (lastSetThisSession) {
    return {
      weight: lastSetThisSession.weight,
      reps: lastSetThisSession.reps,
      hint: 'Same as your last set today',
    };
  }

  // First set of the exercise: base the suggestion on the last time it was logged.
  const history = EXERCISE_SET_HISTORY[exercise.id];
  const lastEntry = history?.sets?.[setIndex] ?? history?.sets?.[history.sets.length - 1];
  if (lastEntry) {
    const hitTopOfRange = range ? lastEntry.reps >= range.max : true;
    const increment = WEIGHT_INCREMENT_BY_EQUIPMENT[exercise.equipment] ?? 0;

    if (lastEntry.weight != null && increment > 0 && hitTopOfRange) {
      return {
        weight: Math.round((lastEntry.weight + increment) * 10) / 10,
        reps: range?.min ?? lastEntry.reps,
        hint: 'AI suggested: add weight, you crushed this last time',
      };
    }

    return {
      weight: lastEntry.weight,
      reps: hitTopOfRange ? lastEntry.reps : Math.min(lastEntry.reps + 1, range?.max ?? lastEntry.reps + 1),
      hint: 'Based on your last session',
    };
  }

  // No history at all — fall back to the exercise library's baseline suggestion.
  return {
    weight: exercise.suggestedWeight,
    reps: range?.max ?? (parseInt(exercise.reps, 10) || 10),
    hint: 'Recommended starting point',
  };
}
