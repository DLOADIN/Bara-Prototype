import React, { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../lib/supabase';

interface BannerAdProps {
  className?: string;
}

interface SponsoredBannerRow {
  id: string;
  banner_image_url: string;
  banner_alt_text: string | null;
  company_website: string | null;
}

let bannerAdInstanceCounter = 0;

export const BannerAd: React.FC<BannerAdProps> = ({ className = "" }) => {
  const [banners, setBanners] = useState<SponsoredBannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const instanceIndexRef = useRef<number>(bannerAdInstanceCounter++ % 2);

  useEffect(() => {
    const fetchLatestActive = async () => {
      setLoading(true);
      try {
        // 1) Primary: only active banners
        let { data, error }: any = await db.sponsored_banners()
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(2);

        // 2) If none or schema issues, try approved status
        if ((error && error.code === 'PGRST204') || !data || data.length === 0) {
          const res1 = await db.sponsored_banners()
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .limit(2);
          data = res1.data;
          error = res1.error;
        }

        // 3) If still none, try paid banners
        if ((!data || data.length === 0) && !error) {
          const res2 = await db.sponsored_banners()
            .select('*')
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false })
            .limit(2);
          data = res2.data;
          error = res2.error;
        }

        if (error) throw error;

        const rows: SponsoredBannerRow[] = (data || []).map((b: any) => ({
          id: b.id,
          banner_image_url: b.banner_image_url,
          banner_alt_text: b.banner_alt_text || null,
          company_website: b.company_website || null,
        }));
        setBanners(rows);
      } catch (err) {
        console.error('Error fetching sponsored banners for BannerAd:', err);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestActive();
  }, []);

  const bannerToShow = useMemo(() => {
    if (banners.length === 0) return null;
    if (banners.length === 1) return banners[0];
    return banners[instanceIndexRef.current];
  }, [banners]);

  const onClick = () => {
    if (bannerToShow?.company_website) {
      window.open(bannerToShow.company_website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-[120px]">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="rounded bg-gray-300 h-16 w-16"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ) : bannerToShow ? (
            <div 
              className="w-full h-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onClick}
            >
              <img
                src={bannerToShow.banner_image_url}
                alt={bannerToShow.banner_alt_text || 'Sponsored banner'}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-6 text-center">
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Ad</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-700 text-lg font-semibold mb-1">
                  Sponsored Banner
                </div>
                <div className="text-gray-500 text-sm">
                  Your company here
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerAd;
