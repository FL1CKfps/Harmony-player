import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<Props> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bars = 64;
  const fpsInterval = 1000 / 60;
  
  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;
    let then = Date.now();
    
    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      const now = Date.now();
      const elapsed = now - then;
      
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Generate dynamic bar heights
        for (let i = 0; i < bars; i++) {
          const height = Math.random() * 100 * (isPlaying ? 1 : 0.2);
          const hue = (i / bars) * 270 + 180; // Purple to blue gradient
          
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
          ctx.fillRect(
            (canvas.width / bars) * i,
            canvas.height - height,
            canvas.width / bars - 2,
            height
          );
        }
      }
    };
    
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-24 glass rounded-xl overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={96}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default AudioVisualizer;