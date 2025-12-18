
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

const PromptInput: React.FC<Props> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative group">
      <textarea
        className="w-full bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/5 rounded-[24px] p-6 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/30 min-h-[140px] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-800 dark:text-gray-200 resize-none shadow-inner"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute bottom-4 right-6 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        按 Command/Ctrl + Enter 快速生成
      </div>
    </div>
  );
};

export default PromptInput;
