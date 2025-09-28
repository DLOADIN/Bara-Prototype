export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      banner_ads: {
        Row: {
          id: string
          title: string
          image_url: string
          redirect_url: string
          alt_text: string | null
          is_active: boolean
          start_date: string | null
          end_date: string | null
          total_views: number
          total_clicks: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          image_url: string
          redirect_url: string
          alt_text?: string | null
          is_active?: boolean
          start_date?: string | null
          end_date?: string | null
          total_views?: number
          total_clicks?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          image_url?: string
          redirect_url?: string
          alt_text?: string | null
          is_active?: boolean
          start_date?: string | null
          end_date?: string | null
          total_views?: number
          total_clicks?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      banner_ad_analytics: {
        Row: {
          id: string
          banner_ad_id: string
          event_type: string
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          banner_ad_id: string
          event_type: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          banner_ad_id?: string
          event_type?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
      country_info: {
        Row: {
          id: string
          country_id: string
          description: string | null
          capital: string | null
          currency: string | null
          language: string | null
          population: number | null
          area_sq_km: number | null
          president_name: string | null
          government_type: string | null
          formation_date: string | null
          gdp_usd: number | null
          gdp_per_capita: number | null
          currency_code: string | null
          latitude: number | null
          longitude: number | null
          timezone: string | null
          calling_code: string | null
          average_age: number | null
          largest_city: string | null
          largest_city_population: number | null
          capital_population: number | null
          hdi_score: number | null
          literacy_rate: number | null
          life_expectancy: number | null
          ethnic_groups: Json | null
          religions: Json | null
          national_holidays: Json | null
          flag_url: string | null
          coat_of_arms_url: string | null
          national_anthem_url: string | null
          climate: string | null
          natural_resources: string | null
          main_industries: string | null
          tourism_attractions: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          country_id: string
          description?: string | null
          capital?: string | null
          currency?: string | null
          language?: string | null
          population?: number | null
          area_sq_km?: number | null
          president_name?: string | null
          government_type?: string | null
          formation_date?: string | null
          gdp_usd?: number | null
          gdp_per_capita?: number | null
          currency_code?: string | null
          latitude?: number | null
          longitude?: number | null
          timezone?: string | null
          calling_code?: string | null
          average_age?: number | null
          largest_city?: string | null
          largest_city_population?: number | null
          capital_population?: number | null
          hdi_score?: number | null
          literacy_rate?: number | null
          life_expectancy?: number | null
          ethnic_groups?: Json | null
          religions?: Json | null
          national_holidays?: Json | null
          flag_url?: string | null
          coat_of_arms_url?: string | null
          national_anthem_url?: string | null
          climate?: string | null
          natural_resources?: string | null
          main_industries?: string | null
          tourism_attractions?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          country_id?: string
          description?: string | null
          capital?: string | null
          currency?: string | null
          language?: string | null
          population?: number | null
          area_sq_km?: number | null
          president_name?: string | null
          government_type?: string | null
          formation_date?: string | null
          gdp_usd?: number | null
          gdp_per_capita?: number | null
          currency_code?: string | null
          latitude?: number | null
          longitude?: number | null
          timezone?: string | null
          calling_code?: string | null
          average_age?: number | null
          largest_city?: string | null
          largest_city_population?: number | null
          capital_population?: number | null
          hdi_score?: number | null
          literacy_rate?: number | null
          life_expectancy?: number | null
          ethnic_groups?: Json | null
          religions?: Json | null
          national_holidays?: Json | null
          flag_url?: string | null
          coat_of_arms_url?: string | null
          national_anthem_url?: string | null
          climate?: string | null
          natural_resources?: string | null
          main_industries?: string | null
          tourism_attractions?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      sponsored_banners: {
        Row: {
          id: string
          country_id: string
          company_name: string
          company_website: string
          banner_image_url: string
          banner_alt_text: string | null
          is_active: boolean
          submitted_by_user_id: string | null
          payment_status: string
          payment_id: string | null
          created_at: string
          updated_at: string
          payment_amount: number | null
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          show_on_country_detail: boolean
          view_count: number
          click_count: number
        }
        Insert: {
          id?: string
          country_id: string
          company_name: string
          company_website: string
          banner_image_url: string
          banner_alt_text?: string | null
          is_active?: boolean
          submitted_by_user_id?: string | null
          payment_status?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
          payment_amount?: number | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          show_on_country_detail?: boolean
          view_count?: number
          click_count?: number
        }
        Update: {
          id?: string
          country_id?: string
          company_name?: string
          company_website?: string
          banner_image_url?: string
          banner_alt_text?: string | null
          is_active?: boolean
          submitted_by_user_id?: string | null
          payment_status?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
          payment_amount?: number | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          show_on_country_detail?: boolean
          view_count?: number
          click_count?: number
        }
      }
      sponsored_banner_analytics: {
        Row: {
          id: string
          banner_id: string
          event_type: string
          user_agent: string | null
          ip_address: string | null
          referrer: string | null
          country_code: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          banner_id: string
          event_type: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country_code?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          banner_id?: string
          event_type?: string
          user_agent?: string | null
          ip_address?: string | null
          referrer?: string | null
          country_code?: string | null
          city?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_banner_ad_views: {
        Args: { banner_ad_id: string }
        Returns: undefined
      }
      increment_banner_ad_clicks: {
        Args: { banner_ad_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
