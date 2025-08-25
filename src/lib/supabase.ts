import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'user' | 'business_owner' | 'admin'
          country: string | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'business_owner' | 'admin'
          country?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'business_owner' | 'admin'
          country?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      countries: {
        Row: {
          id: string
          name: string
          code: string
          flag_url: string | null
          wikipedia_url: string | null
          description: string | null
          population: number | null
          capital: string | null
          currency: string | null
          language: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          flag_url?: string | null
          wikipedia_url?: string | null
          description?: string | null
          population?: number | null
          capital?: string | null
          currency?: string | null
          language?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          flag_url?: string | null
          wikipedia_url?: string | null
          description?: string | null
          population?: number | null
          capital?: string | null
          currency?: string | null
          language?: string | null
          created_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          country_id: string
          latitude: number | null
          longitude: number | null
          population: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          country_id: string
          latitude?: number | null
          longitude?: number | null
          population?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          country_id?: string
          latitude?: number | null
          longitude?: number | null
          population?: number | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          description: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          owner_id: string | null
          city_id: string | null
          country_id: string | null
          phone: string | null
          email: string | null
          website: string | null
          whatsapp: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          hours_of_operation: any | null
          services: any | null
          images: string[] | null
          logo_url: string | null
          status: 'pending' | 'active' | 'suspended' | 'premium'
          is_premium: boolean
          is_verified: boolean
          has_coupons: boolean
          accepts_orders_online: boolean
          is_kid_friendly: boolean
          meta_title: string | null
          meta_description: string | null
          view_count: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category_id?: string | null
          owner_id?: string | null
          city_id?: string | null
          country_id?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          whatsapp?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          hours_of_operation?: any | null
          services?: any | null
          images?: string[] | null
          logo_url?: string | null
          status?: 'pending' | 'active' | 'suspended' | 'premium'
          is_premium?: boolean
          is_verified?: boolean
          has_coupons?: boolean
          accepts_orders_online?: boolean
          is_kid_friendly?: boolean
          meta_title?: string | null
          meta_description?: string | null
          view_count?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          owner_id?: string | null
          city_id?: string | null
          country_id?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          whatsapp?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          hours_of_operation?: any | null
          services?: any | null
          images?: string[] | null
          logo_url?: string | null
          status?: 'pending' | 'active' | 'suspended' | 'premium'
          is_premium?: boolean
          is_verified?: boolean
          has_coupons?: boolean
          accepts_orders_online?: boolean
          is_kid_friendly?: boolean
          meta_title?: string | null
          meta_description?: string | null
          view_count?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          title: string | null
          content: string | null
          images: string[] | null
          status: 'pending' | 'approved' | 'rejected'
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          title?: string | null
          content?: string | null
          images?: string[] | null
          status?: 'pending' | 'approved' | 'rejected'
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          images?: string[] | null
          status?: 'pending' | 'approved' | 'rejected'
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      premium_features: {
        Row: {
          id: string
          business_id: string
          feature_type: string
          is_active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          feature_type: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          feature_type?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          business_id: string | null
          user_id: string | null
          amount: number
          currency: string
          payment_method: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          description: string | null
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id?: string | null
          user_id?: string | null
          amount: number
          currency?: string
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          description?: string | null
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string | null
          user_id?: string | null
          amount?: number
          currency?: string
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          description?: string | null
          metadata?: any | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          organizer_id: string | null
          city_id: string | null
          country_id: string | null
          venue: string | null
          address: string | null
          start_date: string
          end_date: string
          images: string[] | null
          ticket_price: number | null
          ticket_url: string | null
          category: string | null
          tags: string[] | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          organizer_id?: string | null
          city_id?: string | null
          country_id?: string | null
          venue?: string | null
          address?: string | null
          start_date: string
          end_date: string
          images?: string[] | null
          ticket_price?: number | null
          ticket_url?: string | null
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          organizer_id?: string | null
          city_id?: string | null
          country_id?: string | null
          venue?: string | null
          address?: string | null
          start_date?: string
          end_date?: string
          images?: string[] | null
          ticket_price?: number | null
          ticket_url?: string | null
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string | null
          business_id: string | null
          title: string
          description: string | null
          price: number
          currency: string
          images: string[] | null
          category: string | null
          condition: string | null
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id?: string | null
          business_id?: string | null
          title: string
          description?: string | null
          price: number
          currency?: string
          images?: string[] | null
          category?: string | null
          condition?: string | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string | null
          business_id?: string | null
          title?: string
          description?: string | null
          price?: number
          currency?: string
          images?: string[] | null
          category?: string | null
          condition?: string | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_business_view: {
        Args: { business_uuid: string }
        Returns: void
      }
      increment_business_click: {
        Args: { business_uuid: string }
        Returns: void
      }
    }
    Enums: {
      user_role: 'user' | 'business_owner' | 'admin'
      business_status: 'pending' | 'active' | 'suspended' | 'premium'
      review_status: 'pending' | 'approved' | 'rejected'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
  }
}

// Helper functions for common operations
export const db = {
  // Business operations
  businesses: () => supabase.from('businesses'),
  
  // Category operations
  categories: () => supabase.from('categories'),
  
  // City operations
  cities: () => supabase.from('cities'),
  
  // Country operations
  countries: () => supabase.from('countries'),
  
  // Review operations
  reviews: () => supabase.from('reviews'),
  
  // Event operations
  events: () => supabase.from('events'),
  
  // Product operations
  products: () => supabase.from('products'),
  
  // User operations
  users: () => supabase.from('users'),
  
  // Payment operations
  payments: () => supabase.from('payments'),
  
  // Premium features operations
  premium_features: () => supabase.from('premium_features')
}

// Auth helper functions
export const auth = {
  // Get current user
  getUser: () => supabase.auth.getUser(),
  
  // Sign up
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),
  
  // Sign in
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  // Sign out
  signOut: () => supabase.auth.signOut(),
  
  // Reset password
  resetPassword: (email: string) => 
    supabase.auth.resetPasswordForEmail(email),
  
  // Update password
  updatePassword: (password: string) => 
    supabase.auth.updateUser({ password }),
  
  // Get session
  getSession: () => supabase.auth.getSession(),
  
  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback)
} 