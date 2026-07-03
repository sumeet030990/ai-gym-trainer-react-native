import { z } from 'zod';

// react-hook-form always feeds text inputs as '' rather than undefined, and
// z.coerce.number() turns '' into 0 — which then fails .min() before .optional()
// ever gets a chance to skip it. Blank out empty strings first so optional fields
// can actually be left empty.
const optionalNumber = (min, max) =>
  z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.coerce.number({ invalid_type_error: 'Enter a number' }).min(min).max(max).optional()
  );

const PHONE_REGEX = /^\+?[0-9\s\-()]{7,16}$/;

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(60),
  email: z.string().trim().email('Enter a valid email'),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, 'Enter a valid mobile number')
    .optional()
    .or(z.literal('')),
  heightCm: optionalNumber(100, 250),
  weightKg: optionalNumber(30, 300),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const GOAL_TYPES = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'improve_endurance', label: 'Improve Endurance' },
];

export const goalsSchema = z.object({
  goalType: z.enum(['lose_weight', 'build_muscle', 'maintain', 'improve_endurance']),
  targetWeightKg: optionalNumber(30, 300),
  weeklyWorkoutTarget: z.coerce.number({ invalid_type_error: 'Enter a number' }).int().min(1).max(14),
  dailyCalorieTarget: z.coerce.number({ invalid_type_error: 'Enter a number' }).int().min(1000).max(6000),
  proteinTargetG: optionalNumber(0, 500),
});

export const AI_PROVIDERS = [
  { value: 'groq', label: 'Groq' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
];

export const aiSettingsSchema = z.object({
  provider: z.enum(['groq', 'openai', 'anthropic']),
  model: z.string().trim().min(1, 'Enter a model name'),
  apiKey: z.string().trim().min(20, 'API key looks too short').optional().or(z.literal('')),
  temperature: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(0).max(2),
  maxTokens: z.coerce.number({ invalid_type_error: 'Enter a number' }).int().min(64).max(32000),
});
