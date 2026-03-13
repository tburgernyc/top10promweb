import { z } from 'zod'

// ── Auth ───────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

// ── Availability inquiry ───────────────────────────────────────────────────
export const availabilitySchema = z.object({
  dress_id: z.string().uuid('Invalid dress'),
  boutique_id: z.string().uuid('Select a store location'),
  customer_name: z.string().min(2, 'Your name is required'),
  customer_email: z.string().email('Enter a valid email address'),
  customer_phone: z.string().optional(),
  parent_email: z.string().email('Enter a valid parent/guardian email'),
  parent_phone: z.string().optional(),
  school_name: z.string().min(2, 'School name is required'),
  event_date: z.string().min(1, 'Prom date is required'),
  preferred_date: z.string().min(1, 'Preferred appointment date is required'),
  preferred_time: z.string().min(1, 'Preferred time is required'),
  notes: z.string().optional(),
})

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>

// ── Booking wizard (step-by-step) ──────────────────────────────────────────
export const bookingStep1Schema = z.object({
  // dress_id is optional — customers may book to browse/discover in store
  dress_id: z.string().uuid().optional().or(z.literal('')),
})

export const bookingStep2Schema = z.object({
  boutique_id: z.string().uuid('Select a store location'),
})

export const bookingStep3Schema = z.object({
  preferred_date: z.string().min(1, 'Select a date'),
  preferred_time: z.string().min(1, 'Select a time'),
})

export const bookingStep4Schema = z.object({
  customer_name: z.string().min(2, 'Your name is required'),
  customer_email: z.string().email('Enter a valid email'),
  customer_phone: z.string().optional(),
  parent_email: z.string().email('Parent/guardian email is required'),
  parent_phone: z.string().optional(),
  school_name: z.string().min(2, 'School name is required'),
  event_date: z.string().min(1, 'Prom date is required'),
  notes: z.string().optional(),
})

export const fullBookingSchema = bookingStep1Schema
  .merge(bookingStep2Schema)
  .merge(bookingStep3Schema)
  .merge(bookingStep4Schema)

export type FullBookingValues = z.infer<typeof fullBookingSchema>

// ── Admin ──────────────────────────────────────────────────────────────────
export const updateInquiryStatusSchema = z.object({
  inquiry_id: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

export const addInventorySchema = z.object({
  boutique_id: z.string().uuid('Select a boutique'),
  dress_id: z.string().uuid('Select a dress'),
  sizes_available: z.array(z.string()).min(1, 'Select at least one size'),
  quantity: z.number().int().min(0),
})

export const updateBoutiqueSettingsSchema = z.object({
  boutique_id: z.string().uuid(),
  booking_lead_time_hours: z.number().int().min(0),
  max_daily_appointments: z.number().int().min(1),
  appointment_duration_minutes: z.number().int().min(15),
  auto_confirm_bookings: z.boolean(),
  notification_email: z.string().email().optional().or(z.literal('')),
})

export const staffInviteSchema = z.object({
  email: z.string().email('Enter a valid email'),
  boutique_id: z.string().uuid('Select a boutique'),
  role: z.enum(['staff', 'store_admin']),
})

// ── Duplicate check ────────────────────────────────────────────────────────
export const duplicateCheckSchema = z.object({
  dress_id: z.string().uuid(),
  school_name: z.string().min(2, 'School name is required'),
  event_date: z.string().min(1, 'Event date is required'),
})

export type DuplicateCheckValues = z.infer<typeof duplicateCheckSchema>

// ── Vote ───────────────────────────────────────────────────────────────────
export const voteSchema = z.object({
  share_token: z.string(),
  dress_id: z.string().uuid(),
  voter_name: z.string().min(1).default('Anonymous'),
  vote: z.enum(['up', 'down']),
})
