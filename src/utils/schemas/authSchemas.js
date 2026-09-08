import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const MOBILE_REGEX = /^\+?[1-9]\d{7,14}$/;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Enter your first name').max(100),
    lastName: z.string().trim().max(100).optional().or(z.literal('')),
    mobileNo: z.string().trim().regex(MOBILE_REGEX, 'Enter a valid mobile number, e.g. +14155552671'),
    email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters').max(72),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
