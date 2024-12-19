interface SearchResultsProps {
  searchQuery: string;
}

function SearchResults({ searchQuery }: SearchResultsProps) {
  return (
    <div className="search-results">
      {searchQuery && (
        <div className="search-results-container">
          {/* Search results content */}
          <div className="search-results-grid">
            {/* Your results mapping logic here */}
          </div>
        </div>
      )}
      {!searchQuery && (
        <div className="empty-search">
          <p>Start typing to search...</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults; 