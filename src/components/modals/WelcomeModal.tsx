import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: (name: string) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('harmony_user_name', name.trim());
      onClose(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-black/90 p-8 rounded-2xl w-full max-w-md border border-white/10"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Music2 size={32} className="text-purple-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome to Harmony</h2>
            <p className="text-white/60">Let's personalize your experience</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-white/60 block text-left">
                What's your name?
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeModal; 