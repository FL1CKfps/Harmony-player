import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import MainContent from './components/MainContent';
import LoadingScreen from './components/LoadingScreen';
import RecentlyPlayedModal from './components/modals/RecentlyPlayedModal';
import QueueView from './components/QueueView';
import { Toaster } from 'react-hot-toast';
import WelcomeModal from './components/modals/WelcomeModal';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const loadApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const userName = localStorage.getItem('harmony_user_name');
      setShowWelcome(!userName);
      setIsLoading(false);
    };
    loadApp();
  }, []);

  const handleWelcomeClose = (name: string) => {
    setShowWelcome(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <Router>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black text-white">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1800')] opacity-10" />
        <MainContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
            },
          }}
        />
        <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      </div>
    </Router>
  );
};

export default App;