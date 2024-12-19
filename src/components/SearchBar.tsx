import React, { useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  value, 
  onChange,
  debounceTime = 500 
}) => {
  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        onSearch(query);
      }
    }, debounceTime),
    [onSearch, debounceTime]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue); // Update input value immediately
    if (newValue.trim()) { // Only search if there's actual content
      debouncedSearch(newValue);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="What do you want to listen to?"
        className="w-full h-12 pl-12 pr-4 bg-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/40"
      />
    </div>
  );
};

export default SearchBar;