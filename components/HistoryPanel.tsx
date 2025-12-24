
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, RotateCcw, FileText, ImageIcon, Zap } from 'lucide-react';
import { DanmeiStyle, HistoryItem } from '../types';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const styleLabels: Record<DanmeiStyle, string> = {
  ancient: '古风',
  modern: '现代',
  fantasy: '玄幻',
  campus: '校园',
  cyberpunk: '科幻',
};

const getStyleLabel = (style?: DanmeiStyle | string) => {
  if (!style) return '未知';
  return styleLabels[style as DanmeiStyle] || style;
};

const HistoryPanel: React.FC<Props> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center gap-2 px-4">
        <Clock size={18} className="text-gray-400" />
        <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase">昔日残卷</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode='popLayout'>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-5 rounded-[28px] group hover:shadow-xl transition-all cursor-pointer flex gap-4 items-center"
              onClick={() => onSelect(item)}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                item.type === 'writing' ? 'bg-purple-100 text-purple-500' : 
                item.type === 'drawing' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'
              }`}>
                {item.type === 'writing' ? <FileText size={20} /> : 
                 item.type === 'drawing' ? <ImageIcon size={20} /> : <Zap size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 mb-0.5">
                  {new Date(item.timestamp).toLocaleDateString()} · {getStyleLabel(item.style)}
                </p>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">
                  {item.type === 'writing' ? item.content.title : item.prompt || '灵感火花'}
                </h4>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  className="p-2 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryPanel;
