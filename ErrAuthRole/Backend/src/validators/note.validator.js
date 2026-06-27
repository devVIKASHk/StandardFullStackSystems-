import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be at most 100 characters'),

  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description cannot be empty')
    .max(1000, 'Description must be at most 1000 characters'),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be at most 100 characters')
    .optional(),

  description: z
    .string()
    .min(1, 'Description cannot be empty')
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
});
