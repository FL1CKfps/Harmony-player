import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search,
  Library,
  Heart, 
  Settings2, 
  ListMusic,
  ChevronLeft,
  ChevronRight,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/musicStore';
import MoodMatcher from './MoodMatcher';
import RecentlyPlayed from './sections/RecentlyPlayed';
import Logo from './icons/Logo';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenRecentlyPlayed: () => void;
  searchQuery: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onOpenRecentlyPlayed, searchQuery }) => {
  const { currentView, setCurrentView } = useStore();
  const location = useLocation();
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Sliders, label: 'Equalizer', path: '/equalizer' },
  ];

  const bottomItems = [
    { icon: Settings2, label: 'Settings', view: 'settings' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen glass border-r border-white/10 transition-all duration-300 overflow-x-hidden overflow-y-auto sidebar-scrollbar ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      style={{ maxHeight: '100vh' }}
    >
      <div className="relative min-h-full flex flex-col p-4">
        <div className="flex items-center space-x-3 mb-6 px-2">
          <Logo size={28} />
          {isOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Harmony
            </h1>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="absolute -right-3 top-6 p-2 rounded-full bg-purple-500 text-white shadow-lg z-50 hover:bg-purple-600 transition-colors"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </motion.button>

        <nav className="flex-1">
          <div className="space-y-1 mb-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                location.pathname.startsWith('/library')
                  ? 'bg-purple-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Library size={20} />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">Your Library</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      isLibraryExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </>
              )}
            </button>

            {isOpen && isLibraryExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-6 space-y-1"
              >
                <Link
                  to="/liked"
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                    location.pathname === '/liked'
                      ? 'bg-purple-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart size={20} />
                  <span>Liked Songs</span>
                </Link>

                <Link
                  to="/playlists"
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                    location.pathname === '/playlists'
                      ? 'bg-purple-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ListMusic size={20} />
                  <span>Playlists</span>
                </Link>
              </motion.div>
            )}
          </div>

          {isOpen && (
            <>
              <div className="mt-6 pt-4 border-t border-white/10">
                <MoodMatcher />
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <RecentlyPlayed onSeeAll={onOpenRecentlyPlayed} />
              </div>
            </>
          )}
        </nav>

        <div className="border-t border-white/10 pt-4 mt-4">
          {bottomItems.map((item) => (
            <motion.button
              key={item.view}
              whileHover={{ x: 4 }}
              onClick={() => setCurrentView(item.view)}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <item.icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;