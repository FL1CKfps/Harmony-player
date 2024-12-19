import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/musicStore';
import SearchView from './views/SearchView';
import PlaylistView from './views/PlaylistView';
import DiscoverView from './views/DiscoverView';
import LibraryView from './views/LibraryView';
import PlaylistsView from './views/PlaylistsView';
import HomeView from './views/HomeView';
import SearchResults from './views/SearchResults';
import LikedSongsView from './views/LikedSongsView';

interface MainViewProps {
  isSidebarOpen: boolean;
}

const MainView: React.FC<MainViewProps> = ({ isSidebarOpen }) => {
  const { currentView } = useStore();
  const location = useLocation();

  // Function to determine which view to render based on the current path
  const renderView = () => {
    const path = location.pathname;

    switch (path) {
      case '/':
        return <HomeView />;
      case '/search':
        return <SearchResults />;
      case '/library':
        return <LibraryView />;
      case '/playlists':
        return <PlaylistsView />;
      case '/liked':
        return <LikedSongsView />;
      case '/equalizer':
        return <div>Equalizer View</div>;
      default:
        // Check if it's a single playlist view
        if (path.startsWith('/playlist/')) {
          return null; // SinglePlaylistView is rendered by the router
        }
        return <HomeView />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderView()}
    </div>
  );
};

export default MainView;