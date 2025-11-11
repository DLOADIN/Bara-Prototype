import React, { useState, useRef, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Hash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MultiHashtagInputProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
  placeholder?: string;
  maxHashtags?: number;
}

export const MultiHashtagInput = ({ 
  hashtags, 
  onHashtagsChange, 
  placeholder = "Type hashtags separated by commas or press Enter",
  maxHashtags = 10
}: MultiHashtagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizeHashtag = (hashtag: string): string => {
    return hashtag
      .replace('#', '') // Remove # symbol
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ''); // Remove spaces
  };

  const addHashtags = (input: string) => {
    // Split by commas, newlines, or spaces and clean up
    const newHashtags = input
      .split(/[,\n\s]+/)
      .map(normalizeHashtag)
      .filter(tag => tag.length > 0 && !hashtags.includes(tag))
      .slice(0, maxHashtags - hashtags.length);

    if (newHashtags.length > 0) {
      onHashtagsChange([...hashtags, ...newHashtags]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  const removeHashtag = (hashtagToRemove: string) => {
    onHashtagsChange(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (inputValue.trim()) {
        addHashtags(inputValue);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && hashtags.length > 0) {
      // Remove last hashtag if input is empty and backspace is pressed
      removeHashtag(hashtags[hashtags.length - 1]);
    } else if (e.key === ',' || e.key === ' ') {
      e.preventDefault();
      if (inputValue.trim()) {
        addHashtags(inputValue);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addHashtags(pastedText);
  };

  const addSingleHashtag = () => {
    if (inputValue.trim()) {
      addHashtags(inputValue);
    }
  };

  const clearAll = () => {
    onHashtagsChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Current Hashtags Display */}
      {hashtags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current Hashtags:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-6 px-2 text-xs text-gray-500 hover:text-red-600"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag) => (
              <Badge 
                key={hashtag} 
                variant="secondary" 
                className="pl-2 pr-1 py-1 bg-blue-50 text-blue-700 border-blue-200"
              >
                <Hash className="w-3 h-3 mr-1" />
                {hashtag}
                <button
                  type="button"
                  onClick={() => removeHashtag(hashtag)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={hashtags.length >= maxHashtags ? `Maximum ${maxHashtags} hashtags reached` : placeholder}
              disabled={hashtags.length >= maxHashtags}
              className="pl-9"
            />
          </div>
          {inputValue.trim() && hashtags.length < maxHashtags && (
            <Button
              type="button"
              onClick={addSingleHashtag}
              size="sm"
              className="px-3"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          )}
        </div>
        
        {/* Helper Text */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            Tip: Type hashtags separated by commas, spaces, or press Enter. Paste multiple hashtags at once.
          </span>
          <span>{hashtags.length}/{maxHashtags} hashtags</span>
        </div>
      </div>

      {/* Quick Add Popular Hashtags */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Quick Add Popular:</span>
        <div className="flex flex-wrap gap-2">
          {['music', 'art', 'technology', 'business', 'food', 'sports', 'networking', 'workshop'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => !hashtags.includes(tag) && hashtags.length < maxHashtags && addHashtags(tag)}
              disabled={hashtags.includes(tag) || hashtags.length >= maxHashtags}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                hashtags.includes(tag)
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};