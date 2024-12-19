import React, { useState, useEffect } from 'react';
import SearchResults from './SearchResults';

interface SidebarProps {
  isSearchOpen: boolean;
  searchQuery: string;
}

function Sidebar({ isSearchOpen, searchQuery }: SidebarProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setActivePanel('search');
    }
  }, [isSearchOpen]);

  return (
    <div className="sidebar">
      <div className="sidebar-panels">
        {activePanel === 'search' && (
          <div className="search-panel">
            <SearchResults searchQuery={searchQuery} />
          </div>
        )}
        {/* ... other panels ... */}
      </div>
    </div>
  );
}

export default Sidebar; 