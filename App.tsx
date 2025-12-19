
import React from 'react';
import { 
  Moon, 
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import CharacterSelector from './components/CharacterSelector';
import GenerationPanel from './components/GenerationPanel';
import ResultDisplay from './components/ResultDisplay';
import HistoryPanel from './components/HistoryPanel';
import CollectionsPanel from './components/CollectionsPanel';

import { AppProvider, useApp } from './store/AppContext';

const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();
  const { theme, activeType, result, history } = state;

  const toggleTheme = () => dispatch({ type: 'SET_THEME', payload: theme === 'light' ? 'dark' : 'light' });

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0f0f15]' : 'bg-[#fdfcfb]'}`}>
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0], x: [0, 50, 0], y: [0, 20, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-purple-100/50 to-transparent blur-[80px] dark:from-purple-900/20 will-change-transform" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0], x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-1/2 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-pink-100/40 to-transparent blur-[80px] dark:from-pink-900/10 Scenic will-change-transform" 
        />
      </div>

      <header className="pt-12 pb-16 text-center relative px-4">
        <button 
          onClick={toggleTheme}
          className="absolute top-8 right-8 p-3 glass rounded-full hover:shadow-xl transition-all z-20"
        >
          {theme === 'light' ? <Moon className="text-gray-500" size={20} /> : <Sun className="text-yellow-400" size={20} />}
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl md:text-8xl title-font gradient-text mb-4 drop-shadow-sm">墨色生香</h1>
          <p className="text-sm md:text-base text-gray-400 dark:text-gray-500 tracking-[0.5em] font-light uppercase">凡所见皆为幻影 · 凡所书皆为心声</p>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
        <CharacterSelector 
          activeId={activeType} 
          onSelect={(id) => dispatch({ type: 'SET_TYPE', payload: id })} 
        />

        <GenerationPanel />

        <AnimatePresence mode="wait">
          {result && (
            <ResultDisplay 
              key={result.id}
              type={activeType} 
              item={result} 
            />
          )}
        </AnimatePresence>

        <CollectionsPanel />

        <HistoryPanel 
          items={history} 
          onSelect={(item) => {
            dispatch({ type: 'SET_TYPE', payload: item.type });
            if (item.style) dispatch({ type: 'SET_STYLE', payload: item.style });
            dispatch({ type: 'SET_PROMPT', payload: item.prompt });
            dispatch({ type: 'SET_RESULT', payload: item });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          onDelete={(id) => dispatch({ type: 'DELETE_HISTORY', payload: id })} 
        />
      </main>

      <footer className="text-center py-20 text-gray-400 dark:text-gray-600 text-[10px] tracking-[0.3em] font-light opacity-60 border-t border-gray-100 dark:border-white/5 mx-10">
        © 墨色生香 AI 创作工坊 · 唯美耽美创作之源
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
