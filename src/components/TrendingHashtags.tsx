import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, TrendingUp } from 'lucide-react';
import { EventsService } from '@/lib/eventsService';

interface TrendingHashtagsProps {
  onHashtagClick?: (hashtag: string) => void;
  limit?: number;
}

export const TrendingHashtags = ({ onHashtagClick, limit = 10 }: TrendingHashtagsProps) => {
  const [trendingHashtags, setTrendingHashtags] = useState<{ hashtag: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const hashtags = await EventsService.getTrendingHashtags(limit);
        setTrendingHashtags(hashtags);
      } catch (error) {
        console.error('Failed to fetch trending hashtags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingHashtags();
  }, [limit]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trending Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trendingHashtags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            Trending Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No trending hashtags available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="w-5 h-5 mr-2" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingHashtags.map(({ hashtag, count }) => (
            <div
              key={hashtag}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                onHashtagClick 
                  ? 'hover:bg-gray-50 cursor-pointer' 
                  : 'bg-gray-50'
              }`}
              onClick={() => onHashtagClick?.(hashtag)}
            >
              <Badge 
                variant="outline" 
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                <Hash className="w-3 h-3 mr-1" />
                {hashtag}
              </Badge>
              <span className="text-sm text-gray-500 font-medium">
                {count} event{count !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};