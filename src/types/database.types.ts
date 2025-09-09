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
