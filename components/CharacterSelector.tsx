
import React from 'react';
import { Feather, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreationType } from '../types';

interface Character {
  id: CreationType;
  name: string;
  persona: string;
  icon: any;
  color: string;
  desc: string;
}

const characters: Character[] = [
  { id: 'writing', name: '墨韵书斋', persona: '文墨', icon: Feather, color: 'text-purple-400', desc: '银发紫眸的文豪' },
  { id: 'drawing', name: '丹青画阁', persona: '画韵', icon: Palette, color: 'text-blue-400', desc: '黑发蓝眸的画师' },
  { id: 'inspiration', name: '灵感集', persona: '精灵', icon: Sparkles, color: 'text-pink-400', desc: '变幻莫测的团宠' }
];

interface Props {
  activeId: CreationType;
  onSelect: (id: CreationType) => void;
}

const CharacterSelector: React.FC<Props> = ({ activeId, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {characters.map((char) => (
        <motion.button
          key={char.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(char.id)}
          className={`relative group flex flex-col items-center p-6 min-w-[140px] rounded-[32px] transition-all duration-500 overflow-hidden ${
            activeId === char.id 
              ? 'glass shadow-xl scale-110 z-10' 
              : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
          }`}
        >
          {activeId === char.id && (
            <motion.div 
              layoutId="active-bg"
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" 
            />
          )}
          <char.icon size={32} className={`mb-3 transition-colors ${activeId === char.id ? char.color : 'text-gray-400'}`} />
          <span className={`text-base font-bold tracking-widest ${activeId === char.id ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500'}`}>
            {char.name}
          </span>
          <span className="text-xs mt-1 opacity-50 uppercase tracking-tighter">
            {char.persona} · {char.id === 'inspiration' ? '精灵团' : '助手'}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default CharacterSelector;
