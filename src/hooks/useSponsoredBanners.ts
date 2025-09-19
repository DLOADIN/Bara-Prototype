import { useState, useEffect } from 'react';
import { db, getAdminDb, SUPABASE_URL } from '@/lib/supabase';
import { SponsoredBanner, CreateSponsoredBannerData, UpdateSponsoredBannerData } from '@/types/sponsoredBanner.types';

export const useSponsoredBanners = () => {
  const [banners, setBanners] = useState<SponsoredBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async (adminMode = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const client = adminMode ? getAdminDb() : db;
      const { data, error: fetchError } = await client.sponsored_banners()
        .select(`
          *,
          countries!sponsored_banners_country_id_fkey(
            name,
            code,
            flag_url
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const transformedBanners: SponsoredBanner[] = data?.map((banner: any) => ({
        ...banner,
        banner_image_url: normalizeBannerUrl(banner.banner_image_url),
        country_name: banner.countries?.name,
        country_code: banner.countries?.code,
        country_flag_url: banner.countries?.flag_url,
      })) || [];

      setBanners(transformedBanners);
    } catch (err) {
      console.error('Error fetching sponsored banners:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBanners = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await db.sponsored_banners()
        .select(`
          *,
          countries!sponsored_banners_country_id_fkey(
            name,
            code,
            flag_url
          )
        `)
        .eq('status', 'active')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const transformedBanners: SponsoredBanner[] = data?.map((banner: any) => ({
        ...banner,
        banner_image_url: normalizeBannerUrl(banner.banner_image_url),
        country_name: banner.countries?.name,
        country_code: banner.countries?.code,
        country_flag_url: banner.countries?.flag_url,
      })) || [];

      setBanners(transformedBanners);
    } catch (err) {
      console.error('Error fetching active sponsored banners:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch active banners');
    } finally {
      setLoading(false);
    }
  };

  const fetchBannerByCountry = async (countryId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1) Prefer active + paid
      let { data, error: fetchError } = await db.sponsored_banners()
        .select(`
          *,
          countries!sponsored_banners_country_id_fkey(
            name,
            code,
            flag_url
          )
        `)
        .eq('country_id', countryId)
        .eq('is_active', true)
        .eq('payment_status', 'paid')
        .single();

      // 2) If none, try any active
      if (fetchError && fetchError.code === 'PGRST116') {
        const res = await db.sponsored_banners()
          .select(`
            *,
            countries!sponsored_banners_country_id_fkey(
              name,
              code,
              flag_url
            )
          `)
          .eq('country_id', countryId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        data = res.data as any;
        fetchError = res.error as any;
      }

      // 3) If still none, take latest regardless of flags
      if ((!data || fetchError?.code === 'PGRST116')) {
        const res = await db.sponsored_banners()
          .select(`
            *,
            countries!sponsored_banners_country_id_fkey(
              name,
              code,
              flag_url
            )
          `)
          .eq('country_id', countryId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        data = res.data as any;
        fetchError = res.error as any;
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        const transformedBanner: SponsoredBanner = {
          ...data,
          banner_image_url: normalizeBannerUrl(data.banner_image_url),
          country_name: data.countries?.name,
          country_code: data.countries?.code,
          country_flag_url: data.countries?.flag_url,
        };
        setBanners([transformedBanner]);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error('Error fetching banner by country:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch banner');
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (bannerData: CreateSponsoredBannerData): Promise<SponsoredBanner | null> => {
    try {
      const { data, error: createError } = await db.sponsored_banners()
        .insert(bannerData)
        .select('*')
        .single();

      if (createError) {
        throw createError;
      }

      const transformedBanner: SponsoredBanner = {
        ...data,
      };

      setBanners(prev => [transformedBanner, ...prev]);
      return transformedBanner;
    } catch (err) {
      console.error('Error creating sponsored banner:', err);
      setError(err instanceof Error ? err.message : 'Failed to create banner');
      return null;
    }
  };

  const updateBanner = async (id: string, updates: UpdateSponsoredBannerData): Promise<SponsoredBanner | null> => {
    try {
      const { data, error: updateError } = await getAdminDb().sponsored_banners()
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        throw updateError;
      }

      const transformedBanner: SponsoredBanner = {
        ...data,
      };

      setBanners(prev => prev.map(banner => 
        banner.id === id ? transformedBanner : banner
      ));

      return transformedBanner;
    } catch (err) {
      console.error('Error updating sponsored banner:', err);
      setError(err instanceof Error ? err.message : 'Failed to update banner');
      return null;
    }
  };

  const deleteBanner = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await getAdminDb().sponsored_banners()
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setBanners(prev => prev.filter(banner => banner.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting sponsored banner:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete banner');
      return false;
    }
  };

  const incrementBannerClick = async (id: string): Promise<void> => {
    try {
      // For now, just log the click. In a real app, you'd have a separate analytics table
      console.log(`Banner ${id} clicked`);
    } catch (err) {
      console.error('Error incrementing banner click:', err);
    }
  };

  const incrementBannerView = async (id: string): Promise<void> => {
    try {
      // For now, just log the view. In a real app, you'd have a separate analytics table
      console.log(`Banner ${id} viewed`);
    } catch (err) {
      console.error('Error incrementing banner view:', err);
    }
  };

  // Ensure we always return a valid public URL for storage objects
  const normalizeBannerUrl = (value: string | null | undefined): string | null => {
    if (!value) return null;
    const cleaned = String(value).trim();
    // If already an absolute https URL, keep as is
    if (cleaned.startsWith('http')) {
      // If it contains our storage public path, ensure it's using the current SUPABASE_URL host
      const marker = '/storage/v1/object/public/sponsored-banners/';
      if (cleaned.includes(marker)) {
        const idx = cleaned.indexOf(marker);
        const path = cleaned.substring(idx + marker.length).replace(/^\/*/, '');
        return `${SUPABASE_URL}${marker}${path}`;
      }
      return cleaned;
    }
    // If it was saved as a blob URL or multi-line string, try to extract the storage object path
    const marker = 'sponsored-banners/';
    if (cleaned.includes(marker)) {
      const idx = cleaned.indexOf(marker) + marker.length;
      const rest = cleaned.substring(idx).split(/\s|\n|\r/)[0].replace(/^\/*/, '');
      return `${SUPABASE_URL}/storage/v1/object/public/sponsored-banners/${rest}`;
    }
    // Otherwise treat as a simple path like "banners/filename.jpg"
    const trimmed = cleaned.replace(/^\/*/, '');
    return `${SUPABASE_URL}/storage/v1/object/public/sponsored-banners/${trimmed}`;
  };

  return {
    banners,
    loading,
    error,
    fetchBanners,
    fetchActiveBanners,
    fetchBannerByCountry,
    createBanner,
    updateBanner,
    deleteBanner,
    incrementBannerClick,
    incrementBannerView,
  };
};


