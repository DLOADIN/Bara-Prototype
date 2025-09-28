import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { SponsoredBanner } from '@/types/sponsoredBanner.types';

export const TopBannerAd: React.FC = () => {
  const { t } = useTranslation();
  const [banner, setBanner] = useState<SponsoredBanner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopBanner();
  }, []);

  const fetchTopBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsored_banners')
        .select('*')
        .eq('is_active', true)
        .eq('display_on_top', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching top banner:', error);
      } else if (data && data.length > 0) {
        setBanner(data[0]);
        // Track view
        trackBannerView(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching top banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackBannerView = async (bannerId: string) => {
    try {
      await supabase
        .from('sponsored_banner_analytics')
        .insert({
          banner_id: bannerId,
          event_type: 'view',
          user_agent: navigator.userAgent,
        });
    } catch (error) {
      console.error('Error tracking banner view:', error);
    }
  };

  const trackBannerClick = async (bannerId: string) => {
    try {
      await supabase
        .from('sponsored_banner_analytics')
        .insert({
          banner_id: bannerId,
          event_type: 'click',
          user_agent: navigator.userAgent,
        });
    } catch (error) {
      console.error('Error tracking banner click:', error);
    }
  };

  const handleBannerClick = (banner: SponsoredBanner) => {
    trackBannerClick(banner.id);
    // Open in new tab
    window.open(banner.company_website, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-100 animate-pulse h-20 rounded-lg"></div>
    );
  }

  if (!banner) {
    return null; // Don't render anything if no banner
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div 
          className="relative cursor-pointer group"
          onClick={() => handleBannerClick(banner)}
        >
          <img
            src={banner.banner_image_url}
            alt={banner.banner_alt_text || banner.company_name}
            className="w-full h-16 md:h-20 object-cover rounded-lg transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"></div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Ad
          </div>
        </div>
      </div>
    </div>
  );
};
