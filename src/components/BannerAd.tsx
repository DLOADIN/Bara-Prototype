import React, { useState, useEffect } from 'react';
import { supabase, getAdminDb } from '../lib/supabase';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BannerAdProps {
  children?: React.ReactNode;
  className?: string;
}

interface BannerAdData {
  id: string;
  title: string;
  image_url: string;
  redirect_url: string;
  alt_text?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ 
  children, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const [activeBannerAd, setActiveBannerAd] = useState<BannerAdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveBannerAd();
  }, []);

  const fetchActiveBannerAd = async () => {
    try {
      console.log('Attempting to fetch banner ads...');
      
      // Try direct supabase client first to test connection
      const { data, error } = await supabase
        .from('banner_ads')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      console.log('Banner ad query result:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No active banner ads found');
          setActiveBannerAd(null);
          return;
        }
        console.error('Error fetching banner ad:', error);
        return;
      }

      setActiveBannerAd(data);
      
      // Track view
      if (data) {
        await trackView(data.id);
      }
    } catch (error) {
      console.error('Error fetching banner ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (bannerAdId: string) => {
    try {
      const adminDb = getAdminDb();
      // Track the view
      await adminDb.banner_ad_analytics().insert([
        {
          banner_ad_id: bannerAdId,
          event_type: 'view',
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          created_at: new Date().toISOString()
        }
      ]);

      // Increment view count
      await supabase.rpc('increment_banner_ad_views', { banner_ad_id: bannerAdId });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const trackClick = async (bannerAdId: string) => {
    try {
      const adminDb = getAdminDb();
      // Track the click
      await adminDb.banner_ad_analytics().insert([{
        banner_ad_id: bannerAdId,
        event_type: 'click',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        created_at: new Date().toISOString()
      }]);

      // Increment click count
      await supabase.rpc('increment_banner_ad_clicks', { banner_ad_id: bannerAdId });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleBannerClick = (bannerAd: BannerAdData) => {
    trackClick(bannerAd.id);
    window.open(bannerAd.redirect_url, '_blank', 'noopener,noreferrer');
  };

  // Track view when banner ad loads
  useEffect(() => {
    if (activeBannerAd) {
      trackView(activeBannerAd.id);
    }
  }, [activeBannerAd]);

  if (loading) {
    return (
      <div className={`w-full bg-gray-100 border-b border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[120px]">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded bg-gray-300 h-16 w-16"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-[120px]">
          {children || (activeBannerAd ? (
            <div 
              className="w-full h-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleBannerClick(activeBannerAd)}
            >
              <img
                src={activeBannerAd.image_url}
                alt={activeBannerAd.alt_text || activeBannerAd.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-6 text-center">
              {/* Default placeholder when no active ads */}
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{t('bannerAd.placeholder.badge')}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-700 text-lg font-semibold mb-1">
                  {t('bannerAd.placeholder.title')}
                </div>
                <div className="text-gray-500 text-sm">
                  {t('bannerAd.placeholder.subtitle')}
                </div>
              </div>
              <div className="hidden md:block">
                <Link to="/advertise"> 
                  <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    {t('bannerAd.placeholder.learnMore')}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Default export for easier importing
export default BannerAd;
