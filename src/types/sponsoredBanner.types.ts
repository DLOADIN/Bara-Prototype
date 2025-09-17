export interface SponsoredBanner {
  id: string;
  country_id: string;
  company_name: string;
  company_website: string;
  banner_image_url: string;
  banner_alt_text?: string | null;
  is_active: boolean;
  submitted_by_user_id?: string | null;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_id?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  payment_amount?: number;
  view_count?: number;
  click_count?: number;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  country_name?: string;
  country_code?: string;
  country_flag_url?: string;
}

export interface CreateSponsoredBannerData {
  country_id: string;
  company_name: string;
  company_website: string;
  banner_image_url: string;
  banner_alt_text?: string | null;
  submitted_by_user_id?: string | null;
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_id?: string | null;
}

export interface UpdateSponsoredBannerData {
  country_id?: string;
  company_name?: string;
  company_website?: string;
  banner_image_url?: string;
  banner_alt_text?: string | null;
  is_active?: boolean;
  submitted_by_user_id?: string | null;
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_id?: string | null;
}


