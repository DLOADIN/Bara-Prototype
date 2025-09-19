import { useEffect, useRef, useState } from "react";
import PopupAd from "@/components/PopupAd";
import { fetchHfAds, HfAdRow } from "@/lib/hfAdsService";

type HfPopupAdProps = {
  intervalSeconds?: number;
  firstDelaySeconds?: number;
  linkUrl?: string;
  frequencyKey?: string;
  closeLabel?: string;
  batchLength?: number;
};

export default function HfPopupAd({
  intervalSeconds = 600,
  firstDelaySeconds = 6,
  linkUrl,
  frequencyKey = "popup_hf_default",
  closeLabel = "Close",
  batchLength = 50,
}: HfPopupAdProps) {
  const [items, setItems] = useState<HfAdRow[]>([]);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchHfAds(0, batchLength);
      if (!mounted) return;
      if (res.items && res.items.length > 0) {
        setItems(res.items.filter((r) => !!r.imageUrl));
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchLength]);

  // Rotate image index aligned with popup cadence
  const schedule = (delaySec: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIdx((old) => {
        if (items.length === 0) return old;
        return (old + 1) % items.length;
      });
      schedule(intervalSeconds);
    }, delaySec * 1000);
  };

  useEffect(() => {
    schedule(firstDelaySeconds);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDelaySeconds, intervalSeconds, items.length]);

  const currentImage = items.length > 0 ? items[idx]?.imageUrl : undefined;

  // If no items yet, render nothing until fetched
  if (!currentImage) return null;

  return (
    <PopupAd
      imageUrl={currentImage}
      linkUrl={linkUrl}
      intervalSeconds={intervalSeconds}
      firstDelaySeconds={firstDelaySeconds}
      frequencyKey={frequencyKey}
      closeLabel={closeLabel}
    />
  );
}


