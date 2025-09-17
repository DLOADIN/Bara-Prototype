export interface SponsoredBanner {
  id: string;
  company_name: string;
  company_website: string;
  banner_image_url: string;
  banner_alt_text?: string;
  country_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_amount: number;
  payment_reference?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  start_date?: string;
  end_date?: string;
  click_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  country_name?: string;
  country_code?: string;
  country_flag_url?: string;
}

export interface CreateSponsoredBannerData {
  company_name: string;
  company_website: string;
  banner_image_url: string;
  banner_alt_text?: string;
  country_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  payment_amount?: number;
  payment_reference?: string;
}

export interface UpdateSponsoredBannerData {
  company_name?: string;
  company_website?: string;
  banner_image_url?: string;
  banner_alt_text?: string;
  country_id?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_amount?: number;
  payment_reference?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  start_date?: string;
  end_date?: string;
}


