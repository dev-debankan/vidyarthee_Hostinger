import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'text/plain'];

export const NoticeSchema = z.object({
  title_bn: z.string().min(1, 'Title in Bengali is required'),
  title_en: z.string().optional(),
  body_bn: z.string().optional(),
  body_en: z.string().optional(),
  is_pinned: z.boolean().default(false),
  // Client-side file validation
  file: z.any()
    .refine((files) => files?.length == 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => files?.length == 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".pdf and .txt files are accepted."
    )
    .optional(),
})

export const EventSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title_bn: z.string().min(1, 'Title in Bengali is required'),
  title_en: z.string().optional(),
  description_bn: z.string().min(1, 'Description in Bengali is required'),
  description_en: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  is_published: z.boolean().default(false),
  cover_image: z.any().optional(),
})

export const ContactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
})

export const GalleryItemSchema = z.object({
  caption_bn: z.string().optional(),
  caption_en: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  sort_order: z.number().int().default(0),
  images: z.any().optional(), // For multi-upload
})

export const FormLinkSchema = z.object({
  title_bn: z.string().min(1, 'Title in Bengali is required'),
  title_en: z.string().optional(),
  description_bn: z.string().optional(),
  description_en: z.string().optional(),
  google_form_url: z.string().url('Must be a valid URL'),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
})
