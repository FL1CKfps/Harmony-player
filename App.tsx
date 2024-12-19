import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setIsSearchOpen(true);
    }
  };

  return (
    <div className="app">
      <SearchBar 
        onSearchFocus={handleSearchFocus} 
        onSearch={handleSearch}
      />
      <Sidebar 
        isSearchOpen={isSearchOpen} 
        searchQuery={searchQuery}
      />
      {/* ... rest of your app ... */}
    </div>
  );
}

export default App; 