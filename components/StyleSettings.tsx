
import React from 'react';
import { motion } from 'framer-motion';
import { DanmeiStyle } from '../types';

interface Props {
  activeStyle: DanmeiStyle;
  onStyleChange: (style: DanmeiStyle) => void;
}

const styles: { id: DanmeiStyle; label: string }[] = [
  { id: 'ancient', label: '古风唯美' },
  { id: 'modern', label: '现代都市' },
  { id: 'fantasy', label: '仙侠玄幻' },
  { id: 'campus', label: '校园清新' },
  { id: 'cyberpunk', label: '未来科幻' },
];

const StyleSettings: React.FC<Props> = ({ activeStyle, onStyleChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {styles.map((s) => (
        <button
          key={s.id}
          onClick={() => onStyleChange(s.id)}
          className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
            activeStyle === s.id
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white border-transparent shadow-md'
              : 'bg-white/40 dark:bg-white/5 text-gray-500 border-white/60 dark:border-white/10 hover:border-purple-300'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

export default StyleSettings;
