
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Heart, Info, ChevronRight, Check, Star } from 'lucide-react';
import { CreationType, HistoryItem } from '../types';
import { useApp } from '../store/AppContext';
import { api } from '../services/api';

interface Props {
  type: CreationType;
  item: HistoryItem; // 改为接收整个 HistoryItem
}

const ResultDisplay: React.FC<Props> = ({ type, item }) => {
  const { state, dispatch } = useApp();
  const [copied, setCopied] = useState(false);
  const { content } = item;

  const isCollected = state.collections.some(c => c.id === item.id);

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = async () => {
    const response = await api.toggleFavorite(item);
    if (response.success && response.data) {
      dispatch({ type: 'SET_COLLECTIONS', payload: response.data });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mt-12"
    >
      {type === 'writing' && (
        <div className="glass rounded-[48px] p-10 space-y-10 shadow-2xl border-white/40 overflow-hidden relative">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-3">
              <h2 className="text-4xl title-font gradient-text">{content.title}</h2>
              <div className="flex flex-wrap gap-2">
                {content.traits?.map(t => (
                  <span key={t} className="px-4 py-1 bg-purple-50 dark:bg-purple-900/20 text-[10px] text-purple-600 dark:text-purple-300 font-bold rounded-full border border-purple-200/50">#{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={toggleFavorite}
                className={`p-4 rounded-full transition-all group ${isCollected ? 'bg-pink-100 text-pink-500' : 'bg-white/60 dark:bg-white/5 text-gray-400 hover:shadow-lg'}`}
              >
                <Star size={20} fill={isCollected ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={() => onCopy(content.body || '')}
                className="p-4 bg-white/60 dark:bg-white/5 rounded-full hover:shadow-lg transition-all group text-gray-400"
              >
                {copied ? <Check className="text-green-500" size={20} /> : <Copy className="group-hover:text-purple-400" size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="p-8 bg-white/40 dark:bg-black/20 rounded-[32px] border border-white/60 dark:border-white/5 italic leading-[2] text-gray-700 dark:text-gray-300 text-lg whitespace-pre-wrap">
                {content.body}
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 glass rounded-[32px]">
                <h4 className="text-xs font-bold text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]"><Heart size={14} /> 宿命羁绊</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{content.pairings}</p>
              </div>
              <div className="p-6 glass rounded-[32px]">
                <h4 className="text-xs font-bold text-pink-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]"><Info size={14} /> 情节之锁</h4>
                <ul className="text-[11px] text-gray-500 dark:text-gray-400 space-y-4">
                  {content.plotHooks?.map((h, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed">
                      <ChevronRight size={14} className="flex-shrink-0 text-pink-300" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'drawing' && content.imageUrl && (
        <div className="max-w-xl mx-auto glass rounded-[48px] overflow-hidden shadow-2xl relative group">
          <img src={content.imageUrl} className="w-full h-auto object-cover" alt="Hua Yun Art" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-12 flex flex-col justify-end">
             <p className="text-white/90 text-sm mb-6 italic leading-relaxed">“{content.description}”</p>
             <div className="flex gap-3">
               <button 
                 onClick={toggleFavorite} 
                 className={`flex-1 py-4 backdrop-blur-xl rounded-full font-bold transition-all flex items-center justify-center gap-3 ${
                   isCollected ? 'bg-pink-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'
                 }`}
               >
                 <Star size={20} fill={isCollected ? 'white' : 'none'} /> 
                 {isCollected ? '已存入画轴' : '收藏此卷'}
               </button>
               <a href={content.imageUrl} download="huayun_masterpiece.png" className="flex-1 py-4 bg-white/20 backdrop-blur-xl rounded-full text-white text-center font-bold hover:bg-white/40 transition-all flex items-center justify-center gap-3">
                 <Download size={20} /> 保存至本地
               </a>
             </div>
          </div>
        </div>
      )}

      {type === 'inspiration' && (
        <div className="glass rounded-[48px] p-12 text-center space-y-10 bg-gradient-to-br from-pink-50/30 to-purple-50/30 dark:from-pink-900/10 dark:to-purple-900/10 max-w-2xl mx-auto shadow-2xl relative">
          <button onClick={toggleFavorite} className={`absolute top-8 right-8 p-3 rounded-full transition-all ${isCollected ? 'text-pink-500' : 'text-gray-300'}`}>
            <Star size={24} fill={isCollected ? 'currentColor' : 'none'} />
          </button>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">灵光一闪</h2>
            <div className="flex justify-center flex-wrap gap-2">
              {content.traits?.map(t => (
                <span key={t} className="px-4 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-500 dark:text-pink-300 text-[11px] font-bold rounded-full border border-pink-200">#{t}</span>
              ))}
            </div>
          </div>
          <div className="py-12 border-y border-white/40 dark:border-white/5 space-y-4">
            <h3 className="text-2xl text-purple-600 dark:text-purple-400 font-bold">{content.pairings}</h3>
            <p className="text-gray-600 dark:text-gray-400 italic leading-[1.8] px-6 text-lg">“{content.description}”</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResultDisplay;
