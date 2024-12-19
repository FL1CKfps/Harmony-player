import React from 'react';
import { motion } from 'framer-motion';
import { Settings2, Music4 } from 'lucide-react';
import { useStore } from '../store/musicStore';

const Equalizer: React.FC = () => {
  const { playbackState, updatePlaybackState } = useStore();
  
  const handlePresetChange = (presetName: string) => {
    const preset = playbackState.equalizer.bands.find(p => p.name === presetName);
    if (preset) {
      updatePlaybackState({ equalizer: preset });
    }
  };

  const handleEffectChange = (effect: keyof typeof playbackState.effects, value: number) => {
    updatePlaybackState({
      effects: {
        ...playbackState.effects,
        [effect]: value
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Settings2 className="text-purple-500" size={24} />
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Sound Customization
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-white/80 mb-4">Effects</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 block mb-2">
                Reverb
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={playbackState.effects.reverb}
                onChange={(e) => handleEffectChange('reverb', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/60 block mb-2">
                Delay
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={playbackState.effects.delay}
                onChange={(e) => handleEffectChange('delay', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm text-white/60 block mb-2">
                Compression
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={playbackState.effects.compression}
                onChange={(e) => handleEffectChange('compression', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Equalizer;