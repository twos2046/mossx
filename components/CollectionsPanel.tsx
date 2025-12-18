
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CollectionItem } from '../types';
// Import the api service to handle data operations
import { api } from '../services/api';

const CollectionsPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const { collections } = state;

  // Added handleToggleCollection to interact with the persistent storage via api service
  const handleToggleCollection = async (item: CollectionItem) => {
    const response = await api.toggleFavorite(item);
    if (response.success && response.data) {
      dispatch({ type: 'SET_COLLECTIONS', payload: response.data });
    }
  };

  if (collections.length === 0) return null;

  return (
    <div className="mt-20 space-y-8">
      <div className="flex items-center gap-3 px-4">
        <Star size={20} className="text-pink-400 fill-pink-400" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-wider">我的收藏</h3>
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
              className="glass rounded-3xl overflow-hidden group hover:shadow-2xl transition-all border-white/40"
            >
              {item.type === 'drawing' ? (
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={item.content.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Favorite art" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button 
                       onClick={() => dispatch({ type: 'SET_RESULT', payload: item.content })}
                       className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"
                     >
                       <ExternalLink size={20} />
                     </button>
                     <button 
                       // Fixed: Replaced TOGGLE_COLLECTION action with handleToggleCollection call
                       onClick={() => handleToggleCollection(item)}
                       className="p-3 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                     >
                       <Trash2 size={20} />
                     </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-tighter">
                      {item.type === 'writing' ? '墨韵' : '灵感'}
                    </span>
                    <button 
                      // Fixed: Replaced TOGGLE_COLLECTION action with handleToggleCollection call
                      onClick={() => handleToggleCollection(item)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
                    {item.type === 'writing' ? item.content.title : item.content.pairings}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 italic mb-6">
                    {item.content.body || item.content.description}
                  </p>
                  <button 
                    onClick={() => {
                      dispatch({ type: 'SET_TYPE', payload: item.type });
                      dispatch({ type: 'SET_RESULT', payload: item.content });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-auto text-xs font-bold text-purple-500 hover:underline flex items-center gap-1"
                  >
                    回顾此卷 <ExternalLink size={12} />
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
