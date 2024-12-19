import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/musicStore';
import Sidebar from './Sidebar';
import Player from './Player';
import MainView from './MainView';
import SearchBar from './SearchBar';
import QueueView from './QueueView';
import RecentlyPlayedModal from './modals/RecentlyPlayedModal';
import SinglePlaylistView from './views/SinglePlaylistView';

const MainContent: React.FC = () => {
  const { searchTracks } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRecentlyPlayedModalOpen, setIsRecentlyPlayedModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      navigate('/search');
      
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Add console log to debug
      console.log('Searching for:', query);

      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          await searchTracks(query);
        } catch (error) {
          console.error('Search error:', error);
        }
      }, 500);
    }
  }, [navigate, searchTracks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenRecentlyPlayed={() => setIsRecentlyPlayedModalOpen(true)}
        searchQuery={searchQuery}
      />
      
      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          <SearchBar 
            onSearch={handleSearch}
            value={searchQuery}
            onChange={setSearchQuery}
            debounceTime={500}
          />
        </div>
        <div className="pb-32">
          <Routes>
            <Route path="/" element={<MainView isSidebarOpen={isSidebarOpen} />} />
            <Route path="/search" element={<MainView isSidebarOpen={isSidebarOpen} />} />
            <Route path="/library" element={<MainView isSidebarOpen={isSidebarOpen} />} />
            <Route path="/playlists" element={<MainView isSidebarOpen={isSidebarOpen} />} />
            <Route path="/liked" element={<MainView isSidebarOpen={isSidebarOpen} />} />
            <Route path="/equalizer" element={<MainView isSidebarOpen={isSidebarOpen} />} />
            <Route path="/playlist/:id" element={<SinglePlaylistView />} />
          </Routes>
        </div>
      </main>

      <AnimatePresence>
        {isQueueOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-0 mx-auto w-[350px] h-[70vh] bg-black/90 backdrop-blur-lg border border-white/10 rounded-l-xl z-50 overflow-hidden"
            style={{ 
              right: '0',
              top: '5rem',
              bottom: '5rem'
            }}
          >
            <QueueView onClose={() => setIsQueueOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={`fixed bottom-0 right-0 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-20'}`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl border-t border-white/5" />
          
          <div className="relative z-10">
            <Player 
              onQueueOpen={() => setIsQueueOpen(prev => !prev)}
              isQueueOpen={isQueueOpen}
            />
          </div>
        </div>
      </div>

      <RecentlyPlayedModal
        isOpen={isRecentlyPlayedModalOpen}
        onClose={() => setIsRecentlyPlayedModalOpen(false)}
      />
    </div>
  );
};

export default MainContent; 