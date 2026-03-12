export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'staff' | 'store_admin' | 'platform_admin'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'staff' | 'store_admin' | 'platform_admin'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'staff' | 'store_admin' | 'platform_admin'
          created_at?: string
          updated_at?: string | null
        }
      }
      dresses: {
        Row: {
          id: string
          name: string
          designer: string | null
          style_number: string | null
          color: string | null
          price_cents: number | null
          description: string | null
          images: Json
          video_url: string | null
          size_chart: Json
          event_types: Json
          is_active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          designer?: string | null
          style_number?: string | null
          color?: string | null
          price_cents?: number | null
          description?: string | null
          images?: Json
          video_url?: string | null
          size_chart?: Json
          event_types?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          designer?: string | null
          style_number?: string | null
          color?: string | null
          price_cents?: number | null
          description?: string | null
          images?: Json
          video_url?: string | null
          size_chart?: Json
          event_types?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      boutiques: {
        Row: {
          id: string
          name: string
          slug: string
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          phone: string | null
          email: string | null
          google_calendar_id: string | null
          timezone: string
          lat: number | null
          lng: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          email?: string | null
          google_calendar_id?: string | null
          timezone?: string
          lat?: number | null
          lng?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          phone?: string | null
          email?: string | null
          google_calendar_id?: string | null
          timezone?: string
          lat?: number | null
          lng?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          dress_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dress_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dress_id?: string
          created_at?: string
        }
      }
      fitting_room_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_token: string
          dress_ids: Json
          share_token: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_token: string
          dress_ids?: Json
          share_token?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_token?: string
          dress_ids?: Json
          share_token?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      availability_inquiries: {
        Row: {
          id: string
          dress_id: string
          boutique_id: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          parent_email: string | null
          parent_phone: string | null
          school_name: string | null
          event_date: string | null
          preferred_date: string | null
          preferred_time: string | null
          notes: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          dress_id: string
          boutique_id: string
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          parent_email?: string | null
          parent_phone?: string | null
          school_name?: string | null
          event_date?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          dress_id?: string
          boutique_id?: string
          customer_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          parent_email?: string | null
          parent_phone?: string | null
          school_name?: string | null
          event_date?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string | null
        }
      }
      boutique_staff: {
        Row: {
          id: string
          user_id: string
          boutique_id: string
          role: 'staff' | 'store_admin'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          boutique_id: string
          role?: 'staff' | 'store_admin'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          boutique_id?: string
          role?: 'staff' | 'store_admin'
          created_at?: string
        }
      }
      dress_inventory: {
        Row: {
          id: string
          boutique_id: string
          dress_id: string
          sizes_available: Json
          quantity: number
          is_active: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          boutique_id: string
          dress_id: string
          sizes_available?: Json
          quantity?: number
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          boutique_id?: string
          dress_id?: string
          sizes_available?: Json
          quantity?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      boutique_settings: {
        Row: {
          id: string
          boutique_id: string
          business_hours: Json
          booking_lead_time_hours: number
          max_daily_appointments: number
          appointment_duration_minutes: number
          auto_confirm_bookings: boolean
          notification_email: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          boutique_id: string
          business_hours?: Json
          booking_lead_time_hours?: number
          max_daily_appointments?: number
          appointment_duration_minutes?: number
          auto_confirm_bookings?: boolean
          notification_email?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          boutique_id?: string
          business_hours?: Json
          booking_lead_time_hours?: number
          max_daily_appointments?: number
          appointment_duration_minutes?: number
          auto_confirm_bookings?: boolean
          notification_email?: string | null
          updated_at?: string
        }
      }
      dress_reservations: {
        Row: {
          id: string
          dress_id: string
          boutique_id: string
          customer_id: string | null
          school_name: string
          event_name: string
          event_date: string
          status: 'reserved' | 'purchased' | 'cancelled'
          reserved_at: string
        }
        Insert: {
          id?: string
          dress_id: string
          boutique_id: string
          customer_id?: string | null
          school_name: string
          event_name?: string
          event_date: string
          status?: 'reserved' | 'purchased' | 'cancelled'
          reserved_at?: string
        }
        Update: {
          id?: string
          dress_id?: string
          boutique_id?: string
          customer_id?: string | null
          school_name?: string
          event_name?: string
          event_date?: string
          status?: 'reserved' | 'purchased' | 'cancelled'
          reserved_at?: string
        }
      }
      social_votes: {
        Row: {
          id: string
          share_token: string
          dress_id: string
          voter_name: string
          vote: 'up' | 'down'
          created_at: string
        }
        Insert: {
          id?: string
          share_token: string
          dress_id: string
          voter_name?: string
          vote: 'up' | 'down'
          created_at?: string
        }
        Update: {
          id?: string
          share_token?: string
          dress_id?: string
          voter_name?: string
          vote?: 'up' | 'down'
          created_at?: string
        }
      }
      platform_analytics: {
        Row: {
          id: string
          boutique_id: string | null
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          boutique_id?: string | null
          event_type: string
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          boutique_id?: string | null
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
      bridal_parties: {
        Row: {
          id: string
          bride_id: string
          bride_name: string
          wedding_date: string
          venue_name: string | null
          party_size: number | null
          color_scheme: Json
          notes: string | null
          share_token: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          bride_id: string
          bride_name: string
          wedding_date: string
          venue_name?: string | null
          party_size?: number | null
          color_scheme?: Json
          notes?: string | null
          share_token?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          bride_id?: string
          bride_name?: string
          wedding_date?: string
          venue_name?: string | null
          party_size?: number | null
          color_scheme?: Json
          notes?: string | null
          share_token?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      bridal_party_members: {
        Row: {
          id: string
          party_id: string
          member_name: string
          member_email: string | null
          member_phone: string | null
          role: 'bride' | 'maid_of_honor' | 'bridesmaid' | 'flower_girl' | 'mother_of_bride' | 'other'
          dress_id: string | null
          size: string | null
          status: 'invited' | 'confirmed' | 'fitted' | 'purchased'
          created_at: string
        }
        Insert: {
          id?: string
          party_id: string
          member_name: string
          member_email?: string | null
          member_phone?: string | null
          role?: 'bride' | 'maid_of_honor' | 'bridesmaid' | 'flower_girl' | 'mother_of_bride' | 'other'
          dress_id?: string | null
          size?: string | null
          status?: 'invited' | 'confirmed' | 'fitted' | 'purchased'
          created_at?: string
        }
        Update: {
          id?: string
          party_id?: string
          member_name?: string
          member_email?: string | null
          member_phone?: string | null
          role?: 'bride' | 'maid_of_honor' | 'bridesmaid' | 'flower_girl' | 'mother_of_bride' | 'other'
          dress_id?: string | null
          size?: string | null
          status?: 'invited' | 'confirmed' | 'fitted' | 'purchased'
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'customer' | 'staff' | 'store_admin' | 'platform_admin'
    }
  }
}
