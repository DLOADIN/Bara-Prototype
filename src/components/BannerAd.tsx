import React, { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
        }))
        .filter((b: SponsoredBannerRow) => !!b.banner_image_url);
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
    <div className={`w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 px-[15px] py-[15px] ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-center h-[500px]">
          {loading ? (
            <div className="animate-pulse flex w-full h-full">
              <div className="rounded bg-gray-300 w-full h-full"></div>
            </div>
          ) : bannerToShow ? (
            <div 
              className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-lg"
              onClick={onClick}
            >
              <img
                src={bannerToShow.banner_image_url}
                alt={bannerToShow.banner_alt_text || t('bannerAd.placeholder.title')}
                // style={{aspectRatio: 16 / 9 }}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex flex-col items-center justify-center px-4">
                <span className="text-gray-700 font-semibold text-lg">{t('bannerAd.placeholder.title')}</span>
                <span className="text-gray-600 text-sm mt-2">{t('bannerAd.placeholder.subtitle')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerAd;
