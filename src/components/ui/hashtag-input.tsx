import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Hash } from 'lucide-react';

interface HashtagInputProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  placeholder?: string;
  maxHashtags?: number;
  suggestions?: string[];
}

export const HashtagInput = ({ 
  hashtags, 
  onHashtagsChange, 
  placeholder = "Add hashtags...",
  maxHashtags = 10,
  suggestions = []
}: HashtagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular hashtag suggestions based on event categories
  const defaultSuggestions = [
    'music', 'art', 'technology', 'business', 'food', 'fashion', 'sports', 'education', 
    'health', 'entertainment', 'networking', 'workshop', 'conference', 'festival',
    'community', 'charity', 'startup', 'innovation', 'culture', 'outdoor'
  ];

  const allSuggestions = [...new Set([...suggestions, ...defaultSuggestions])];

  useEffect(() => {
    if (inputValue) {
      const filtered = allSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !hashtags.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, hashtags, allSuggestions]);

  const addHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.replace('#', '').toLowerCase().trim();
    if (cleanHashtag && !hashtags.includes(cleanHashtag) && hashtags.length < maxHashtags) {
      onHashtagsChange([...hashtags, cleanHashtag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeHashtag = (hashtagToRemove: string) => {
    onHashtagsChange(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (inputValue.trim()) {
        addHashtag(inputValue);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && hashtags.length > 0) {
      removeHashtag(hashtags[hashtags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove # symbol if typed
    if (value.startsWith('#')) {
      value = value.substring(1);
    }
    setInputValue(value);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        {/* Hashtags display */}
        <div className="flex flex-wrap gap-2 mb-2">
          {hashtags.map((hashtag) => (
            <Badge key={hashtag} variant="secondary" className="pl-2 pr-1 py-1">
              <Hash className="w-3 h-3 mr-1" />
              {hashtag}
              <button
                type="button"
                onClick={() => removeHashtag(hashtag)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Input field */}
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={hashtags.length >= maxHashtags ? `Maximum ${maxHashtags} hashtags` : placeholder}
            disabled={hashtags.length >= maxHashtags}
            className="pl-8"
          />
          <Hash className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addHashtag(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <Hash className="w-3 h-3 inline mr-1" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Press Enter or Tab to add hashtags</span>
        <span>{hashtags.length}/{maxHashtags} hashtags</span>
      </div>
    </div>
  );
};