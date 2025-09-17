import { useState, useEffect } from 'react';
import { db, getAdminDb } from '@/lib/supabase';
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
      const { data, error: fetchError } = await db.sponsored_banners()
        .select(`
          *,
          countries!sponsored_banners_country_id_fkey(
            name,
            code,
            flag_url
          )
        `)
        .eq('country_id', countryId)
        .eq('status', 'active')
        .eq('payment_status', 'paid')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      if (data) {
        const transformedBanner: SponsoredBanner = {
          ...data,
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
        .select(`
          *,
          countries!sponsored_banners_country_id_fkey(
            name,
            code,
            flag_url
          )
        `)
        .single();

      if (createError) {
        throw createError;
      }

      const transformedBanner: SponsoredBanner = {
        ...data,
        country_name: data.countries?.name,
        country_code: data.countries?.code,
        country_flag_url: data.countries?.flag_url,
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
        .select(`
          *,
          countries!sponsored_banners_country_id_fkey(
            name,
            code,
            flag_url
          )
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      const transformedBanner: SponsoredBanner = {
        ...data,
        country_name: data.countries?.name,
        country_code: data.countries?.code,
        country_flag_url: data.countries?.flag_url,
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
      await db.sponsored_banners()
        .update({ click_count: db.sponsored_banners().select('click_count').single().then(r => (r.data?.click_count || 0) + 1) })
        .eq('id', id);
    } catch (err) {
      console.error('Error incrementing banner click:', err);
    }
  };

  const incrementBannerView = async (id: string): Promise<void> => {
    try {
      await db.sponsored_banners()
        .update({ view_count: db.sponsored_banners().select('view_count').single().then(r => (r.data?.view_count || 0) + 1) })
        .eq('id', id);
    } catch (err) {
      console.error('Error incrementing banner view:', err);
    }
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


