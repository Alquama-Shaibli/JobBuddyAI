import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters').max(50).trim(),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
    skills: z.array(z.string().trim()).optional(),
    experience: z.number().min(0).max(60).optional(),
    preferredRole: z.string().max(100).trim().optional(),
    location: z.string().max(100).trim().optional(),
    education: z.string().max(200).trim().optional(),
    phone: z.string().max(20).trim().optional(),
    bio: z.string().max(500).trim().optional(),
    github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
});

export const onboardingSchema = z.object({
    targetRole: z.string().min(1, 'Target role is required').max(100).trim(),
    skills: z.array(z.string().trim()).optional().default([]),
    languages: z.array(z.string().trim()).optional().default([]),
});

export const quizGenerateSchema = z.object({
    tag: z.string().min(1, 'Tag is required').max(100).trim(),
});

export const quizSubmitSchema = z.object({
    quizId: z.string().min(1, 'quizId is required'),
    answers: z.array(z.object({
        questionId: z.string().min(1),
        selectedOption: z.number().int().min(0).max(3),
    })),
});

export const interviewGenerateSchema = z.object({
    type: z.enum(['HR', 'DSA', 'MERN', 'RESUME'], { errorMap: () => ({ message: 'Type must be HR, DSA, MERN, or RESUME' }) }),
});

export const interviewSubmitSchema = z.object({
    answers: z.array(z.object({
        question: z.string().min(1),
        answer: z.string().min(1, 'Answer cannot be empty'),
    })).min(1, 'Answers array cannot be empty'),
    type: z.string().min(1),
});

export const jobCreateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200).trim(),
    company: z.string().min(1, 'Company is required').max(200).trim(),
    location: z.string().min(1, 'Location is required').max(200).trim(),
    description: z.string().min(1, 'Description is required').max(5000).trim(),
    skillsRequired: z.array(z.string().trim()).optional().default([]),
    experienceRequired: z.number().min(0).max(50).optional(),
    experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
    salary: z.number().min(0).optional(),
});
