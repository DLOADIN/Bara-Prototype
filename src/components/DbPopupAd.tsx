import { useEffect, useState } from 'react';
import { fetchActivePopupAds } from '@/lib/popupAdsService';
import PopupAd from './PopupAd';

export default function DbPopupAd() {
  const [ads, setAds] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading popup ads...');
        const activeAds = await fetchActivePopupAds(5); // Get up to 5 active ads
        console.log('Loaded popup ads:', activeAds);
        setAds(activeAds);
      } catch (error) {
        console.error('Failed to load popup ads:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setAds([]); // Ensure ads is empty on error
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, []);

  // Don't render anything if loading, error, or no ads
  if (loading) {
    return null; // Silent loading
  }

  if (error) {
    console.warn('DbPopupAd error:', error);
    return null; // Silent error handling
  }

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  // Cycle through ads every 30 seconds
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <PopupAd
      imageUrl={currentAd.image_url}
      linkUrl={currentAd.link_url}
      frequencyKey={`db_popup_${currentAd.id}`}
      firstDelaySeconds={5}
      intervalSeconds={30}
      closeLabel="Close"
    />
  );
}
