
import React from 'react';
import { History, Trash2, RotateCcw, Clock, ChevronRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

const ArticleHistory: React.FC<Props> = ({ history, onSelect, onClear, onDelete }) => {
  if (history.length === 0) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getStyleLabel = (style: string) => {
    // Updated labels to match DanmeiStyle keys
    const labels: Record<string, string> = {
      ancient: '古风',
      modern: '现代',
      fantasy: '玄幻',
      campus: '校园',
      cyberpunk: '科幻'
    };
    return labels[style] || style;
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <History size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold">生成历史</h2>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={14} />
          清除所有
        </button>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
          >
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                  {/* Fixed: Access item.style directly instead of item.params.style */}
                  {getStyleLabel(item.style || '')}
                </span>
                <span className="text-gray-400 text-[10px] flex items-center gap-0.5">
                  <Clock size={10} />
                  {formatDate(item.timestamp)}
                </span>
              </div>
              <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {/* Fixed: Access item.prompt directly instead of item.params.topic */}
                {item.prompt}
              </h4>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onSelect(item)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="重新加载"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArticleHistory;
