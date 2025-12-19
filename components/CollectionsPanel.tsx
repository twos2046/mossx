
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CollectionItem } from '../types';
import { api } from '../services/api';

const CollectionsPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const { collections } = state;

  const handleToggleCollection = async (item: CollectionItem) => {
    const response = await api.toggleFavorite(item);
    if (response.success && response.data) {
      dispatch({ type: 'SET_COLLECTIONS', payload: response.data });
    }
  };

  const handleRecall = (item: CollectionItem) => {
    // 恢复该收藏项的所有创作上下文
    dispatch({ type: 'SET_TYPE', payload: item.type });
    if (item.style) dispatch({ type: 'SET_STYLE', payload: item.style });
    if (item.prompt) dispatch({ type: 'SET_PROMPT', payload: item.prompt });
    if (item.keywords) dispatch({ type: 'SET_KEYWORDS', payload: item.keywords });
    if (item.imageKeywords) dispatch({ type: 'SET_IMAGE_KEYWORDS', payload: item.imageKeywords });
    
    // 设置当前展示结果为该收藏项
    dispatch({ type: 'SET_RESULT', payload: item });
    
    // 平滑滚动回顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (collections.length === 0) return null;

  return (
    <div className="mt-20 space-y-8">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Star size={20} className="text-pink-400 fill-pink-400" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wider">我的收藏</h3>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
          已藏 {collections.length} 卷
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {collections.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl overflow-hidden group hover:shadow-2xl transition-all border-white/40 flex flex-col h-full"
            >
              {item.type === 'drawing' ? (
                <div className="aspect-[4/5] relative overflow-hidden shrink-0">
                  <img src={item.content.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Favorite art" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button 
                       onClick={() => handleRecall(item)}
                       className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                     >
                       <ExternalLink size={20} />
                     </button>
                     <button 
                       onClick={() => handleToggleCollection(item)}
                       className="p-3 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                     >
                       <Trash2 size={20} />
                     </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                      item.type === 'writing' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
                    } tracking-widest`}>
                      {item.type === 'writing' ? '墨韵' : '灵感'}
                    </span>
                    <button 
                      onClick={() => handleToggleCollection(item)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1 text-base">
                    {item.type === 'writing' ? item.content.title : item.content.pairings}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 italic mb-6 leading-relaxed">
                    {item.content.body || item.content.description}
                  </p>
                  <button 
                    onClick={() => handleRecall(item)}
                    className="mt-auto text-xs font-bold text-purple-500 dark:text-purple-400 hover:text-purple-600 flex items-center gap-1 transition-colors group/btn"
                  >
                    回顾此卷 <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollectionsPanel;
