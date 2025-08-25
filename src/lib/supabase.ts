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
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Extend the Database interface to include our new fields
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        businesses: {
          Row: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            category_id: string | null;
            owner_id: string | null;
            city_id: string | null;
            country_id: string | null;
            phone: string | null;
            email: string | null;
            website: string | null;
            whatsapp: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            hours_of_operation: any | null;
            services: any | null;
            images: string[] | null;
            logo_url: string | null;
            status: 'pending' | 'active' | 'suspended' | 'premium';
            is_premium: boolean;
            is_verified: boolean;
            has_coupons: boolean;
            accepts_orders_online: boolean;
            is_kid_friendly: boolean;
            is_sponsored_ad: boolean;
            meta_title: string | null;
            meta_description: string | null;
            view_count: number;
            click_count: number;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            name: string;
            slug: string;
            description?: string | null;
            category_id?: string | null;
            owner_id?: string | null;
            city_id?: string | null;
            country_id?: string | null;
            phone?: string | null;
            email?: string | null;
            website?: string | null;
            whatsapp?: string | null;
            address?: string | null;
            latitude?: number | null;
            longitude?: number | null;
            hours_of_operation?: any | null;
            services?: any | null;
            images?: string[] | null;
            logo_url?: string | null;
            status?: 'pending' | 'active' | 'suspended' | 'premium';
            is_premium?: boolean;
            is_verified?: boolean;
            has_coupons?: boolean;
            accepts_orders_online?: boolean;
            is_kid_friendly?: boolean;
            is_sponsored_ad?: boolean;
            meta_title?: string | null;
            meta_description?: string | null;
            view_count?: number;
            click_count?: number;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            name?: string;
            slug?: string;
            description?: string | null;
            category_id?: string | null;
            owner_id?: string | null;
            city_id?: string | null;
            country_id?: string | null;
            phone?: string | null;
            email?: string | null;
            website?: string | null;
            whatsapp?: string | null;
            address?: string | null;
            latitude?: number | null;
            longitude?: number | null;
            hours_of_operation?: any | null;
            services?: any | null;
            images?: string[] | null;
            logo_url?: string | null;
            status?: 'pending' | 'active' | 'suspended' | 'premium';
            is_premium?: boolean;
            is_verified?: boolean;
            has_coupons?: boolean;
            accepts_orders_online?: boolean;
            is_kid_friendly?: boolean;
            is_sponsored_ad?: boolean;
            meta_title?: string | null;
            meta_description?: string | null;
            view_count?: number;
            click_count?: number;
            created_at?: string;
            updated_at?: string;
          };
        };

        ad_campaigns: {
          Row: {
            id: string;
            business_id: string;
            campaign_name: string;
            campaign_type: 'featured_listing' | 'top_position' | 'sidebar';
            target_cities: string[];
            target_categories: string[];
            start_date: string;
            end_date: string;
            budget: number;
            spent_amount: number;
            daily_budget_limit: number | null;
            is_active: boolean;
            admin_approved: boolean;
            admin_notes: string | null;
            performance_metrics: any | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            business_id: string;
            campaign_name: string;
            campaign_type?: 'featured_listing' | 'top_position' | 'sidebar';
            target_cities?: string[];
            target_categories?: string[];
            start_date: string;
            end_date: string;
            budget: number;
            spent_amount?: number;
            daily_budget_limit?: number | null;
            is_active?: boolean;
            admin_approved?: boolean;
            admin_notes?: string | null;
            performance_metrics?: any | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            business_id?: string;
            campaign_name?: string;
            campaign_type?: 'featured_listing' | 'top_position' | 'sidebar';
            target_cities?: string[];
            target_categories?: string[];
            start_date?: string;
            end_date?: string;
            budget?: number;
            spent_amount?: number;
            daily_budget_limit?: number | null;
            is_active?: boolean;
            admin_approved?: boolean;
            admin_notes?: string | null;
            performance_metrics?: any | null;
            created_at?: string;
            updated_at?: string;
          };
        };
      };
    };
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