import React from 'react';
import { motion } from 'framer-motion';

interface GenreCardProps {
  title: string;
  color: string;
  onClick: () => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ title, color, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} p-6 rounded-lg cursor-pointer transition-shadow hover:shadow-xl`}
    >
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </motion.div>
  );
};

export default GenreCard;
