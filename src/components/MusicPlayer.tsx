import { ListMusic } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import QueueView from './QueueView';

const MusicPlayer: React.FC = () => {
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10">
        {/* ... existing player content ... */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsQueueOpen(true)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <ListMusic size={20} className="text-white/60" />
          </motion.button>
          {/* ... volume control ... */}
        </div>
      </div>

      <QueueView 
        isOpen={isQueueOpen} 
        onClose={() => setIsQueueOpen(false)} 
      />
    </>
  );
};

export default MusicPlayer; 