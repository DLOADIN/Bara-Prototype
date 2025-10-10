import { supabase } from '@/lib/supabase';

export type PopupAd = {
  id: string;
  name: string;
  image_url: string;
  link_url?: string | null;
  is_active: boolean;
  sort_order: number;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at: string;
  updated_at: string;
};

// Helper function to ensure Supabase client is available
function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  return supabase;
}

export async function fetchActivePopupAds(limit = 50): Promise<PopupAd[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('popup_ads')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', new Date().toISOString())
      .or('starts_at.is.null')
      .order('sort_order', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('fetchActivePopupAds error:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('fetchActivePopupAds failed:', error);
    return [];
  }
}

export async function uploadPopupImage(file: File): Promise<string> {
  try {
    const client = getSupabaseClient();
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await client.storage.from('popup-ads').upload(name, file);
    if (error) throw error;
    const { data: { publicUrl } } = client.storage.from('popup-ads').getPublicUrl(name);
    const url = publicUrl.includes('/object/public/')
      ? publicUrl
      : publicUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
    return url;
  } catch (error) {
    console.error('uploadPopupImage failed:', error);
    throw error;
  }
}

export async function createPopupAd(payload: Partial<PopupAd>): Promise<PopupAd> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('popup_ads').insert(payload).select('*').single();
    if (error) throw error;
    return data as PopupAd;
  } catch (error) {
    console.error('createPopupAd failed:', error);
    throw error;
  }
}

export async function updatePopupAd(id: string, payload: Partial<PopupAd>): Promise<PopupAd> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('popup_ads').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return data as PopupAd;
  } catch (error) {
    console.error('updatePopupAd failed:', error);
    throw error;
  }
}

export async function deletePopupAd(id: string) {
  try {
    const client = getSupabaseClient();
    const { error } = await client.from('popup_ads').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('deletePopupAd failed:', error);
    throw error;
  }
}


