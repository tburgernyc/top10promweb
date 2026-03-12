import type { Database } from './database'

// ── Convenience row types ──────────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Dress = Database['public']['Tables']['dresses']['Row']
export type Boutique = Database['public']['Tables']['boutiques']['Row']
export type WishlistItem = Database['public']['Tables']['wishlist']['Row']
export type FittingRoomSession = Database['public']['Tables']['fitting_room_sessions']['Row']
export type AvailabilityInquiry = Database['public']['Tables']['availability_inquiries']['Row']
export type BoutiqueStaff = Database['public']['Tables']['boutique_staff']['Row']
export type DressInventory = Database['public']['Tables']['dress_inventory']['Row']
export type BoutiqueSettings = Database['public']['Tables']['boutique_settings']['Row']
export type DressReservation = Database['public']['Tables']['dress_reservations']['Row']
export type SocialVote = Database['public']['Tables']['social_votes']['Row']
export type PlatformAnalytic = Database['public']['Tables']['platform_analytics']['Row']
export type BridalParty = Database['public']['Tables']['bridal_parties']['Row']
export type BridalPartyMember = Database['public']['Tables']['bridal_party_members']['Row']

// ── User role ──────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'staff' | 'store_admin' | 'platform_admin'

// ── Event type context ─────────────────────────────────────────────────────
export type EventType = 'prom' | 'wedding'

// ── Bridal party member role ───────────────────────────────────────────────
export type BridalMemberRole = 'bride' | 'maid_of_honor' | 'bridesmaid' | 'flower_girl' | 'mother_of_bride' | 'other'
export type BridalMemberStatus = 'invited' | 'confirmed' | 'fitted' | 'purchased'

// ── Bridal party with members (join) ──────────────────────────────────────
export interface BridalPartyWithMembers extends BridalParty {
  members: BridalPartyMember[]
}

// ── Dress event types ─────────────────────────────────────────────────────
export type DressEventTypes = EventType[]

// ── Dress image (element of images JSONB array) ────────────────────────────
export interface DressImage {
  url: string
  alt: string
  order: number
  is_primary?: boolean
}

// ── Size chart (stored as size_chart JSONB) ────────────────────────────────
export interface SizeChart {
  sizes: SizeEntry[]
  notes?: string
}

export interface SizeEntry {
  label: string       // e.g. "0", "2", "4", ... "24W"
  bust?: number       // inches
  waist?: number      // inches
  hips?: number       // inches
  hollow_to_hem?: number  // inches
}

// ── Business hours (stored in boutique_settings.business_hours) ────────────
export interface DayHours {
  open: string | null   // "10:00" or null (closed)
  close: string | null
}

export type WeekHours = {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

// ── Enriched types (joins) ─────────────────────────────────────────────────
export interface DressWithInventory extends Dress {
  inventory: DressInventory[]
}

export interface BoutiqueWithSettings extends Boutique {
  settings: BoutiqueSettings | null
}

export interface InquiryWithDressAndBoutique extends AvailabilityInquiry {
  dress: Pick<Dress, 'id' | 'name' | 'images'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
}

// ── Fitting room ───────────────────────────────────────────────────────────
export interface FittingRoomDress {
  dress_id: string
  added_at: string
}

// ── Store selector ─────────────────────────────────────────────────────────
export interface BoutiqueOption {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  distance_miles?: number
}

// ── Duplicate check result ─────────────────────────────────────────────────
export interface DuplicateCheckResult {
  is_available: boolean
  conflicting_reservation?: Pick<DressReservation, 'school_name' | 'event_date' | 'status'>
}

// ── Booking wizard steps ───────────────────────────────────────────────────
export type BookingStep = 0 | 1 | 2 | 3 | 4 | 5

export interface BookingWizardState {
  step: BookingStep
  selected_dress_id: string | null
  selected_boutique_id: string | null
  preferred_date: string | null
  preferred_time: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  parent_email: string
  parent_phone: string
  school_name: string
  event_date: string | null
  notes: string
}
