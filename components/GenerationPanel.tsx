
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Flower2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import PromptInput from './PromptInput';
import StyleSettings from './StyleSettings';
import KeywordSelector from './KeywordSelector';
import ImageKeywordSelector from './ImageKeywordSelector';
import { useApp } from '../store/AppContext';
import { api } from '../services/api';
import { HistoryItem, ApiResponse, DanmeiContent } from '../types';

const GenerationPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const { activeType, activeStyle, prompt, keywords, imageKeywords, loading } = state;
  const [error, setError] = React.useState<string | null>(null);
  const [showKeywords, setShowKeywords] = React.useState(true);

  const handleCreate = async () => {
    // 性能优化：由于 PromptInput 状态局部化，这里实际上会使用全局 Context 中的 prompt。
    // 在 PromptInput 失去焦点时已经完成了同步，所以这里可以直接使用。

    // Validation
    if (activeType === 'writing') {
      const hasKeywords = Object.values(keywords).some(v => v !== undefined);
      if (!prompt && !hasKeywords) {
        setError("请至少输入剧情描述或选择关键词");
        return;
      }
    } else if (activeType === 'drawing') {
      const hasImageKeywords = Object.values(imageKeywords).some(v => v !== undefined);
      if (!prompt && !hasImageKeywords) {
        setError("请描述画面或选择视觉参数");
        return;
      }
    } else {
      if (!prompt && activeType !== 'inspiration') return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_RESULT', payload: null });
    setError(null);

    let response: ApiResponse<DanmeiContent>;

    try {
      if (activeType === 'writing') {
        response = await api.generateText(prompt, activeStyle, keywords);
      } else if (activeType === 'drawing') {
        response = await api.generateImage(prompt, imageKeywords);
      } else {
        response = await api.generateInspiration();
      }

      if (response.success && response.data) {
        dispatch({ type: 'SET_RESULT', payload: response.data });
        
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          type: activeType,
          style: activeType === 'writing' ? activeStyle : undefined,
          prompt: prompt,
          keywords: activeType === 'writing' ? keywords : undefined,
          imageKeywords: activeType === 'drawing' ? imageKeywords : undefined,
          content: response.data,
          timestamp: Date.now()
        };
        dispatch({ type: 'ADD_HISTORY', payload: newItem });
      } else {
        setError(response.error || "创作之路受阻，请稍后再试");
      }
    } catch (e) {
      setError("灵感源泉枯竭，请检查网络后重试");
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="glass rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <Flower2 size={120} className="text-purple-400 rotate-12" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {activeType === 'writing' ? '开启一段尘缘' : 
                 activeType === 'drawing' ? '描摹惊鸿一瞥' : '求取灵感馈赠'}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {activeType === 'writing' ? '选择关键词或描述你心之所向的情节...' : 
                 activeType === 'drawing' ? '选择视觉参数或描述你心之所向的画面...' : '描述你心之所向的情感...'}
              </p>
            </div>
            {activeType === 'writing' && (
              <StyleSettings 
                activeStyle={activeStyle} 
                onStyleChange={(s) => dispatch({ type: 'SET_STYLE', payload: s })} 
              />
            )}
          </div>

          {(activeType === 'writing' || activeType === 'drawing') && (
            <div className="space-y-6">
              <button 
                onClick={() => setShowKeywords(!showKeywords)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors uppercase tracking-widest ${activeType === 'writing' ? 'text-purple-400' : 'text-blue-400'}`}
              >
                <span>{activeType === 'writing' ? '人设与情节关键词' : '视觉与美学参数'}</span>
                {showKeywords ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              <AnimatePresence>
                {showKeywords && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {activeType === 'writing' ? <KeywordSelector /> : <ImageKeywordSelector />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeType !== 'inspiration' && (
            <div className="space-y-4">
              <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">
                {activeType === 'writing' ? '剧情补充描述 (可选)' : '提示词输入'}
              </div>
              <PromptInput 
                value={prompt} 
                onChange={(v) => dispatch({ type: 'SET_PROMPT', payload: v })} 
                placeholder={activeType === 'writing' ? "补充描述，如：最后告别时的雪山之巅..." : "例如：漫天花雨中，少年撑伞回眸的瞬间..."} 
              />
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-500 text-sm"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading || (activeType !== 'inspiration' && activeType !== 'writing' && activeType !== 'drawing' && !prompt)}
            className={`w-full py-5 rounded-[32px] flex items-center justify-center gap-3 text-white font-bold text-lg shadow-xl btn-aesthetic transition-all transform hover:scale-[1.01] active:scale-95 ${
              loading ? 'opacity-70 grayscale' : ''
            }`}
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={20} />}
            <span>{loading ? '助手正凝神构思...' : '开启创作灵感'}</span>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default React.memo(GenerationPanel);