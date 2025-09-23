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
  
  const ensureProtocol = (url: string | null | undefined) => {
    if (!url) return null;
    try {
      // If URL constructor succeeds, protocol is present and other details are also present
      const u = new URL(url);
      return u.toString();
    } catch {
      // Prepend https if missing protocol
      return `https://${url.replace(/^\/+/, '')}`;
    }
  };

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

  const targetUrl = ensureProtocol(bannerToShow?.company_website || null);
  const sponsorHost = useMemo(() => {
    if (!targetUrl) return null;
    try {
      const u = new URL(targetUrl);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }, [targetUrl]);

  return (
    <div className={`w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 px-[15px] py-[15px] ${className}`}>
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {/* Left: Sponsor info */}
          <div className="md:w-2/5 w-full bg-white/60 rounded-lg p-4 md:p-6 border border-white/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700 bg-blue-100 rounded-full px-2 py-1">
                <span>{t('bannerAd.labels.sponsored')}</span>
              </div>
              <h3 className="mt-3 text-xl md:text-2xl font-bold text-yp-dark">
                {bannerToShow?.banner_alt_text || t('bannerAd.placeholder.title')}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                {t('bannerAd.placeholder.subtitle')}
              </p>
              {sponsorHost && (
                <p className="mt-3 text-sm text-gray-600">
                  {t('bannerAd.labels.sponsoredBy')} <span className="font-semibold">{sponsorHost}</span>
                </p>
              )}
            </div>
            {targetUrl && (
              <div className="mt-4">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('bannerAd.actions.visitSite')}
                </a>
              </div>
            )}
          </div>

          {/* Right: Banner image (smaller height) */}
          <div className="md:w-3/5 w-full">
            {loading ? (
              <div className="animate-pulse w-full h-[260px] md:h-[320px] rounded-lg bg-gray-300" />
            ) : bannerToShow ? (
              targetUrl ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg hover:opacity-95 transition-opacity"
                  aria-label={bannerToShow.banner_alt_text || t('bannerAd.placeholder.title')}
                >
                  <img
                    src={bannerToShow.banner_image_url}
                    alt={bannerToShow.banner_alt_text || t('bannerAd.placeholder.title')}
                    className="w-full h-[260px] md:h-[320px] object-cover"
                  />
                </a>
              ) : (
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={bannerToShow.banner_image_url}
                    alt={bannerToShow.banner_alt_text || t('bannerAd.placeholder.title')}
                    className="w-full h-[260px] md:h-[320px] object-cover"
                  />
                </div>
              )
            ) : (
              <div className="w-full h-[260px] md:h-[320px] bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center text-center px-4">
                <div>
                  <span className="text-gray-700 font-semibold text-lg">{t('bannerAd.placeholder.title')}</span>
                  <span className="block text-gray-600 text-sm mt-2">{t('bannerAd.placeholder.subtitle')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAd;
