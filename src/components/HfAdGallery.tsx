import { useEffect, useState } from "react";
import { fetchHfAds, HfAdRow } from "@/lib/hfAdsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type HfAdGalleryProps = {
  length?: number;
};

export default function HfAdGallery({ length = 24 }: HfAdGalleryProps) {
  const [items, setItems] = useState<HfAdRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [offset, setOffset] = useState(0);

  const load = async (off: number) => {
    setLoading(true);
    const res = await fetchHfAds(off, length);
    if (res.error) setError(res.error);
    setItems(res.items);
    setLoading(false);
  };

  useEffect(() => {
    load(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, length]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-comfortaa">AdImageNet (Hugging Face)</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-sm text-red-600 mb-3">{error}</div>
        )}
        {loading ? (
          <div className="text-sm text-gray-600">Loading ads…</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((ad) => (
              <div key={String(ad.id)} className="border rounded overflow-hidden">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt="ad" className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-xs text-gray-500">No image</div>
                )}
                <div className="p-2 text-xs text-gray-700 break-words">
                  {/* Show a couple of common fields if present */}
                  {ad.metadata?.label && <div><strong>Label:</strong> {String(ad.metadata.label)}</div>}
                  {ad.metadata?.category && <div><strong>Category:</strong> {String(ad.metadata.category)}</div>}
                  <div className="mt-1 text-[10px] text-gray-500">ID: {String(ad.id)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => setOffset((o) => Math.max(o - length, 0))} disabled={offset === 0}>
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOffset((o) => o + length)}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


