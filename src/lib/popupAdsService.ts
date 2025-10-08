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

export async function fetchActivePopupAds(limit = 50): Promise<PopupAd[]> {
  const { data, error } = await supabase
    .from('popup_ads')
    .select('*')
    .eq('is_active', true)
    .lte('starts_at', new Date().toISOString())
    .or('starts_at.is.null')
    .order('sort_order', { ascending: true })
    .limit(limit);
  if (error) {
    console.error('fetchActivePopupAds', error);
    return [];
  }
  return data || [];
}

export async function uploadPopupImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('popup-ads').upload(name, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('popup-ads').getPublicUrl(name);
  const url = publicUrl.includes('/object/public/')
    ? publicUrl
    : publicUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
  return url;
}

export async function createPopupAd(payload: Partial<PopupAd>): Promise<PopupAd> {
  const { data, error } = await supabase.from('popup_ads').insert(payload).select('*').single();
  if (error) throw error;
  return data as PopupAd;
}

export async function updatePopupAd(id: string, payload: Partial<PopupAd>): Promise<PopupAd> {
  const { data, error } = await supabase.from('popup_ads').update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return data as PopupAd;
}

export async function deletePopupAd(id: string) {
  const { error } = await supabase.from('popup_ads').delete().eq('id', id);
  if (error) throw error;
}


