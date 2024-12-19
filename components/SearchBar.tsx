import React, { useState } from 'react';

interface SearchBarProps {
  onSearchFocus: () => void;
  onSearch: (query: string) => void;
}

function SearchBar({ onSearchFocus, onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search..."
        onFocus={onSearchFocus}
      />
    </div>
  );
}

export default SearchBar; 